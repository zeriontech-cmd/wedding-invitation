// ============================================================
// RSVP — Google Sheets via Apps Script
// ============================================================

// ⚠️  Ganti URL ini dengan URL deployment Google Apps Script Anda
// Panduan setup ada di README.md
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';

const rsvpForm    = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');
const rsvpError   = document.getElementById('rsvp-error');

rsvpForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn  = rsvpForm.querySelector('[type="submit"]');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // Loading state
  submitBtn.disabled = true;
  btnText?.classList.add('hidden');
  btnLoading?.classList.remove('hidden');
  rsvpError?.classList.add('hidden');
  rsvpSuccess?.classList.add('hidden');

  const payload = {
    action:     'rsvp',
    name:       document.getElementById('rsvp-name')?.value.trim() || '',
    phone:      document.getElementById('rsvp-phone')?.value.trim() || '',
    attendance: document.getElementById('rsvp-attendance')?.value || '',
    guests:     document.getElementById('rsvp-guests')?.value || '1',
    message:    document.getElementById('rsvp-message')?.value.trim() || '',
    timestamp:  new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  };

  try {
    // mode: 'no-cors' karena Apps Script tidak kirim CORS header yang kompatibel
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Karena no-cors, kita tidak bisa baca response status.
    // Asumsikan sukses jika tidak ada error jaringan.
    rsvpSuccess?.classList.remove('hidden');
    rsvpForm.reset();

    // Scroll ke pesan sukses
    rsvpSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (err) {
    console.error('RSVP Error:', err);
    rsvpError?.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    btnText?.classList.remove('hidden');
    btnLoading?.classList.add('hidden');
  }
});

// ── RSVP Attendance conditional: sembunyikan jumlah tamu jika "Tidak Hadir" ──
const attendanceSelect = document.getElementById('rsvp-attendance');
const guestsGroup      = document.getElementById('guests-group');

attendanceSelect?.addEventListener('change', () => {
  if (attendanceSelect.value === 'tidak') {
    guestsGroup?.classList.add('hidden');
  } else {
    guestsGroup?.classList.remove('hidden');
  }
});
