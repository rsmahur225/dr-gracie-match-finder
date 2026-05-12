/* =========================================================
   Dr. Gracie — Hero Landing animations
   GSAP-powered cinematic entrance + ambient motion
   ========================================================= */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('GSAP missing');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ------- Helpers ------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============================================================
     1.  HERO ENTRANCE — blur-to-clear + stagger
     ============================================================ */
  function heroEntrance() {
    if (!$('.hero')) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Page-level: nav fade in
    tl.from('.promo-bar', { y: -30, opacity: 0, duration: 0.6 }, 0);
    tl.from('.site-header .brand', { y: -16, opacity: 0, duration: 0.7 }, 0.1);
    tl.from('.primary-nav a', {
      y: -10, opacity: 0, duration: 0.5, stagger: 0.06,
    }, 0.15);

    // Soft circle bloom (scale + blur lift)
    tl.fromTo('.hero-circle',
      { scale: 0.85, opacity: 0, filter: 'blur(20px)' },
      { scale: 1, opacity: 1, filter: 'blur(0.5px)', duration: 1.5, ease: 'power2.out' },
      0.1
    );

    // Copy: blur-to-clear with stagger
    tl.fromTo('.eyebrow',
      { y: 20, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9 },
      0.4
    );
    tl.fromTo('.hl-line',
      { y: 26, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
      0.5
    );
    tl.fromTo('.hl-italic',
      { y: 30, opacity: 0, scale: 0.96, filter: 'blur(14px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' },
      0.75
    );
    tl.fromTo('.hero-sub',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.95
    );
    tl.fromTo('.hero-cta',
      { y: 18, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      1.05
    );
    tl.fromTo('.hero-bullets li',
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
      1.2
    );

    // Doctor portrait — slide in from right with subtle scale
    tl.fromTo('.portrait-float',
      { x: 60, opacity: 0, scale: 0.97, filter: 'blur(12px)' },
      { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out' },
      0.4
    );

    // Wave ribbons — drawn in via stroke-dash, then stagger to visible
    const ribbons = $$('.ribbon');
    ribbons.forEach((r) => {
      const len = r.getTotalLength ? r.getTotalLength() : 2400;
      gsap.set(r, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });
    tl.to(ribbons, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 2.2,
      stagger: 0.18,
      ease: 'power2.inOut',
    }, 0.5);

    return tl;
  }

  /* ============================================================
     2.  FLOATING DOCTOR + AMBIENT WAVE DRIFT
     ============================================================ */
  function ambientMotion() {
    if (!$('.portrait-float')) return;
    // Doctor: gentle vertical float
    gsap.to('.portrait-float', {
      y: -14,
      duration: 4.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.6,
    });

    // Soft circle: slow breathe
    if ($('.hero-circle')) {
      gsap.to('.hero-circle', {
        scale: 1.04,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.6,
      });
    }

    // Wave ribbons: each drifts on its own offset for parallax feel
    $$('.ribbon').forEach((r, i) => {
      gsap.to(r, {
        y: (i % 2 === 0 ? -16 : 12) - i * 2,
        x: (i % 2 === 0 ? 12 : -10),
        duration: 5 + i * 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2 + i * 0.2,
      });
    });
  }

  /* ============================================================
     3.  CTA — animated sheen + magnetic hover
     ============================================================ */
  function animatedCTA() {
    const cta = $('#heroCta');
    if (!cta) return;

    const sheen = cta.querySelector('.btn-sheen');

    // Recurring sheen sweep
    const sheenLoop = () => {
      gsap.fromTo(sheen,
        { x: '-150%' },
        {
          x: '250%',
          duration: 1.4,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.delayedCall(2.6, sheenLoop);
          },
        }
      );
    };
    gsap.delayedCall(2.0, sheenLoop);

    // Magnetic hover (subtle)
    const label = cta.querySelector('.btn-label');
    const maxX = 6, maxY = 4;
    cta.addEventListener('mousemove', (e) => {
      const r = cta.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(cta, { x: cx * maxX * 2, y: cy * maxY * 2, duration: 0.4, ease: 'power3.out' });
      gsap.to(label, { x: cx * maxX, y: cy * maxY, duration: 0.4, ease: 'power3.out' });
    });
    cta.addEventListener('mouseleave', () => {
      gsap.to([cta, label], { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      // Premium transition placeholder — pulse + nav
      gsap.timeline()
        .to(cta, { scale: 0.96, duration: 0.12, ease: 'power2.out' })
        .to(cta, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
        .to('body', {
          opacity: 0, duration: 0.45, ease: 'power2.inOut',
          onComplete: () => { window.location.href = 'name.html'; }
        }, '+=0.05')
        .to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '+=0.1');
    });
  }

  /* ============================================================
     4.  WAITLIST FORM
     ============================================================ */
  function waitlistForm() {
    const form = $('#waitlistForm');
    if (!form) return;
    const note = $('#waitlistNote');
    const input = $('#email', form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (!ok) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('is-error');
        note.classList.remove('is-success');
        gsap.fromTo(form, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5, 0.3)' });
        return;
      }
      note.textContent = "You're on the list. We'll be in touch.";
      note.classList.add('is-success');
      note.classList.remove('is-error');
      gsap.fromTo(form, { scale: 0.99 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      input.value = '';
    });
  }

  /* ============================================================
     5.  FOOTER REVEAL ON SCROLL
     ============================================================ */
  function footerReveal() {
    gsap.from('.waitlist-copy > *', {
      scrollTrigger: { trigger: '.site-footer', start: 'top 80%' },
      y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });
    gsap.from('.waitlist-form', {
      scrollTrigger: { trigger: '.site-footer', start: 'top 80%' },
      y: 24, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out',
    });
    gsap.from('.footer-col', {
      scrollTrigger: { trigger: '.footer-cols', start: 'top 90%' },
      y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    });
  }

  /* ============================================================
     6.  Mobile menu toggle (basic)
     ============================================================ */
  function mobileMenu() {
    const toggle = $('.menu-toggle');
    const nav = $('.primary-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      nav.style.display = open ? 'flex' : '';
    });
  }

  /* ============================================================
     6b. ENTER NAME — entrance + validation + transition
     ============================================================ */
  function nameScreen() {
    const stage = $('.stage-name');
    if (!stage) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Promo / header
    tl.from('.promo-bar', { y: -30, opacity: 0, duration: 0.6 }, 0);
    tl.from('.site-header .brand', { y: -16, opacity: 0, duration: 0.7 }, 0.1);
    tl.from('.primary-nav a', { y: -10, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.15);

    // Doctor slide-in from left with blur-to-clear
    tl.fromTo('.portrait-float--left',
      { x: -60, opacity: 0, scale: 0.97, filter: 'blur(14px)' },
      { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2 },
      0.2
    );

    // Eyebrow + headline + form
    tl.fromTo('.stage-name .eyebrow',
      { y: 16, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
      0.5
    );
    tl.fromTo('.name-headline',
      { y: 24, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9 },
      0.65
    );
    tl.fromTo('.name-input-wrap',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.85
    );
    tl.fromTo('.name-cta',
      { y: 18, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      1.0
    );

    // Wave ribbons draw-in
    const ribbons = $$('.stage-name .ribbon');
    ribbons.forEach((r) => {
      const len = r.getTotalLength ? r.getTotalLength() : 1800;
      gsap.set(r, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });
    tl.to(ribbons, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 2.0,
      stagger: 0.15,
      ease: 'power2.inOut',
    }, 0.5);

    /* ---- Form handling ---- */
    const form = $('#nameForm');
    const input = $('#nameInput');
    const cta = $('#nameCta');
    const err = $('#nameError');
    const sheen = cta.querySelector('.btn-sheen');

    // Recurring sheen
    const sheenLoop = () => {
      gsap.fromTo(sheen,
        { x: '-150%' },
        { x: '250%', duration: 1.4, ease: 'power2.inOut',
          onComplete: () => gsap.delayedCall(2.8, sheenLoop) });
    };
    gsap.delayedCall(1.8, sheenLoop);

    // Magnetic CTA hover (subtle)
    const label = cta.querySelector('.btn-label');
    cta.addEventListener('mousemove', (e) => {
      const r = cta.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(cta, { x: cx * 10, y: cy * 6, duration: 0.4, ease: 'power3.out' });
      gsap.to(label, { x: cx * 5, y: cy * 3, duration: 0.4, ease: 'power3.out' });
    });
    cta.addEventListener('mouseleave', () => {
      gsap.to([cta, label], { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });

    // Live input — clear error on type, focus pulse
    input.addEventListener('input', () => {
      if (err.textContent) err.textContent = '';
    });
    input.addEventListener('focus', () => {
      gsap.fromTo(input, { scale: 0.995 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });

    // Submit — validate, save, fade-out transition
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (v.length < 2) {
        err.textContent = 'Please enter at least 2 characters.';
        gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.3)' });
        input.focus();
        return;
      }
      try { sessionStorage.setItem('drg.name', v); } catch (_) {}

      // Premium fade-out + (placeholder) navigate to quiz
      const out = gsap.timeline({
        onComplete: () => {
          // window.location.href = 'quiz.html';
        }
      });
      out.to('.name-portrait', { x: -40, opacity: 0, filter: 'blur(10px)', duration: 0.7, ease: 'power3.in' }, 0);
      out.to('.name-form-wrap > *', { y: -20, opacity: 0, filter: 'blur(10px)', duration: 0.6, stagger: 0.05, ease: 'power3.in' }, 0.05);
      out.to('.stage-name', { backgroundColor: '#e9f0f5', duration: 0.6 }, 0);
    });
  }

  /* ============================================================
     6c. QUIZ FLOW — state machine + slide transitions
     ============================================================ */
  function quizScreen() {
    const stage = $('#quizStage');
    if (!stage) return;

    const dataEl = $('#quiz-data');
    if (!dataEl) return;
    let data;
    try { data = JSON.parse(dataEl.textContent); } catch (_) { return; }
    const questions = data.questions || [];
    if (!questions.length) return;

    const TOTAL = questions.length;
    const state = {
      index: 0,
      answers: new Array(TOTAL).fill(null), // { id, kit }
    };

    /* ---- DOM refs ---- */
    const fill = $('#progressFill');
    const badge = $('#progressBadge');
    const badgeText = $('#progressBadgeText');
    const label = $('#progressLabel');
    const backBtn = $('#progressBack');
    const nextBtn = $('#quizNext');
    const nextLabel = $('#quizNextLabel');

    /* ---- Helpers ---- */
    const pad = (n) => String(n).padStart(2, '0');
    function pct(idx) {
      return Math.round(((idx + 1) / TOTAL) * 100);
    }
    function updateProgress(animate = true) {
      const p = pct(state.index);
      const trackWidth = fill.parentElement.getBoundingClientRect().width;
      const fillWidth = (p / 100) * trackWidth;
      if (animate) {
        gsap.to(fill, { width: p + '%', duration: 0.7, ease: 'power3.out' });
        // Badge slides above fill end
        gsap.to(badge, {
          left: fillWidth + 'px',
          duration: 0.7,
          ease: 'power3.out',
        });
        // Animated number
        const obj = { v: parseInt(badgeText.textContent) || 0 };
        gsap.to(obj, {
          v: p,
          duration: 0.7,
          ease: 'power3.out',
          snap: { v: 1 },
          onUpdate: () => { badgeText.textContent = obj.v + '%'; },
        });
      } else {
        fill.style.width = p + '%';
        badge.style.left = fillWidth + 'px';
        badgeText.textContent = p + '%';
      }
      label.textContent = `Question ${pad(state.index + 1)}`;
      backBtn.disabled = state.index === 0;

      // Final question — CTA label changes
      nextLabel.textContent = state.index === TOTAL - 1 ? 'See My Results' : 'Next Question';
    }

    /* ---- Render a question slide ---- */
    function buildSlide(qIdx) {
      const q = questions[qIdx];
      const slide = document.createElement('div');
      slide.className = 'quiz-slide';
      slide.dataset.idx = qIdx;
      slide.innerHTML = `
        <div class="quiz-eyebrow">
          <span class="eyebrow-line"></span>
          <span>Question ${pad(qIdx + 1)}</span>
        </div>
        <h2 class="quiz-question">${q.title}</h2>
        <div class="answer-grid" role="radiogroup">
          ${q.options.map((opt, i) => `
            <button type="button"
              class="answer-card"
              role="radio"
              aria-checked="false"
              data-opt-id="${opt.id}"
              data-kit="${opt.kit}"
              data-idx="${i}">
              <span class="answer-check" aria-hidden="true"></span>
              <span class="answer-title">${opt.title}</span>
              <p class="answer-sub">${opt.sub}</p>
            </button>
          `).join('')}
        </div>
      `;
      // Wire up clicks
      $$('.answer-card', slide).forEach((card) => {
        card.addEventListener('click', () => selectAnswer(slide, card));
        // Hover micro-tilt
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotationX: cy * -3,
            rotationY: cx * 3,
            transformPerspective: 700,
            duration: 0.4,
            ease: 'power3.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
        });
      });

      // Restore previous answer if revisiting
      const prev = state.answers[qIdx];
      if (prev) {
        const pc = slide.querySelector(`.answer-card[data-opt-id="${prev.id}"]`);
        if (pc) {
          pc.classList.add('is-selected');
          pc.setAttribute('aria-checked', 'true');
        }
      }
      return slide;
    }

    function selectAnswer(slide, card) {
      $$('.answer-card', slide).forEach((c) => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
      state.answers[state.index] = {
        id: card.dataset.optId,
        kit: card.dataset.kit,
      };
      enableNext(true);

      // Soft pop animation
      gsap.fromTo(card,
        { scale: 0.97 },
        { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }
      );
    }

    function enableNext(on) {
      nextBtn.disabled = !on;
      gsap.to(nextBtn, { opacity: on ? 1 : 0.55, duration: 0.3 });
    }

    /* ---- Slide transitions ---- */
    function goTo(nextIdx, dir = 1) {
      if (nextIdx < 0 || nextIdx >= TOTAL) return;
      const current = stage.querySelector('.quiz-slide.is-active');
      const next = buildSlide(nextIdx);
      stage.appendChild(next);

      // Animate out current, in next
      const tl = gsap.timeline({
        onComplete: () => {
          if (current && current.parentNode) current.parentNode.removeChild(current);
          next.classList.add('is-active');
        }
      });

      if (current) {
        tl.to(current, {
          x: dir * -50,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.45,
          ease: 'power3.in',
        }, 0);
      }

      gsap.set(next, { x: dir * 50, opacity: 0, filter: 'blur(12px)' });
      tl.to(next, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.65,
        ease: 'power3.out',
      }, current ? 0.3 : 0);

      // Stagger answer cards in
      tl.fromTo($$('.answer-card', next),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
        current ? 0.5 : 0.2
      );

      state.index = nextIdx;
      updateProgress(true);
      enableNext(!!state.answers[nextIdx]);
    }

    /* ---- Initial slide ---- */
    const first = buildSlide(0);
    first.classList.add('is-active');
    stage.appendChild(first);
    // Initial progress (no animation, then animate)
    updateProgress(false);
    setTimeout(() => updateProgress(true), 100);
    enableNext(false);

    // Initial slide entrance
    gsap.from(first.querySelector('.quiz-eyebrow'), { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 });
    gsap.from(first.querySelector('.quiz-question'), { y: 18, opacity: 0, filter: 'blur(10px)', duration: 0.9, ease: 'power3.out', delay: 0.4 });
    gsap.from($$('.answer-card', first), { y: 18, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.55 });

    // Progress card entrance
    gsap.from('.progress-card', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' });
    // Doctor + wave
    gsap.fromTo('.quiz-portrait .portrait-float',
      { x: -50, opacity: 0, filter: 'blur(12px)' },
      { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    );
    const ribbons = $$('.stage-quiz .ribbon');
    ribbons.forEach((r) => {
      const len = r.getTotalLength ? r.getTotalLength() : 1800;
      gsap.set(r, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });
    gsap.to(ribbons, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 2.0,
      stagger: 0.15,
      ease: 'power2.inOut',
      delay: 0.3,
    });

    // CTA sheen loop
    const sheen = nextBtn.querySelector('.btn-sheen');
    const sheenLoop = () => {
      gsap.fromTo(sheen,
        { x: '-150%' },
        { x: '250%', duration: 1.4, ease: 'power2.inOut',
          onComplete: () => gsap.delayedCall(2.8, sheenLoop) });
    };
    gsap.delayedCall(2, sheenLoop);

    // CTA magnetic hover
    const ctaLabel = nextBtn.querySelector('.btn-label');
    nextBtn.addEventListener('mousemove', (e) => {
      if (nextBtn.disabled) return;
      const r = nextBtn.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(nextBtn, { x: cx * 10, y: cy * 5, duration: 0.4, ease: 'power3.out' });
      gsap.to(ctaLabel, { x: cx * 5, y: cy * 3, duration: 0.4, ease: 'power3.out' });
    });
    nextBtn.addEventListener('mouseleave', () => {
      gsap.to([nextBtn, ctaLabel], { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });

    /* ---- Controls ---- */
    nextBtn.addEventListener('click', () => {
      if (nextBtn.disabled) return;
      if (state.index === TOTAL - 1) {
        // Finish — save & transition out
        try {
          const kitCounts = {};
          state.answers.forEach((a) => { if (a) kitCounts[a.kit] = (kitCounts[a.kit] || 0) + 1; });
          const winner = Object.entries(kitCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fresh';
          sessionStorage.setItem('drg.answers', JSON.stringify(state.answers));
          sessionStorage.setItem('drg.kit', winner);
        } catch (_) {}
        gsap.timeline({
          onComplete: () => { window.location.href = 'result.html'; }
        })
          .to('.quiz-content > *', { y: -20, opacity: 0, filter: 'blur(10px)', duration: 0.6, stagger: 0.05, ease: 'power3.in' }, 0)
          .to('.quiz-portrait', { x: -30, opacity: 0, filter: 'blur(8px)', duration: 0.6, ease: 'power3.in' }, 0)
          .to('.progress-card', { y: -10, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0);
      } else {
        goTo(state.index + 1, 1);
      }
    });

    backBtn.addEventListener('click', () => {
      if (backBtn.disabled) return;
      goTo(state.index - 1, -1);
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
      if (e.key === 'ArrowLeft' && !backBtn.disabled) backBtn.click();
    });
  }

  /* ============================================================
     6d. RESULT PAGE — cinematic reveal + product staggers
     ============================================================ */
  function resultScreen() {
    const stage = document.querySelector('.stage-result');
    if (!stage) return;

    // Personalize based on stored quiz answer
    try {
      const kit = sessionStorage.getItem('drg.kit');
      const dataEl = $('#kit-data');
      if (kit && dataEl) {
        const data = JSON.parse(dataEl.textContent);
        const info = data[kit];
        if (info) {
          const nameEl = $('#kitName');
          const bodyEl = $('#kitBody');
          if (nameEl) nameEl.textContent = info.name;
          if (bodyEl) bodyEl.textContent = info.body;
        }
      }
      const name = sessionStorage.getItem('drg.name');
      if (name) {
        const bodyEl = $('#kitBody');
        if (bodyEl) bodyEl.textContent = `${name}, ${bodyEl.textContent}`;
      }
    } catch (_) {}

    /* ---- Hero cinematic reveal ---- */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Circle bloom
    gsap.set('.result-circle', { scale: 0.85, opacity: 0 });
    tl.to('.result-circle', { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' }, 0);

    // Doctor slide in from left with blur
    gsap.set('.result-doctor .portrait-float', { x: -60, opacity: 0, filter: 'blur(12px)' });
    tl.to('.result-doctor .portrait-float',
      { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2 }, 0.2);

    // Copy stagger
    const copyEls = [
      '.result-copy .eyebrow-gold',
      '.result-title-line',
      '.result-title-kit',
      '.result-body',
      '.result-badge',
    ];
    copyEls.forEach((sel) => gsap.set(sel, { y: 24, opacity: 0, filter: 'blur(10px)' }));
    tl.to(copyEls, {
      y: 0, opacity: 1, filter: 'blur(0px)',
      duration: 0.9, stagger: 0.13,
    }, 0.4);

    // Kit name has its own dramatic reveal
    tl.fromTo('.result-title-kit',
      { letterSpacing: '0.08em' },
      { letterSpacing: '-0.005em', duration: 1.4, ease: 'power3.out' },
      0.6);

    // Product still life rises from below with scale
    gsap.set('.result-products', { y: 50, opacity: 0, scale: 0.95, filter: 'blur(8px)' });
    tl.to('.result-products', {
      y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 1.4, ease: 'power3.out',
    }, 0.7);

    /* ---- Floating doctor & products ambient ---- */
    gsap.to('.result-doctor .portrait-float', {
      y: -10,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
    gsap.to('.result-products', {
      y: -8,
      duration: 5.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.3,
    });

    /* ---- Soft circle breathing ---- */
    gsap.to('.result-circle', {
      scale: 1.04,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2,
    });

    /* ---- 3-step cards: scroll-trigger stagger ---- */
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Section header
      gsap.from('.steps-head > *', {
        y: 28, opacity: 0, filter: 'blur(8px)',
        duration: 0.9, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.steps-head',
          start: 'top 80%',
          once: true,
        },
      });

      // Cards staggered rise
      gsap.from('.step-card', {
        y: 60, opacity: 0, scale: 0.96, filter: 'blur(8px)',
        duration: 1.0, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 78%',
          once: true,
        },
      });

      // Product images extra zoom-in within cards
      gsap.from('.step-image img', {
        scale: 0.8, opacity: 0,
        duration: 1.1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 78%',
          once: true,
        },
      });

      // Best value panel
      gsap.from('.bv-copy > *', {
        x: -30, opacity: 0, filter: 'blur(8px)',
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.stage-bestvalue',
          start: 'top 70%',
          once: true,
        },
      });
      gsap.from('.bv-image', {
        x: 40, opacity: 0, scale: 0.94,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.stage-bestvalue',
          start: 'top 70%',
          once: true,
        },
      });
    }

    /* ---- Premium card 3D-tilt on mousemove ---- */
    $$('.step-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotationX: cy * -4,
          rotationY: cx * 5,
          transformPerspective: 900,
          duration: 0.5,
          ease: 'power3.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out' });
      });
    });

    /* ---- BV CTA sheen ---- */
    const bvCta = $('.bv-cta');
    if (bvCta) {
      const sheen = bvCta.querySelector('.btn-sheen');
      const sheenLoop = () => {
        gsap.fromTo(sheen,
          { x: '-150%' },
          { x: '250%', duration: 1.5, ease: 'power2.inOut',
            onComplete: () => gsap.delayedCall(3.2, sheenLoop) });
      };
      gsap.delayedCall(2.5, sheenLoop);

      bvCta.addEventListener('click', () => {
        gsap.to(bvCta, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      });
    }
  }
  

  /* ============================================================
     Init
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    heroEntrance();
    nameScreen();
    quizScreen();
    resultScreen();
    ambientMotion();
    animatedCTA();
    waitlistForm();
    footerReveal();
    mobileMenu();
  });
})();
