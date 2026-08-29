# WAWAさん

> **Mandarin 汉语 · Korea 한국어 · Jepang 日本語 · Inggris English**
> Platform belajar bahasa berjenjang penuh, dari Bahasa Indonesia.
> **JLPT N5→N1 · HSK 1→9 · TOPIK 1→6 · IELTS & TOEFL iBT (skala baru 2026)**

Aplikasi web yang mengimplementasikan seluruh kurikulum di [`../WAWAsanMD/`](../WAWAsanMD/) —
tujuh dokumen, ±4.900 baris — menjadi jalur belajar interaktif dengan gamifikasi,
spaced repetition, latihan menulis tangan, dan kalkulator skor ujian resmi.

---

## Maskot & identitas visual

**Wawa** adalah seekor **tarsius** (*Tarsius tarsier*) — primata mungil endemik Sulawesi.

Kenapa tarsius:

1. **Mata raksasa** = tindakan inti platform ini: *mengamati* sebuah karakter sebelum menghafalnya
   (Prinsip 2 — "Dari Mana Asalnya?").
2. **Endemik Indonesia** — maskot ikut membawa janji "diajarkan dari Bahasa Indonesia".
3. Bentuknya jelas **bukan burung hantu**, jadi tidak tertukar dengan maskot bahasa mana pun.

Wawa punya 10 ekspresi (`happy`, `excited`, `thinking`, `sad`, `celebrate`, `sleep`, `wave`,
`teach`, `wow`, `love`) dan syal yang **berganti warna mengikuti bahasa aktif**. Versi kepalanya
yang disederhanakan sampai terbaca di 20px adalah **logo** aplikasi ini.

### Aturan menggambar (dipatuhi seluruh sistem)

- **Tidak ada gradient sama sekali** — di mana pun.
- Kedalaman datang dari **outline tinta tebal** (`#17313c`) + **hard shadow tanpa blur**
  (`box-shadow: 0 4px 0 0`), yang mengempis saat tombol ditekan.
- Semua bentuk tertutup dan membulat; tidak ada detail tipis yang pecah di ukuran kecil.

Sumber: [`src/brand/Wawa.tsx`](src/brand/Wawa.tsx) · [`src/brand/Logo.tsx`](src/brand/Logo.tsx)

---

## Tech stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Build | **Vite 8** (Rolldown) | build produksi < 1 detik, HMR instan |
| UI | **React 19** + **TypeScript** (strict) | stabil, ekosistem terbesar |
| Styling | **Tailwind CSS v4** (`@theme`) | design token sebagai CSS variable, zero runtime |
| Routing | **React Router 7** | route-level code splitting via `React.lazy` |
| State | **Zustand** + `persist` | progres tersimpan di localStorage, tanpa backend |
| Hosting | static files | `dist/` bisa dilempar ke mana saja |

Tidak ada server, tidak ada database, tidak ada dependensi berbayar. Seluruh progres
(XP, streak, dek SRS, jurnal kesalahan) hidup di browser pengguna.

