// ============================================================
// Guestbook / Ucapan & Doa — Google Sheets via Apps Script
// ============================================================

// ⚠️  Ganti URL ini dengan URL deployment Google Apps Script Anda
// (bisa pakai endpoint yang sama dengan RSVP, beda 'action' parameter)
const GUESTBOOK_ENDPOINT = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';

const wishForm    = document.getElementById('wish-form');
const wishesList  = document.getElementById('wishes-list');
const wishSuccess = document.getElementById('wish-success');
const wishError   = document.getElementById('wish-error');

// ── LOAD UCAPAN ──
async function loadWishes() {
  if (!wishesList) return;

  // Show skeleton
  wishesList.innerHTML = `
    <div class="text-center py-8 text-stone-400 text-sm italic">
      Memuat ucapan...
    </div>`;

  try {
    const res  = await fetch(GUESTBOOK_ENDPOINT + '?action=getWishes', { cache: 'no-store' });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      wishesList.innerHTML = `
        <div class="text-center py-8 text-stone-400 text-sm italic">
          Jadilah yang pertama memberikan ucapan 💌
        </div>`;
      return;
    }

    wishesList.innerHTML = data.reverse().map((w, i) => `
      <div class="wish-card mb-3 ${i === 0 ? 'opacity-0 translate-y-4' : ''}">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-amber-700 text-lg">✦</span>
          <span class="font-semibold text-stone-800" style="font-family:'Cormorant Infant',serif">${escapeHtml(w.name || 'Anonim')}</span>
          <span class="text-xs text-stone-400 ml-auto">${w.timestamp || ''}</span>
        </div>
        <p class="text-stone-600 mt-1 leading-relaxed" style="font-family:'Cormorant Infant',serif;font-size:1rem">${escapeHtml(w.message || '')}</p>
      </div>
    `).join('');

    // Animate first card in
    if (data.length > 0) {
      const firstCard = wishesList.querySelector('.wish-card');
      if (firstCard) {
        setTimeout(() => {
          firstCard.style.transition = 'opacity 0.5s, transform 0.5s';
          firstCard.style.opacity = '1';
          firstCard.style.transform = 'translateY(0)';
        }, 100);
      }
    }

  } catch (err) {
    console.warn('Guestbook load error (expected in demo):', err);
    wishesList.innerHTML = renderDemoWishes();
  }
}

// Demo wishes untuk tampil saat endpoint belum dikonfigurasi
function renderDemoWishes() {
  const demos = [
    { name: 'Budi & Rina', message: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu! 🌸', timestamp: '1 hari lalu' },
    { name: 'Keluarga Haryanto', message: 'Selamat menempuh hidup baru. Semoga langgeng dan selalu dalam lindungan Allah SWT. 🤲', timestamp: '2 hari lalu' },
    { name: 'Dian & Reza', message: 'Bahagia selalu ya kak Raka dan kak Sekar! Semoga cepat dapat momongan hehe 😊', timestamp: '3 hari lalu' },
  ];
  return demos.map(w => `
    <div class="wish-card mb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-amber-700 text-lg">✦</span>
        <span class="font-semibold text-stone-800" style="font-family:'Cormorant Infant',serif">${w.name}</span>
        <span class="text-xs text-stone-400 ml-auto">${w.timestamp}</span>
      </div>
      <p class="text-stone-600 mt-1 leading-relaxed" style="font-family:'Cormorant Infant',serif;font-size:1rem">${w.message}</p>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── KIRIM UCAPAN ──
wishForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn  = wishForm.querySelector('[type="submit"]');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  submitBtn.disabled = true;
  btnText?.classList.add('hidden');
  btnLoading?.classList.remove('hidden');
  wishSuccess?.classList.add('hidden');
  wishError?.classList.add('hidden');

  const payload = {
    action:    'addWish',
    name:      document.getElementById('wish-name')?.value.trim() || 'Anonim',
    message:   document.getElementById('wish-message')?.value.trim() || '',
    timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  };

  try {
    await fetch(GUESTBOOK_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    wishSuccess?.classList.remove('hidden');
    wishForm.reset();
    setTimeout(() => loadWishes(), 1500);

  } catch (err) {
    console.error('Guestbook submit error:', err);
    wishError?.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    btnText?.classList.remove('hidden');
    btnLoading?.classList.add('hidden');
  }
});

// ── INIT ──
loadWishes();
