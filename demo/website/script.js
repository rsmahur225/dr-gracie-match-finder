/* ============================================================
   DR. GRACIE — SCRIPT.JS
   GSAP Animations · FAQ · Nav · Form
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────
   NAV: scroll shadow + hamburger
───────────────────────────────────── */
const header   = document.getElementById('site-header');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ─────────────────────────────────────
   HERO: entrance timeline
───────────────────────────────────── */
/* Homepage hero only — match-set hero is animated by its own inline script */
if (document.querySelector('.hero-h1')) {
  gsap.timeline({ delay: 0.1 })
    .from('.hero-h1',   { y: 48, opacity: 0, duration: 1.0, ease: 'power3.out' })
    .from('.hero-p',    { y: 28, opacity: 0, duration: 0.75, ease: 'power2.out' }, '-=0.55')
    .from('.hero-btns', { y: 22, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45')
    .from('.hero-trust',{ y: 18, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.38')
    .from('.hero-media',{ x: 60, opacity: 0, duration: 1.1,  ease: 'power3.out' }, '-=0.8');
}

/* ─────────────────────────────────────
   SCROLL REVEALS
   Use gsap.from() + scrollTrigger so
   elements already in-viewport on load
   animate immediately on init — no
   gsap.set() hiding needed.
───────────────────────────────────── */
function revealCards(selector, stagger) {
  const els = gsap.utils.toArray(selector);
  if (!els.length) return;
  gsap.from(els, {
    scrollTrigger: {
      trigger: els[0].closest('section') || els[0],
      start: 'top 92%',
      once: true
    },
    y: 0, opacity: 1, duration: 0.72,
    stagger: stagger || 0.12,
    ease: 'power2.out'
  });
}

function revealSplit(leftSel, rightSel, triggerSel) {
  const trigger = document.querySelector(triggerSel);
  if (!trigger) return;
  const left  = document.querySelector(leftSel);
  const right = document.querySelector(rightSel);
  if (left) {
    gsap.from(left, {
      scrollTrigger: { trigger, start: 'top 92%', once: true },
      x: -48, opacity: 1, duration: 0.9, ease: 'power2.out'
    });
  }
  if (right) {
    gsap.from(right, {
      scrollTrigger: { trigger, start: 'top 92%', once: true },
      x: 48, opacity: 1, duration: 0.9, delay: 0.15, ease: 'power2.out'
    });
  }
}

function revealSection(selector, triggerSel) {
  const el = document.querySelector(selector);
  if (!el) return;
  const trigger = triggerSel ? document.querySelector(triggerSel) : el;
  gsap.from(el, {
    scrollTrigger: { trigger: trigger || el, start: 'top 92%', once: true },
    y: 28, opacity: 1, duration: 0.8, ease: 'power2.out'
  });
}

/* Eyebrows + headings — exclude match-set hero + founder quote (owned by inline script / revealSplit) */
gsap.utils.toArray('.eyebrow, .h2, .sub, .ms-inside-h2').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 95%', once: true },
    y: 20, opacity:1, duration: 0.7, ease: 'power2.out'
  });
});

/* Section-specific cards */
revealCards('.prob-card',    0.13);
revealCards('.concern-item', 0.10);
revealCards('.set-card',     0.13);
revealCards('.why-card',     0.11);
revealCards('.ms-card',      0.13);

/* Split layouts */
revealSplit('#sci-copy',       '#sci-table',       '.sci-sec');
revealSplit('#founder-media',  '#founder-copy',    '.founder-sec');
revealSplit('#ingr-left',      '#faq-right',       '.ingr-sec');
revealSplit('#concern-img',    '#concern-content', '.concern-sec');
revealSplit('#inside-img',     '#inside-content',  '.ms-inside-sec');
revealSplit('#ms-founder-img', '#ms-founder-copy', '.ms-founder-sec');

/* Standalone */
revealSection('#foot-cta-text', '.foot-cta');
revealSection('#ms-cta-text',   '.ms-foot-cta');
revealSection('.testi-sec .wrap h2', '.testi-sec');

/* Ingredient cards stagger (match set page) */
const ingrCards = gsap.utils.toArray('.ingr-card');
if (ingrCards.length) {
  gsap.from(ingrCards, {
    scrollTrigger: { trigger: '.ingr-grid', start: 'top 92%', once: true },
    y: 24, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out'
  });
}

/* Refresh after all triggers are registered so in-viewport
   elements on page-load are caught correctly */
ScrollTrigger.refresh();

/* ─────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ─────────────────────────────────────
   WAITLIST FORM (homepage)
───────────────────────────────────── */
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', e => {
    e.preventDefault();
    const inp = waitlistForm.querySelector('.foot-input');
    const btn = waitlistForm.querySelector('.btn-gld');
    const email = inp.value.trim();
    if (!email || !email.includes('@')) {
      inp.style.borderColor = '#c05050';
      setTimeout(() => { inp.style.borderColor = ''; }, 2000);
      return;
    }
    const orig = btn.textContent;
    btn.textContent = "You're on the list! ✓";
    btn.style.cssText = 'background:#4a7a5c; border-color:#4a7a5c;';
    inp.value = '';
    inp.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.cssText = '';
      inp.disabled = false;
    }, 4000);
  });
}

/* ─────────────────────────────────────
   SMOOTH ANCHOR SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 64) + 8;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ─────────────────────────────────────
   MOBILE STICKY — hide over hero
───────────────────────────────────── */
const mobSticky = document.getElementById('mob-sticky');
if (mobSticky) {
  const hero = document.querySelector('.hero, .ms-hero');
  if (hero) {
    const io = new IntersectionObserver(([entry]) => {
      mobSticky.style.display = entry.isIntersecting ? 'none' : '';
    }, { threshold: 0 });
    io.observe(hero);
  }
}

/* ─────────────────────────────────────
   TESTIMONIAL CAROUSEL
   Pause on hover + touch swipe
───────────────────────────────────── */
const testiOuter = document.getElementById('testi-outer');
const testiTrack = document.getElementById('testi-track');

if (testiOuter && testiTrack) {
  testiOuter.addEventListener('mouseenter', () => testiTrack.classList.add('is-paused'));
  testiOuter.addEventListener('mouseleave', () => testiTrack.classList.remove('is-paused'));

  let touchStartX    = 0;
  let touchStartTime = 0;

  testiOuter.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].clientX;
    touchStartTime = Date.now();
    testiTrack.classList.add('is-paused');
  }, { passive: true });

  testiOuter.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dt = Date.now() - touchStartTime;
    if (Math.abs(dx) < 80 || dt > 400) {
      testiTrack.classList.remove('is-paused');
    } else {
      setTimeout(() => testiTrack.classList.remove('is-paused'), 1200);
    }
  }, { passive: true });
}