---

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # cek hasil build
```

---

## Fitur

### 🗺️ Jalur belajar — enam gerbang
Struktur wajib dari README kurikulum: **Bunyi → Aksara → Kata Inti → Tulang Kalimat →
Produksi → Strategi Ujian**. Gerbang berikutnya **terkunci** sampai kuis gerbang sebelumnya
lulus **≥85%** — nilai 84% berarti ulang gerbang, tanpa pengecualian.

### 📖 Materi + 7 jenis latihan
Setiap unit punya halaman materi (konsep, tabel, peringatan, cerita asal-usul) lalu drill:

`choice` · `judge` (benar/salah) · `fill` (isi partikel dari word bank) · `type` (ketik jawaban,
menerima varian) · `match` (jodohkan) · `order` (susun kalimat) · `sort` (kelompokkan ke bucket)

Setiap soal ditandai keterampilannya (menyimak / membaca / menulis / berbicara) — inilah yang
memberi makan rumus nilai gerbang.

### 🎯 Nilai Gerbang = MIN(4 keterampilan)
Bukan rata-rata. Seseorang dengan Membaca 95% tapi Menyimak 60% mendapat nilai gerbang **60%**.
Ini meniru logika ambang bagian JLPT dan mencegah "kepintaran timpang".

### 🔁 SRS — 1·3·7·16·35·90 hari
Interval **tetap**, bukan adaptif (bukan SM-2), supaya latihan di aplikasi dan di kertas jatuh
pada hari yang sama. Kartu terisi otomatis saat sebuah unit lulus. Ada grafik perkiraan 14 hari.

### ✍️ Latihan menulis — protokol 3-7-D-K
Kanvas gambar dengan kotak panduan **田字格 / 米字格 / hangeul / garis Latin**, memandu:

- **3** — tulis pelan sambil melihat contoh, hitung guratan bersuara
- **7** — kecepatan normal, masih melihat
- **D** — contoh **disembunyikan**, tulis dari ingatan ← tahap paling menentukan
- **K** — koreksi & catat ke **Jurnal Kesalahan**

Karakter yang muncul **3× di jurnal** otomatis masuk daftar "karakter bermasalah".

### 文 Penjelajah aksara
46 hiragana + 46 katakana **beserta kanji induknya**, 39 kanji dengan cerita asal-usul lengkap,
50 radikal (termasuk yang berbahaya: 月 daging vs bulan, 衤 vs 礻, 贝 = uang), 40 jamo dengan
penjelasan organ bicara, evolusi hanzi 5 tahap, dua garis waktu sejarah, dan naskah asli
훈민정음 Raja Sejong.

### 🧮 Kalkulator ujian
- **JLPT** — mendemonstrasikan jebakan ambang bagian: total 128 bisa **GAGAL** sementara total 117 **LULUS**
- **HSK** — ambang tunggal + peringatan transisi 2.0/3.0 dan fakta "HSK 7-9 adalah satu ujian"
- **TOPIK** — Anda memilih *ujian*, bukan level; skor yang menentukan level
- **IELTS** — pembulatan delapan-kemungkinan (.25 naik, .125 turun) + konversi nilai mentah 40 soal
- **TOEFL** — **skala baru 1–6** (sejak 21 Jan 2026) + konkordansi ke skala lama 0–120
- **Jam belajar** — estimasi bulan-ke-target berdasarkan jam/hari

### 📊 Referensi
Tabel induk CEFR lintas semua ujian, seluruh tabel skor, konversi silang IELTS↔TOEFL↔CEFR,
peta jalur multi-bahasa 5 tahun, dan tabel bonus hanja (學校 / 학교 / がっこう / xuéxiào).

---

## Struktur

```
src/
├─ brand/          Wawa.tsx (maskot), Logo.tsx (logo & favicon mark)
├─ components/
│  ├─ ui/          Button, Card, Chip, Ring, ProgressBar, Callout, DataTable, Tabs…
│  ├─ layout/      Shell — sidebar, top bar, nav mobile, pemilih bahasa
│  └─ lesson/      Tujuh komponen tampilan latihan
├─ data/
│  ├─ types.ts     Model domain (Gate, Unit, Lesson, Exercise, Card, ScriptChar)
│  ├─ curriculum/  jp.ts · cn.ts · kr.ts · en.ts — gerbang, unit, materi, soal, kartu
│  ├─ scripts.ts   Kana, kanji, radikal, jamo, garis waktu, 六書
│  └─ reference.ts Setiap tabel skor & perbandingan
├─ lib/
│  ├─ scoring.ts   Logika kelulusan JLPT, pembulatan IELTS, konversi TOEFL, MIN(gerbang)
│  └─ srs.ts       Tangga interval tetap
├─ store/          Zustand + persist
└─ pages/          11 halaman
```

---

## Catatan akurasi

Angka diverifikasi pada **28 Agustus 2026**. Tiga hal berubah cepat dan **wajib dicek ulang**
ke sumber resmi sebelum mendaftar ujian:

1. **TOEFL iBT** — skala 1–6 berlaku 21 Januari 2026; pelaporan ganda berjalan ±2 tahun.
2. **HSK 3.0** — silabus direvisi Nov 2025, berlaku Juli 2026, **tetapi** sesi HSK 1–6 sepanjang
   2026 masih memakai daftar kosakata 2.0. Selalu tanyakan ke pusat ujian.
3. **TOPIK** — jadwal IBT/PBT berbeda tiap tahun; 말하기 adalah ujian terpisah.

Penyelarasan CEFR di seluruh aplikasi bersifat **indikatif**, bukan ekuivalensi resmi. JLPT dan
HSK tidak dipetakan secara formal ke CEFR oleh penyelenggaranya.

Sumber resmi: [JLPT](https://www.jlpt.jp/e/) · [HSK](http://www.chinesetest.cn/) ·
[TOPIK](https://www.topik.go.kr/) · [IELTS](https://ielts.org/) · [TOEFL](https://www.ets.org/toefl/)

---

*一歩ずつ · 一步一步 · 한 걸음씩 · step by step · selangkah demi selangkah.*
