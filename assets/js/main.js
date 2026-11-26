// ============================================================
// Wedding Digital Invitation — Main JS (Split-Screen Vintage)
// ============================================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────
// 0. DYNAMIC GUEST NAME (Base64 ?v= with ?to= Fallback)
// ─────────────────────────────────────────────
function initGuestName() {
  const guestEl = document.getElementById('guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');
  if (!guestEl) return;

  const params = new URLSearchParams(window.location.search);
  let guestName = '';

  // 1. Try decode Base64 parameter ?v=
  const base64Param = params.get('v');
  if (base64Param) {
    try {
      const normalized = base64Param.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = decodeURIComponent(escape(atob(normalized)));
      if (decoded && decoded.trim().length > 0) {
        guestName = decoded.trim();
      }
    } catch (e) {
      console.warn('Gagal membaca parameter Base64 v:', e);
    }
  }

  // 2. Fallback parameter ?to= / ?u= / ?guest=
  if (!guestName) {
    const rawParam = params.get('to') || params.get('u') || params.get('guest');
    if (rawParam && rawParam.trim().length > 0) {
      guestName = rawParam.trim();
    }
  }

  // 3. Render name & auto-fill RSVP form
  if (guestName) {
    guestEl.textContent = guestName;
    if (rsvpNameInput && !rsvpNameInput.value) {
      rsvpNameInput.value = guestName;
    }
  } else {
    guestEl.textContent = 'Tamu Undangan';
  }
}
initGuestName();

// ─────────────────────────────────────────────
// 1. COVER PAGE
// ─────────────────────────────────────────────
const cover           = document.getElementById('cover');
const openBtn         = document.getElementById('open-btn');
const mainContent     = document.getElementById('main-content');
const leafCurtain     = document.getElementById('leaf-curtain');
const leafLeftBack    = document.getElementById('leaf-left-back');
const leafLeftFront   = document.getElementById('leaf-left-front');
const leafRightBack   = document.getElementById('leaf-right-back');
const leafRightFront  = document.getElementById('leaf-right-front');

if (!prefersReducedMotion && typeof gsap !== 'undefined') {
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from('#cover-content h1', { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' });
}

function scatterLeafBurst() {
  if (prefersReducedMotion) return;
  const leafColors = ['#6E8B68', '#95B099', '#E5A9B8', '#D48A9B', '#D4AF37'];
  for (let i = 0; i < 16; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'petal';
    const size = 8 + Math.random() * 10;
    leaf.style.cssText = `
      left: ${15 + Math.random() * 70}%;
      top: ${Math.random() * 25}%;
      width: ${size}px;
      height: ${size * 1.4}px;
      background: ${leafColors[Math.floor(Math.random() * leafColors.length)]};
      animation-duration: ${4.5 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 0.45}s;
      opacity: 0.85;
      border-radius: 0 75% 0 75%;
    `;
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), 9000);
  }
}

openBtn?.addEventListener('click', () => {
  tryPlayMusic();

  if (prefersReducedMotion || typeof gsap === 'undefined' || !leafCurtain) {
    cover.style.display = 'none';
    mainContent.style.opacity = '1';
    mainContent.style.pointerEvents = 'auto';
    initScrollAnimations();
    startPetals();
    return;
  }

  document.body.style.overflow = 'hidden';
  leafCurtain.classList.add('active');

  // Initial state: 2 tangkai kiri & 2 tangkai kanan sedikit di luar, siap menyatu lembut
  gsap.set([leafLeftBack, leafLeftFront], { xPercent: -55, opacity: 0, scale: 1.03 });
  gsap.set(leafLeftBack,  { rotation: -5 });
  gsap.set(leafLeftFront, { rotation: -9 });

  gsap.set([leafRightBack, leafRightFront], { xPercent: 55, opacity: 0, scale: 1.03 });
  gsap.set(leafRightBack,  { rotation: 5 });
  gsap.set(leafRightFront, { rotation: 9 });

  const curtainTl = gsap.timeline({
    onComplete: () => {
      leafCurtain.classList.remove('active');
      document.body.style.overflow = '';
      initScrollAnimations();
      startPetals();
    }
  });

  curtainTl
    // 1. Kedua lapis tangkai bunga & daun masuk sangat lembut sambil cover memudar perlahan
    .to([leafLeftBack, leafLeftFront], {
      xPercent: 4,
      rotation: 1.5,
      opacity: 1,
      scale: 1,
      duration: 0.95,
      stagger: 0.12,
      ease: 'sine.out'
    })
    .to([leafRightBack, leafRightFront], {
      xPercent: -4,
      rotation: -1.5,
      opacity: 1,
      scale: 1,
      duration: 0.95,
      stagger: 0.12,
      ease: 'sine.out'
    }, '<')
    .to(cover, {
      opacity: 0,
      scale: 1.03,
      duration: 0.95,
      ease: 'sine.inOut',
      onComplete: () => {
        cover.style.display = 'none';
        mainContent.style.opacity = '1';
        mainContent.style.pointerEvents = 'auto';
      }
    }, '<+=0.15')
    .add(() => {
      scatterLeafBurst();
    }, '-=0.15')
    // 2. Continuous Slow Parallax Parting: tirai tangkai bunga menyibak lamban & anggun
    .to(leafLeftFront, {
      xPercent: -120,
      rotation: -12,
      opacity: 0,
      duration: 2.1,
      ease: 'power1.inOut'
    }, '-=0.1')
    .to(leafRightFront, {
      xPercent: 120,
      rotation: 12,
      opacity: 0,
      duration: 2.1,
      ease: 'power1.inOut'
    }, '<')
    .to(leafLeftBack, {
      xPercent: -108,
      rotation: -7,
      opacity: 0,
      duration: 2.45,
      ease: 'sine.inOut'
    }, '<+=0.15')
    .to(leafRightBack, {
      xPercent: 108,
      rotation: 7,
      opacity: 0,
      duration: 2.45,
      ease: 'sine.inOut'
    }, '<')
    // 3. Hero Arch Card muncul perlahan di balik tirai tangkai bunga yang terbuka
    .from('#hero .arch-frame-container', {
      scale: 0.96,
      y: 16,
      opacity: 0,
      duration: 1.4,
      ease: 'power2.out'
    }, '-=1.8');
});

// Auto-open if ?open is present in URL (useful for direct preview & testing)
if (new URLSearchParams(window.location.search).has('open')) {
  if (cover) cover.style.display = 'none';
  if (mainContent) {
    mainContent.style.opacity = '1';
    mainContent.style.pointerEvents = 'auto';
  }
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView();
    }
  }
  setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
      ScrollTrigger.refresh();
    }
    initScrollAnimations();
    startPetals();
  }, 150);
}

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

  // Staggered reveal for gallery thumbnails (safe without locking opacity to zero)
  if (document.querySelectorAll('.gallery-item').length) {
    gsap.from('.gallery-item', {
      scale: 0.94,
      y: 20,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 90%',
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
  console.log({audio});
  audio.volume = 1;
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
  const colors = ['#D4AF37', '#FAF0F2', '#E5A9B8', '#B56E82', '#95B099'];
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
      t.classList.remove('bg-[#9E6374]', 'text-white');
      t.classList.add('text-stone-600');
    });
    giftPanels.forEach(p => p.classList.add('hidden'));

    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('bg-[#9E6374]', 'text-white');
    tab.classList.remove('text-stone-600');

    const panel = document.querySelector(`[data-gift-panel="${target}"]`);
    panel?.classList.remove('hidden');
  });
});
