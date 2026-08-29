# Wawasan — WAWAさん

> **Mandarin 汉语 · Korea 한국어 · Jepang 日本語 · Inggris English**
> Platform belajar bahasa berjenjang penuh, dengan bahasa pengantar **Indonesia**.
> **JLPT N5→N1 · HSK 1→9 · TOPIK 1→6 · IELTS & TOEFL iBT (skala baru 2026)**

<p align="center">
  <img src="wawa-app/public/wawa-mark.svg" width="120" alt="Wawa — maskot WAWAさん">
</p>

---

## Isi repositori

| Folder | Isi |
|---|---|
| [`WAWAsanMD/`](WAWAsanMD/) | **Sumber kurikulum** — 7 dokumen Markdown, ±4.900 baris: silabus, sejarah aksara, tabel skor, protokol latihan |
| [`wawa-app/`](wawa-app/) | **Aplikasi web** — implementasi interaktif dari kurikulum tersebut |

Kurikulum ditulis lebih dulu sebagai dokumen; aplikasi mengikutinya, bukan sebaliknya.
Setiap aturan di aplikasi (penguncian gerbang 85%, rumus `MIN()` nilai gerbang, interval SRS
1-3-7-16-35-90) diambil langsung dari dokumen itu.

---

## Menjalankan aplikasi

```bash
cd wawa-app
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (static, bisa di-host di mana saja)
```

Tidak ada server dan tidak ada database. Seluruh progres pengguna — XP, streak, dek SRS,
jurnal kesalahan — hidup di `localStorage` browser.

📖 Dokumentasi lengkap fitur & arsitektur: [`wawa-app/README.md`](wawa-app/README.md)

---

## Maskot: Wawa

**Wawa** adalah seekor **tarsius** (*Tarsius tarsier*), primata mungil endemik Sulawesi.

Kenapa tarsius, bukan burung hantu seperti maskot bahasa pada umumnya:

1. **Mata raksasa** = tindakan inti platform ini — *mengamati* sebuah karakter sebelum
   menghafalnya (Prinsip 2: aksara diajarkan lewat cerita, bukan hafalan buta).
2. **Endemik Indonesia** — maskot ikut membawa janji "diajarkan dari Bahasa Indonesia".
3. Siluetnya jelas berbeda dari maskot bahasa mana pun yang sudah ada.

Kepala Wawa yang disederhanakan sampai masih terbaca di 20px dipakai sebagai **logo dan favicon**.

**Aturan menggambar** yang dipatuhi seluruh sistem visual: **tidak ada gradient sama sekali**.
Kedalaman hanya datang dari outline tinta tebal (`#17313c`) dan *hard shadow* tanpa blur yang
mengempis saat tombol ditekan.

---

## Lima prinsip pengajaran

1. **Bunyi Sebelum Bentuk** — setiap bahasa dimulai dari sistem bunyi, bukan kosakata.
   Melompatinya adalah penyebab nomor satu kegagalan pelajar Indonesia di bahasa bernada
   (Mandarin) dan bahasa berbatchim (Korea).
2. **Aksara Lewat Cerita** — 日 diajarkan sebagai gambar matahari berbintik yang berevolusi
   3.000 tahun, bukan sebagai "coretan kotak".
3. **Tangan Ikut Belajar** — protokol menulis 3-7-D-K dengan kotak panduan 田字格/米字格.
4. **Satu Konsep per Sesi** — satu partikel per unit, dikontraskan dengan yang sudah dikuasai.
5. **Spaced Repetition Terjadwal** — interval tetap 1-3-7-16-35-90 hari.

---

## Catatan akurasi

Angka diverifikasi **28 Agustus 2026**. Tiga hal berubah cepat dan wajib dicek ulang ke sumber
resmi sebelum mendaftar ujian:

- **TOEFL iBT** — skala 1–6 berlaku sejak 21 Januari 2026; pelaporan ganda ±2 tahun.
- **HSK 3.0** — silabus revisi berlaku Juli 2026, **tetapi** sesi HSK 1–6 sepanjang 2026 masih
  memakai daftar kosakata 2.0. Selalu tanyakan ke pusat ujian.
- **TOPIK** — jadwal IBT/PBT berbeda tiap tahun; 말하기 adalah ujian terpisah.

Penyelarasan CEFR di seluruh proyek bersifat **indikatif**, bukan ekuivalensi resmi.

---

*一歩ずつ · 一步一步 · 한 걸음씩 · step by step · selangkah demi selangkah.*
