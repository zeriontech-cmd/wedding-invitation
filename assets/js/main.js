// ============================================================
// Wedding Digital Invitation — Main JS (Split-Screen Vintage)
// ============================================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────
// 1. COVER PAGE
// ─────────────────────────────────────────────
const cover       = document.getElementById('cover');
const openBtn     = document.getElementById('open-btn');
const mainContent = document.getElementById('main-content');

if (!prefersReducedMotion && typeof gsap !== 'undefined') {
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from('#cover-content h1', { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' });
}

openBtn?.addEventListener('click', () => {
  tryPlayMusic();

  if (prefersReducedMotion || typeof gsap === 'undefined') {
    cover.style.display = 'none';
    mainContent.style.opacity = '1';
    mainContent.style.pointerEvents = 'auto';
    return;
  }

  cover.classList.add('closing');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    cover.style.display = 'none';
    document.body.style.overflow = '';

    gsap.to(mainContent, {
      opacity: 1, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out',
      onComplete: () => {
        initScrollAnimations();
        startPetals();
      }
    });
  }, 850);
});

// ─────────────────────────────────────────────
// 2. COUNTDOWN TIMER (Target: 1 Januari 2027)
// ─────────────────────────────────────────────
function initCountdown() {
  const targetDate = new Date('2027-01-01T08:00:00+07:00').getTime();

  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');
  const msgEl   = document.getElementById('cd-message');

  function update() {
    const now  = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (msgEl) {
        msgEl.textContent = '✨ Hari Bahagia Telah Tiba ✨';
        msgEl.style.display = 'block';
      }
      [daysEl, hoursEl, minsEl, secsEl].forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (daysEl)  daysEl.textContent  = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl)  minsEl.textContent  = String(m).padStart(2, '0');
    if (secsEl)  secsEl.textContent  = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}
initCountdown();

// ─────────────────────────────────────────────
// 3. GSAP SCROLL ANIMATIONS (Fluid, Pronounced & Staggered)
// ─────────────────────────────────────────────
function initScrollAnimations() {
  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // General reveal with pronounced elevation and slight scale
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 48,
      scale: 0.95,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Staggered reveal for gallery thumbnails
  if (document.querySelectorAll('.gallery-item').length) {
    gsap.from('.gallery-item', {
      opacity: 0,
      y: 35,
      scale: 0.9,
      duration: 0.75,
      stagger: 0.12,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Staggered pop for countdown timer boxes
  if (document.querySelectorAll('.countdown-pill-box').length) {
    gsap.from('.countdown-pill-box', {
      opacity: 0,
      y: 30,
      scale: 0.82,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '#countdown',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  }
}

// ─────────────────────────────────────────────
// 4. MUSIC PLAYER
// ─────────────────────────────────────────────
const audio     = document.getElementById('bg-audio');
const musicBtn  = document.getElementById('music-btn');
const iconPlay  = document.getElementById('music-icon-play');
const iconPause = document.getElementById('music-icon-pause');
let   isPlaying = false;

function tryPlayMusic() {
  if (!audio) return;
  audio.volume = 0.35;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      isPlaying = true;
      updateMusicUI();
    }).catch(() => {
      isPlaying = false;
      updateMusicUI();
    });
  }
}

function updateMusicUI() {
  if (!musicBtn) return;
  if (isPlaying) {
    musicBtn.setAttribute('aria-label', 'Pause musik latar');
    if (iconPlay)  iconPlay.style.display  = 'none';
    if (iconPause) iconPause.style.display = 'block';
  } else {
    musicBtn.setAttribute('aria-label', 'Play musik latar');
    if (iconPlay)  iconPlay.style.display  = 'block';
    if (iconPause) iconPause.style.display = 'none';
  }
}

musicBtn?.addEventListener('click', () => {
  if (!audio) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  updateMusicUI();
});

// ─────────────────────────────────────────────
// 5. LIGHTBOX GALLERY
// ─────────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');
const galleryItems  = document.querySelectorAll('.gallery-item');
let   currentIndex  = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  const src  = item.dataset.full || item.querySelector('img')?.src;
  if (!lightboxImg || !src) return;
  lightboxImg.src = src;
  lightboxImg.alt = item.querySelector('img')?.alt || 'Foto pernikahan';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Buka foto ${i + 1}`);
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
lightboxNext?.addEventListener('click', () => navigateLightbox(1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ─────────────────────────────────────────────
// 6. COPY TO CLIPBOARD
// ─────────────────────────────────────────────
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    const originalText = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = '✓ Tersalin!';
      setTimeout(() => { btn.textContent = originalText; }, 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = '✓ Tersalin!';
      setTimeout(() => { btn.textContent = originalText; }, 2200);
    }
  });
});

// ─────────────────────────────────────────────
// 7. ADD TO GOOGLE CALENDAR
// ─────────────────────────────────────────────
const openCalendar = () => {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text:   'The Wedding of Raka & Sekar',
    dates:  '20270101T010000Z/20270101T090000Z',
    details:'Pernikahan Raka Mahendra & Sekar Ayu\nGedung Graha Santika, Jakarta',
    location:'Gedung Graha Santika, Jakarta'
  });
  window.open('https://calendar.google.com/calendar/render?' + p.toString(), '_blank', 'noopener');
};

document.getElementById('cal-hero')?.addEventListener('click', openCalendar);

// ─────────────────────────────────────────────
// 8. SCROLL TO TOP
// ─────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn?.classList.add('visible');
  } else {
    scrollTopBtn?.classList.remove('visible');
  }
}, { passive: true });
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─────────────────────────────────────────────
// 9. PETAL PARTICLES
// ─────────────────────────────────────────────
function startPetals() {
  if (prefersReducedMotion) return;
  const colors = ['#D4AF37', '#FAF6EF', '#8FAFC5', '#C4D6E4'];
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 5 + Math.random() * 7;
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${8 + Math.random() * 9}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: 0;
      border-radius: 0 50% 50% 50%;
    `;
    document.body.appendChild(petal);
  }
}

// ─────────────────────────────────────────────
// 10. GIFT TAB SWITCHING
// ─────────────────────────────────────────────
const giftTabs   = document.querySelectorAll('[data-gift-tab]');
const giftPanels = document.querySelectorAll('[data-gift-panel]');

giftTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.giftTab;
    giftTabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('bg-[#557A95]', 'text-white');
      t.classList.add('text-stone-600');
    });
    giftPanels.forEach(p => p.classList.add('hidden'));

    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('bg-[#557A95]', 'text-white');
    tab.classList.remove('text-stone-600');

    const panel = document.querySelector(`[data-gift-panel="${target}"]`);
    panel?.classList.remove('hidden');
  });
});
