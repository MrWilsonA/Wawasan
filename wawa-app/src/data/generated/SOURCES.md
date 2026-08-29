# Sumber data karakter

Berkas di folder ini **dihasilkan otomatis** oleh `scripts/build-datasets.mjs`.
Jangan diedit manual — jalankan `npm run build:data` untuk memperbaruinya.

Terakhir dibuat: 2026-08-29

| Berkas | Isi | Sumber | Lisensi |
|---|---|---|---|
| `kanji.json` | 2136 kanji jōyō (grade 1–8) dengan on'yomi, kun'yomi, arti, jumlah guratan, tingkat JLPT, peringkat frekuensi | [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) — EDRDG | CC BY-SA 4.0 |
| `hanzi.json` | 3000 hanzi HSK 3.0 (level 1–9) dengan pinyin dan definisi | Daftar karakter: silabus HSK 3.0 (2021) · Pinyin & definisi: [Unihan](https://www.unicode.org/charts/unihan.html) — Unicode Consortium | Unicode License / open data |

Kamus Inggris diambil langsung saat dibutuhkan dari
[dictionaryapi.dev](https://dictionaryapi.dev/) (gratis, tanpa kunci API) — tidak dibundel.
