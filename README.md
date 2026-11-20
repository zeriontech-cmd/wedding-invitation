# 💍 Wedding Digital Invitation

Website undangan pernikahan digital yang elegan dan netral. Berbasis **Vanilla HTML + Tailwind CSS + Vanilla JS + GSAP**.

## 🚀 Fitur

| Fitur | Status |
|-------|--------|
| ✅ Cover page dengan animasi reveal | Done |
| ✅ Hero section + countdown timer real-time | Done |
| ✅ Profil mempelai | Done |
| ✅ Love story timeline | Done |
| ✅ Detail acara (Akad + Resepsi) | Done |
| ✅ Add to Google Calendar | Done |
| ✅ Galeri foto (6 foto) + lightbox | Done |
| ✅ Peta lokasi + tombol Google Maps | Done |
| ✅ RSVP form → Google Sheets | Done |
| ✅ Ucapan & doa (Guestbook) → Google Sheets | Done |
| ✅ Amplop digital (transfer + QRIS tab) | Done |
| ✅ Musik latar (toggle floating) | Done |
| ✅ Scroll to top button | Done |
| ✅ Petal particle animation | Done |
| ✅ Fully responsive (mobile-first) | Done |
| ✅ Accessibility (WCAG 2.1 AA) | Done |

## 🎨 Design System

- **Background**: `#FAFAF9` (putih gading hangat)
- **Primary text**: `#1C1917` (stone dark)
- **Accent / Gold**: `#A16207` (emas muted)
- **Fonts**: Great Vibes (heading script) + Cormorant Infant (body serif)
- **Animation**: GSAP ScrollTrigger scroll reveal

## 📁 Struktur File

```
wedding-invitation/
├── index.html              ← Single-page utama
├── assets/
│   ├── css/style.css       ← Custom CSS & design tokens
│   ├── js/
│   │   ├── main.js         ← Core logic (cover, countdown, GSAP, lightbox, music)
│   │   ├── rsvp.js         ← RSVP form → Google Sheets
│   │   └── guestbook.js    ← Guestbook → Google Sheets
│   ├── images/             ← (isi dengan foto asli klien)
│   └── audio/
│       └── background.mp3  ← (isi dengan royalty-free MP3)
└── README.md
```

## ⚙️ Setup Google Sheets (RSVP + Guestbook)

### Langkah 1: Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com) → Buat spreadsheet baru
2. Beri nama: `Wedding - Raka & Sekar`
3. Buat 2 sheet tab:
   - `RSVP` dengan kolom: `Timestamp | Nama | Phone | Attendance | Guests | Message`
   - `Guestbook` dengan kolom: `Timestamp | Nama | Pesan`

### Langkah 2: Buat Apps Script

1. Di Google Sheets → **Extensions → Apps Script**
2. Paste kode berikut:

```javascript
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (data.action === 'rsvp') {
    const sheet = ss.getSheetByName('RSVP');
    sheet.appendRow([data.timestamp, data.name, data.phone, data.attendance, data.guests, data.message]);
  } else if (data.action === 'addWish') {
    const sheet = ss.getSheetByName('Guestbook');
    sheet.appendRow([data.timestamp, data.name, data.message]);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.action === 'getWishes') {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Guestbook');
    const rows = sheet.getDataRange().getValues().slice(1); // skip header
    const wishes = rows.map(r => ({ timestamp: r[0], name: r[1], message: r[2] }));
    return ContentService.createTextOutput(JSON.stringify(wishes))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Langkah 3: Deploy

1. Klik **Deploy → New deployment**
2. Pilih type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone** (agar form bisa submit)
5. Klik **Deploy** → Copy URL

### Langkah 4: Update kode

Buka `assets/js/rsvp.js` dan `assets/js/guestbook.js`:
```js
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';
const GUESTBOOK_ENDPOINT = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';
```
Ganti `YOUR_APPS_SCRIPT_ID` dengan URL deployment yang di-copy.

---

## 🎵 Musik Latar

Download royalty-free wedding music:
- [Pixabay Wedding Music](https://pixabay.com/music/search/wedding/)
- [Mixkit Wedding Music](https://mixkit.co/free-music/wedding/)

Simpan file sebagai `assets/audio/background.mp3`

---

## 🖼️ Mengganti Foto

Ganti URL Unsplash di `index.html` dengan foto asli klien:

| Element | Cara Ganti |
|---------|-----------|
| Hero background | Edit `#hero-bg` → `background-image: url('assets/images/hero-bg.jpg')` |
| Foto mempelai pria | Edit `src` di `<img class="couple-photo">` pertama |
| Foto mempelai wanita | Edit `src` di `<img class="couple-photo">` kedua |
| Galeri (6 foto) | Edit `src` dan `data-full` di setiap `.gallery-item` |

---

## 🌐 Deploy

### GitHub Pages (Gratis)
```bash
git init
git add .
git commit -m "Wedding invitation - Raka & Sekar"
git remote add origin https://github.com/username/wedding-raka-sekar.git
git push -u origin main
```
Lalu aktifkan GitHub Pages di Settings → Pages → Branch: main

### Netlify (Gratis, Custom Domain)
1. Drag & drop folder `wedding-invitation/` ke [netlify.com/drop](https://app.netlify.com/drop)
2. Custom domain bisa diatur di Settings → Domain Management

### cPanel Shared Hosting
1. Zip folder `wedding-invitation/`
2. Upload via File Manager → Extract di `public_html/`

---

## 🔧 Kustomisasi Per Klien

Hal yang perlu diubah untuk setiap klien baru:
- [ ] Nama pasangan (search & replace `Raka` dan `Sekar`)
- [ ] Tanggal pernikahan (cari `2025-02-15`)
- [ ] Lokasi venue
- [ ] Foto mempelai & galeri
- [ ] Nomor rekening bank
- [ ] Google Sheets URL
- [ ] Musik latar
- [ ] Love story timeline

---

## 📞 Support

Dibuat dengan ❤️ oleh **Wedding Digital Studio**
