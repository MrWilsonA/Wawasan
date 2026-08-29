/** Every comparison / scoring table from the curriculum, as structured data. */

export const DOC_VERSION = { version: '1.0', verified: '28 Agustus 2026' }

/* ==================== TABEL INDUK — CEFR ==================== */
export const CEFR_MASTER = [
  { cefr: 'A1', desc: 'Frasa dasar, perkenalan diri', jlpt: 'N5', hsk2: 'HSK 1–2', hsk3: 'HSK 1', topik: 'TOPIK 1', ielts: '—', toeflNew: '—', toeflOld: '—' },
  { cefr: 'A2', desc: 'Rutinitas & kebutuhan sehari-hari', jlpt: 'N4', hsk2: 'HSK 3', hsk3: 'HSK 2–3', topik: 'TOPIK 2', ielts: '3.0–3.5', toeflNew: '—', toeflOld: '—' },
  { cefr: 'B1', desc: 'Mandiri di situasi umum', jlpt: 'N3', hsk2: 'HSK 4', hsk3: 'HSK 4', topik: 'TOPIK 3', ielts: '4.0–5.0', toeflNew: '3.5–4.0', toeflOld: '42–71' },
  { cefr: 'B2', desc: 'Lancar & spontan, teks kompleks', jlpt: 'N2', hsk2: 'HSK 5', hsk3: 'HSK 5–6', topik: 'TOPIK 4–5', ielts: '5.5–6.5', toeflNew: '4.5', toeflOld: '72–94' },
  { cefr: 'C1', desc: 'Akademik & profesional, nuansa halus', jlpt: 'N1', hsk2: 'HSK 6', hsk3: 'HSK 7', topik: 'TOPIK 6', ielts: '7.0–8.0', toeflNew: '5.0–5.5', toeflOld: '95–113' },
  { cefr: 'C2', desc: 'Setara penutur terdidik', jlpt: '(di atas N1)', hsk2: '(di atas HSK 6)', hsk3: 'HSK 8–9', topik: '(di atas TOPIK 6)', ielts: '8.5–9.0', toeflNew: '6.0', toeflOld: '114–120' },
]

export const CEFR_CAVEAT =
  'Penyelarasan CEFR di atas bersifat INDIKATIF, bukan ekuivalensi resmi. JLPT dan HSK tidak dipetakan secara formal ke CEFR oleh penyelenggaranya. Gunakan tabel ini untuk merancang jalur belajar, BUKAN untuk klaim di dokumen resmi.'

/* ==================== JLPT ==================== */
export const JLPT_LEVELS = [
  { level: 'N5', kanji: '±100', vocab: '±800', hours: '350–600', total: 180, pass: 80, sections: 'Bahasa+Baca 38 · Simak 19', time: '90 menit' },
  { level: 'N4', kanji: '±300', vocab: '±1.500', hours: '550–1.000', total: 180, pass: 90, sections: 'Bahasa+Baca 38 · Simak 19', time: '115 menit' },
  { level: 'N3', kanji: '±650', vocab: '±3.750', hours: '900–1.300', total: 180, pass: 95, sections: 'Tiap bagian 19', time: '140 menit' },
  { level: 'N2', kanji: '±1.000', vocab: '±6.000', hours: '1.150–1.800', total: 180, pass: 90, sections: 'Tiap bagian 19', time: '155 menit' },
  { level: 'N1', kanji: '±2.000', vocab: '±10.000', hours: '1.700–2.600', total: 180, pass: 100, sections: 'Tiap bagian 19', time: '165 menit' },
]

/** Section layout used by the JLPT calculator. */
export const JLPT_SECTIONS: Record<string, { key: string; label: string; max: number; min: number }[]> = {
  N5: [
    { key: 'lang', label: 'Bahasa + Membaca', max: 120, min: 38 },
    { key: 'listen', label: 'Menyimak', max: 60, min: 19 },
  ],
  N4: [
    { key: 'lang', label: 'Bahasa + Membaca', max: 120, min: 38 },
    { key: 'listen', label: 'Menyimak', max: 60, min: 19 },
  ],
  N3: [
    { key: 'lang', label: 'Pengetahuan Bahasa', max: 60, min: 19 },
    { key: 'read', label: 'Membaca', max: 60, min: 19 },
    { key: 'listen', label: 'Menyimak', max: 60, min: 19 },
  ],
  N2: [
    { key: 'lang', label: 'Pengetahuan Bahasa', max: 60, min: 19 },
    { key: 'read', label: 'Membaca', max: 60, min: 19 },
    { key: 'listen', label: 'Menyimak', max: 60, min: 19 },
  ],
  N1: [
    { key: 'lang', label: 'Pengetahuan Bahasa', max: 60, min: 19 },
    { key: 'read', label: 'Membaca', max: 60, min: 19 },
    { key: 'listen', label: 'Menyimak', max: 60, min: 19 },
  ],
}

export const JLPT_NOTES = [
  'N1–N3 memakai penilaian berbasis skala (尺度得点), bukan jumlah jawaban benar mentah. Jadi tidak ada "berapa soal harus benar" yang pasti.',
  'N4–N5 sejak 2020 menggabungkan Bahasa dan Membaca menjadi SATU bagian penilaian.',
  'Sertifikat JLPT berlaku SEUMUR HIDUP (tidak kedaluwarsa) — berbeda dengan IELTS/TOEFL/TOPIK yang berlaku 2 tahun.',
]

/* ==================== HSK ==================== */
export const HSK_20 = [
  { level: 'HSK 1', vocab: '150', chars: '±174', total: 200, pass: 120, structure: 'Simak 20 + Baca 20 soal', time: '40 mnt', cefr: 'A1' },
  { level: 'HSK 2', vocab: '300', chars: '±347', total: 200, pass: 120, structure: 'Simak 35 + Baca 25 soal', time: '55 mnt', cefr: 'A1–A2' },
  { level: 'HSK 3', vocab: '600', chars: '±617', total: 300, pass: 180, structure: 'Simak 40 + Baca 30 + Tulis 10', time: '90 mnt', cefr: 'A2–B1' },
  { level: 'HSK 4', vocab: '1.200', chars: '±1.064', total: 300, pass: 180, structure: 'Simak 45 + Baca 40 + Tulis 15', time: '105 mnt', cefr: 'B1–B2' },
  { level: 'HSK 5', vocab: '2.500', chars: '±1.685', total: 300, pass: 180, structure: 'Simak 45 + Baca 45 + Tulis 10', time: '125 mnt', cefr: 'B2' },
  { level: 'HSK 6', vocab: '±5.000', chars: '±2.663', total: 300, pass: 180, structure: 'Simak 50 + Baca 50 + Tulis 1 esai', time: '140 mnt', cefr: 'C1' },
]

export const HSK_30 = [
  { level: 'HSK 1', stage: '初等 Elementer', vocab: '300', chars: '246', hand: '101', grammar: '±48 poin', cefr: 'A1' },
  { level: 'HSK 2', stage: '初等 Elementer', vocab: '500', chars: '371', hand: '101', grammar: '±129 poin', cefr: 'A1–A2' },
  { level: 'HSK 3', stage: '初等 Elementer', vocab: '1.000', chars: '655', hand: '252', grammar: '±210 poin', cefr: 'A2' },
  { level: 'HSK 4', stage: '中等 Menengah', vocab: '2.000', chars: '1.096', hand: '403', grammar: '±286 poin', cefr: 'B1' },
  { level: 'HSK 5', stage: '中等 Menengah', vocab: '3.600', chars: '1.527', hand: '554', grammar: '±357 poin', cefr: 'B1–B2' },
  { level: 'HSK 6', stage: '中等 Menengah', vocab: '5.400', chars: '1.940', hand: '705', grammar: '±424 poin', cefr: 'B2' },
  { level: 'HSK 7–9', stage: '高等 Lanjut', vocab: '11.000', chars: '3.109', hand: '1.208', grammar: '±572 poin', cefr: 'C1–C2' },
]

export const HSK_DELTA = [
  { step: '1 → 2', v20: '+150', v30: '+200' },
  { step: '2 → 3', v20: '+300', v30: '+500' },
  { step: '3 → 4', v20: '+600', v30: '+1.000' },
  { step: '4 → 5', v20: '+1.300', v30: '+1.600' },
  { step: '5 → 6', v20: '+2.500', v30: '+1.800' },
  { step: '6 → 7-9', v20: '—', v30: '+5.600 ⚠️' },
]

export const HSK_TIMELINE = [
  { year: '2009', event: 'HSK 2.0 diluncurkan: 6 level' },
  { year: 'Juli 2021', event: 'Standar baru 《国际中文教育中文水平等级标准》 terbit: 9 level (HSK 3.0)' },
  { year: 'November 2025', event: 'Silabus HSK 3.0 DIREVISI — daftar kosakata per level diubah' },
  { year: 'Juli 2026', event: 'Silabus revisi mulai berlaku' },
  { year: 'Sepanjang 2026', event: 'Sesi ujian reguler HSK 1–6 MASIH memakai daftar kosakata HSK 2.0' },
  { year: 'Sudah berjalan', event: 'HSK 7–9 sudah beroperasi sebagai SATU ujian gabungan tingkat lanjut' },
]

/* ==================== TOPIK ==================== */
export const TOPIK_LEVELS = [
  { exam: 'TOPIK I', level: 'Level 1', pbt: '80–139', ibt: '121–235', cefr: 'A1' },
  { exam: 'TOPIK I', level: 'Level 2', pbt: '140–200', ibt: '236–400', cefr: 'A2' },
  { exam: 'TOPIK II', level: 'Level 3', pbt: '120–149', ibt: '191–290', cefr: 'B1' },
  { exam: 'TOPIK II', level: 'Level 4', pbt: '150–189', ibt: '291–360', cefr: 'B1–B2' },
  { exam: 'TOPIK II', level: 'Level 5', pbt: '190–229', ibt: '361–430', cefr: 'B2–C1' },
  { exam: 'TOPIK II', level: 'Level 6', pbt: '230–300', ibt: '431–600', cefr: 'C1' },
]

export const TOPIK_SPEAKING = [
  { level: 'Level 1', score: '20–49' },
  { level: 'Level 2', score: '50–89' },
  { level: 'Level 3', score: '90–109' },
  { level: 'Level 4', score: '110–129' },
  { level: 'Level 5', score: '130–159' },
  { level: 'Level 6', score: '160–200' },
]

/** Numeric thresholds for the TOPIK calculator. */
export const TOPIK_THRESHOLDS = {
  I: { max: 200, ibtMax: 400, bands: [{ level: 2, min: 140 }, { level: 1, min: 80 }] },
  II: { max: 300, ibtMax: 600, bands: [{ level: 6, min: 230 }, { level: 5, min: 190 }, { level: 4, min: 150 }, { level: 3, min: 120 }] },
}

export const TOPIK_II_PARTS = [
  { part: '듣기 Menyimak', count: '50 soal', score: 100, note: 'Pilihan ganda' },
  { part: '쓰기 Menulis', count: '4 soal', score: 100, note: '2 isian pendek + esai 200–300 kata + esai 600–700 kata' },
  { part: '읽기 Membaca', count: '50 soal', score: 100, note: 'Pilihan ganda' },
]

export const TOPIK_WRITING_TASKS = [
  { no: '51', type: 'Isi 2 bagian rumpang (formal pendek)', score: 10, strategy: 'Cocokkan TINGKAT TUTUR dengan teks sekitarnya' },
  { no: '52', type: 'Isi 2 bagian rumpang (esai pendek)', score: 10, strategy: 'Perhatikan konjungsi penanda (그러나, 따라서)' },
  { no: '53', type: 'Esai 200–300 kata dari grafik/data', score: 30, strategy: 'Pengantar → deskripsi data → penyebab → penutup' },
  { no: '54', type: 'Esai argumentatif 600–700 kata', score: 50, strategy: '서론 → 본론 (2–3 argumen) → 결론. WAJIB 해라체' },
]

/* ==================== IELTS ==================== */
export const IELTS_BANDS = [
  { band: 9, name: 'Expert User', cefr: 'C2', desc: 'Menguasai bahasa sepenuhnya: tepat, akurat, lancar, dengan pemahaman menyeluruh.' },
  { band: 8, name: 'Very Good User', cefr: 'C1', desc: 'Menguasai penuh dengan ketidakakuratan tak sistematis yang jarang. Menangani argumen kompleks dengan baik.' },
  { band: 7, name: 'Good User', cefr: 'C1', desc: 'Menguasai bahasa dengan ketidakakuratan dan salah paham sesekali. Umumnya menangani bahasa kompleks dengan baik.' },
  { band: 6, name: 'Competent User', cefr: 'B2', desc: 'Umumnya efektif meski ada ketidakakuratan. Dapat memakai bahasa cukup kompleks, terutama pada situasi yang dikenal.' },
  { band: 5, name: 'Modest User', cefr: 'B1–B2', desc: 'Menguasai sebagian; menangkap makna keseluruhan pada sebagian besar situasi, meski sering keliru.' },
  { band: 4, name: 'Limited User', cefr: 'B1', desc: 'Kompetensi dasar terbatas pada situasi yang dikenal. Tidak mampu memakai bahasa kompleks.' },
  { band: 3, name: 'Extremely Limited User', cefr: 'A2', desc: 'Menyampaikan dan memahami makna umum hanya pada situasi sangat dikenal. Komunikasi sering gagal.' },
  { band: 2, name: 'Intermittent User', cefr: 'A1', desc: 'Komunikasi nyata tidak dimungkinkan kecuali informasi paling dasar dengan kata terpisah.' },
  { band: 1, name: 'Non-User', cefr: '—', desc: 'Tidak mampu menggunakan bahasa selain beberapa kata terpisah.' },
  { band: 0, name: 'Did not attempt', cefr: '—', desc: 'Tidak ada informasi yang dapat dinilai.' },
]

/** raw correct (out of 40) → band. Descending by minimum correct. */
export const IELTS_RAW_LISTENING = [
  { min: 39, band: 9.0 }, { min: 37, band: 8.5 }, { min: 35, band: 8.0 }, { min: 32, band: 7.5 },
  { min: 30, band: 7.0 }, { min: 26, band: 6.5 }, { min: 23, band: 6.0 }, { min: 18, band: 5.5 },
  { min: 16, band: 5.0 }, { min: 13, band: 4.5 }, { min: 10, band: 4.0 }, { min: 6, band: 3.5 }, { min: 4, band: 3.0 },
]

export const IELTS_RAW_READING_ACADEMIC = [
  { min: 39, band: 9.0 }, { min: 37, band: 8.5 }, { min: 35, band: 8.0 }, { min: 33, band: 7.5 },
  { min: 30, band: 7.0 }, { min: 27, band: 6.5 }, { min: 23, band: 6.0 }, { min: 19, band: 5.5 },
  { min: 15, band: 5.0 }, { min: 13, band: 4.5 }, { min: 10, band: 4.0 }, { min: 8, band: 3.5 }, { min: 6, band: 3.0 },
]

export const IELTS_RAW_READING_GENERAL = [
  { min: 40, band: 9.0 }, { min: 39, band: 8.5 }, { min: 37, band: 8.0 }, { min: 36, band: 7.5 },
  { min: 34, band: 7.0 }, { min: 32, band: 6.5 }, { min: 30, band: 6.0 }, { min: 27, band: 5.5 },
  { min: 23, band: 5.0 }, { min: 19, band: 4.5 }, { min: 15, band: 4.0 }, { min: 12, band: 3.5 }, { min: 9, band: 3.0 },
]

export const IELTS_ROUNDING = [
  { frac: '.000', rule: 'tetap', example: '6.000 → 6.0' },
  { frac: '.125', rule: 'TURUN ke .0', example: '6.125 → 6.0' },
  { frac: '.250', rule: 'NAIK ke .5', example: '6.250 → 6.5' },
  { frac: '.375', rule: 'NAIK ke .5', example: '6.375 → 6.5' },
  { frac: '.500', rule: 'tetap', example: '6.500 → 6.5' },
  { frac: '.625', rule: 'TURUN ke .5', example: '6.625 → 6.5' },
  { frac: '.750', rule: 'NAIK ke bulat', example: '6.750 → 7.0' },
  { frac: '.875', rule: 'NAIK ke bulat', example: '6.875 → 7.0' },
]

export const IELTS_TARGETS = [
  { goal: 'Visa pelajar Inggris (pre-sessional)', band: '5.5–6.0' },
  { goal: 'S1 di UK/Australia', band: '6.0–6.5' },
  { goal: 'S2 di UK/Australia', band: '6.5–7.0' },
  { goal: 'Program kompetitif (hukum, kedokteran, jurnalistik)', band: '7.0–7.5' },
  { goal: 'Registrasi profesi (perawat, dokter di UK/AU)', band: '7.0 semua bagian' },
  { goal: 'Imigrasi Australia (poin bahasa)', band: '7.0–8.0' },
  { goal: 'PhD & beasiswa top', band: '7.0–7.5' },
]

/* ==================== TOEFL ==================== */
export const TOEFL_CONCORDANCE = [
  { band: 6.0, reading: '29–30', listening: '28–30', speaking: '28–30', writing: '29–30', total: '114+', cefr: 'C2' },
  { band: 5.5, reading: '27–28', listening: '26–27', speaking: '27', writing: '27–28', total: '107+', cefr: 'C1' },
  { band: 5.0, reading: '24–26', listening: '22–25', speaking: '25–26', writing: '24–26', total: '95+', cefr: 'B2–C1' },
  { band: 4.5, reading: '22–23', listening: '20–21', speaking: '23–24', writing: '21–23', total: '86+', cefr: 'B2' },
  { band: 4.0, reading: '18–21', listening: '17–19', speaking: '20–22', writing: '17–20', total: '72+', cefr: 'B1' },
  { band: 3.5, reading: '12–17', listening: '13–16', speaking: '18–19', writing: '15–16', total: '58+', cefr: 'B1' },
]

export const TOEFL_TARGETS = [
  { goal: 'Community college AS', old: '61–70', neu: '±3.5–4.0' },
  { goal: 'S1 universitas negeri AS', old: '79–90', neu: '±4.0–4.5' },
  { goal: 'S1 universitas kompetitif', old: '90–100', neu: '±4.5–5.0' },
  { goal: 'S2 universitas AS', old: '90–100', neu: '±4.5–5.0' },
  { goal: 'Ivy League / program top', old: '100–110', neu: '±5.0–5.5' },
  { goal: 'Program menuntut bahasa (jurnalistik, hukum)', old: '105–115', neu: '±5.5–6.0' },
]

export const CROSS_CONVERSION = [
  { cefr: 'C2', ielts: '8.5–9.0', toeflNew: '6.0', toeflOld: '114–120', ability: 'Setara penutur terdidik' },
  { cefr: 'C1', ielts: '8.0', toeflNew: '5.5–6.0', toeflOld: '110–120', ability: 'Mahir' },
  { cefr: 'C1', ielts: '7.5', toeflNew: '5.5', toeflOld: '102–109', ability: 'Advanced kuat' },
  { cefr: 'C1', ielts: '7.0', toeflNew: '5.0–5.5', toeflOld: '94–101', ability: 'Advanced' },
  { cefr: 'B2', ielts: '6.5', toeflNew: '4.5–5.0', toeflOld: '79–93', ability: 'Menengah atas kuat' },
  { cefr: 'B2', ielts: '6.0', toeflNew: '4.5', toeflOld: '60–78', ability: 'Menengah atas' },
  { cefr: 'B1–B2', ielts: '5.5', toeflNew: '4.0', toeflOld: '46–59', ability: 'Menengah' },
  { cefr: 'B1', ielts: '5.0', toeflNew: '3.5–4.0', toeflOld: '35–45', ability: 'Menengah bawah' },
  { cefr: 'B1', ielts: '4.5', toeflNew: '3.5', toeflOld: '32–34', ability: 'Dasar mandiri' },
  { cefr: 'A2', ielts: '4.0', toeflNew: '—', toeflOld: '31 ke bawah', ability: 'Dasar' },
]

export const IELTS_VS_TOEFL = [
  { aspect: 'Penyelenggara', ielts: 'British Council, IDP, Cambridge', toefl: 'ETS (Amerika Serikat)' },
  { aspect: 'Skala skor', ielts: '0–9 (kelipatan 0,5)', toefl: '1–6 (kelipatan 0,5) — skala baru sejak 21 Jan 2026' },
  { aspect: 'Durasi', ielts: '±2 jam 45 menit', toefl: '±2 jam' },
  { aspect: 'Speaking', ielts: 'Tatap muka / video dengan penguji manusia', toefl: 'Rekaman ke komputer, dinilai AI + manusia' },
  { aspect: 'Writing', ielts: 'Bisa tulis tangan (paper) atau ketik', toefl: 'Selalu diketik' },
  { aspect: 'Aksen di audio', ielts: 'Britania, Australia, NZ, Amerika, Kanada', toefl: 'Dominan Amerika Utara' },
  { aspect: 'Gaya soal', ielts: 'Beragam (isian, pencocokan, T/F/NG, esai)', toefl: 'Hampir seluruhnya pilihan ganda + 2 esai + 4 tugas bicara' },
  { aspect: 'Masa berlaku', ielts: '2 tahun', toefl: '2 tahun' },
  { aspect: 'Diterima di', ielts: 'UK, Australia, Kanada, NZ, Eropa, banyak kampus AS', toefl: 'AS (dominan), Kanada, global' },
]

export const CHOOSE_EXAM = [
  { profile: 'Tujuan kuliah/kerja di UK, Australia, Kanada, NZ', pick: 'IELTS' },
  { profile: 'Tujuan kuliah di Amerika Serikat', pick: 'TOEFL (walau IELTS juga banyak diterima)' },
  { profile: 'Anda gugup bicara dengan orang', pick: 'TOEFL (bicara ke komputer)' },
  { profile: 'Anda lebih lancar dengan orang daripada ke mesin', pick: 'IELTS' },
  { profile: 'Anda kuat di pilihan ganda, lemah di format bervariasi', pick: 'TOEFL' },
  { profile: 'Anda lemah mengetik cepat', pick: 'IELTS (bisa tulis tangan)' },
  { profile: 'Terbiasa aksen Inggris/Australia', pick: 'IELTS' },
  { profile: 'Terbiasa aksen Amerika (film, YouTube)', pick: 'TOEFL' },
]

/* ==================== JAM BELAJAR ==================== */
export const STUDY_HOURS = [
  { target: 'JLPT N5', hours: 450 },
  { target: 'JLPT N4', hours: 800 },
  { target: 'JLPT N3', hours: 1150 },
  { target: 'JLPT N2', hours: 1500 },
  { target: 'JLPT N1', hours: 2200 },
  { target: 'HSK 3', hours: 300 },
  { target: 'HSK 4', hours: 600 },
  { target: 'HSK 5', hours: 1200 },
  { target: 'HSK 6', hours: 2000 },
  { target: 'TOPIK 3', hours: 450 },
  { target: 'TOPIK 6', hours: 1300 },
  { target: 'IELTS 6.5 (dari B1)', hours: 200 },
  { target: 'IELTS 7.5 (dari B2)', hours: 350 },
]

/* ==================== SISTEM PENILAIAN INTERNAL ==================== */
export const GRADE_RUBRIC = [
  { min: 95, label: '完璧 Sempurna', color: 'leaf', action: 'Lanjut. Jadwalkan ulang materi ini di H+7.' },
  { min: 85, label: '合格 Lulus', color: 'teal', action: 'Lanjut. Tandai butir yang salah untuk ulangan H+3.' },
  { min: 70, label: '要復習 Perlu Ulang', color: 'amber', action: 'JANGAN LANJUT. Ulangi unit, kerjakan ulang kuis H+2.' },
  { min: 0, label: '不合格 Belum', color: 'coral', action: 'Ulangi unit DARI AWAL, termasuk latihan menulisnya.' },
]

/* ==================== RUTINITAS ==================== */
export const DAILY_TEMPLATE = [
  { range: '0–10', minutes: 10, activity: 'Review SRS', detail: 'Kartu jatuh tempo hari ini', goal: 'Konsolidasi memori', icon: '🔁' },
  { range: '10–20', minutes: 10, activity: 'Latihan menulis', detail: '5 aksara baru × 8 repetisi', goal: 'Motor encoding', icon: '✍️' },
  { range: '20–40', minutes: 20, activity: 'Materi baru', detail: '1 unit, 1 struktur tata bahasa', goal: 'Input terstruktur', icon: '📖' },
  { range: '40–50', minutes: 10, activity: 'Menyimak', detail: 'Audio unit 3× (buta → dengan teks → shadowing)', goal: 'Persepsi bunyi', icon: '🎧' },
  { range: '50–60', minutes: 10, activity: 'Output', detail: '5 kalimat sendiri memakai struktur hari ini', goal: 'Produksi aktif', icon: '🗣️' },
]

export const WEEKLY_RHYTHM = [
  { day: 'Senin', short: 'Sn', focus: 'Unit baru', kind: 'new' as const },
  { day: 'Selasa', short: 'Sl', focus: 'Unit baru', kind: 'new' as const },
  { day: 'Rabu', short: 'Rb', focus: 'Unit baru', kind: 'new' as const },
  { day: 'Kamis', short: 'Km', focus: 'Unit baru', kind: 'new' as const },
  { day: 'Jumat', short: 'Jm', focus: 'Review + kuis minggu ini · TANPA materi baru', kind: 'review' as const },
  { day: 'Sabtu', short: 'Sb', focus: 'Immersion bebas — drama/podcast/berita, tanpa target', kind: 'immersion' as const },
  { day: 'Minggu', short: 'Mg', focus: 'Libur total, ATAU simulasi ujian jika < 8 minggu menuju tes', kind: 'rest' as const },
]

export const WEEKLY_NOTE =
  'Jumat tanpa materi baru bukan kemalasan — itu KONSOLIDASI. Pelajar yang menambah materi 7 hari seminggu justru lupa lebih cepat.'

/* ==================== FILOSOFI ==================== */
export const PRINCIPLES = [
  {
    n: 1,
    title: 'Bunyi Sebelum Bentuk',
    subtitle: 'Sound before Script',
    body: 'Otak tidak bisa menghafal simbol yang belum punya bunyi. Karena itu setiap bahasa selalu dimulai dari sistem bunyi, bukan dari kosakata. Melompati tahap ini adalah penyebab nomor satu kegagalan pelajar Indonesia di bahasa bernada (Mandarin) dan bahasa berbatchim (Korea).',
    flow: ['BUNYI', 'AKSARA', 'KATA', 'POLA KALIMAT', 'WACANA'],
    icon: '🔊',
    color: 'sky',
  },
  {
    n: 2,
    title: 'Aksara Lewat Cerita',
    subtitle: 'Bukan hafalan buta',
    body: 'Karakter 日 tidak dihafal sebagai "coretan kotak dengan garis". Ia diajarkan sebagai gambar matahari yang berevolusi selama 3.000 tahun. Karakter yang punya cerita bertahan di memori 5–10× lebih lama daripada karakter yang dihafal mentah.',
    flow: ['☉', '⊙', '⊖', '日'],
    icon: '📜',
    color: 'amber',
  },
  {
    n: 3,
    title: 'Tangan Ikut Belajar',
    subtitle: 'Motor Encoding',
    body: 'Menulis dengan tangan mengaktifkan jalur motorik yang memperkuat ingatan visual. Setiap modul aksara punya lembar latihan dengan kotak panduan, urutan guratan bernomor, dan target repetisi realistis — bukan "tulis 100×".',
    flow: ['3× pelan', '7× normal', 'Dikte', 'Koreksi'],
    icon: '✍️',
    color: 'coral',
  },
  {
    n: 4,
    title: 'Satu Konsep per Sesi',
    subtitle: 'Cognitive Load Management',
    body: 'Setiap unit hanya memperkenalkan SATU struktur tata bahasa baru, ditemani kosakata yang sudah dikenal. Bukan "pelajari partikel は、が、を、に、で sekaligus", melainkan: Unit 4 hanya は, Unit 5 hanya を, Unit 6 が dikontraskan dengan は yang sudah dikuasai.',
    flow: ['は', 'を', 'が', 'に', 'で'],
    icon: '🎯',
    color: 'grape',
  },
  {
    n: 5,
    title: 'Spaced Repetition Terjadwal',
    subtitle: '1 – 3 – 7 – 16 – 35 – 90 hari',
    body: 'Kosakata diulang pada interval yang makin melebar. Setiap unit menutup dengan daftar "Kartu Hari Ini" yang siap dimasukkan ke sistem SRS.',
    flow: ['H+1', 'H+3', 'H+7', 'H+16', 'H+35', 'H+90'],
    icon: '🔁',
    color: 'leaf',
  },
]

export const GATE_RULE =
  'Aturan kelulusan gerbang: minimal 85% akurasi pada kuis penutup gerbang, diulang dua hari berturut-turut. Nilai 84% = ulang gerbang, tanpa pengecualian.'

export const MIN_SKILL_RULE =
  'Empat keterampilan dinilai TERPISAH. Seseorang bisa 95% di Membaca tetapi 60% di Menyimak — dan yang menentukan kelulusan gerbang adalah NILAI TERENDAH, bukan rata-rata. Ini meniru logika ambang bagian JLPT dan mencegah "kepintaran timpang".'

/* ==================== JALUR MULTI-BAHASA ==================== */
export const MULTILANG_PATH = [
  { year: 1, main: 'Jepang (N5→N4)', side: 'Inggris (maintenance)', target: 'JLPT N4 + IELTS 6.0' },
  { year: 2, main: 'Jepang (N3)', side: 'Mandarin (HSK 1–2)', target: 'JLPT N3 + HSK 2' },
  { year: 3, main: 'Mandarin (HSK 3–4)', side: 'Jepang (N2)', target: 'HSK 4 + JLPT N2' },
  { year: 4, main: 'Korea (TOPIK 1–3)', side: 'Mandarin (HSK 5)', target: 'TOPIK 3 + HSK 5' },
  { year: 5, main: 'Konsolidasi advanced', side: '—', target: 'JLPT N1 + HSK 6 + IELTS 7.5' },
]

export const MULTILANG_RULE =
  'Aturan emas multi-bahasa: jangan pernah memulai dua bahasa baru di GERBANG YANG SAMA secara bersamaan. Bahasa kedua baru boleh dimulai saat bahasa pertama sudah melewati Gerbang 3.'

/* ==================== ENTRY POINTS ==================== */
export const ENTRY_POINTS = [
  { profile: 'Nol total, belum pernah belajar bahasa asing selain Inggris sekolah', entry: 'Gerbang 0 bahasa pilihan', link: '/metode' },
  { profile: 'Sudah bisa baca hiragana/katakana', entry: 'JLPT N5 Unit 3', link: '/belajar/jp' },
  { profile: 'Sudah hafal pinyin & 4 nada', entry: 'HSK 1 Unit 2', link: '/belajar/cn' },
  { profile: 'Bisa baca Hangeul', entry: 'TOPIK 1 Unit 2', link: '/belajar/kr' },
  { profile: 'Inggris pasif kuat, butuh skor', entry: 'Diagnostik IELTS/TOEFL', link: '/belajar/en' },
]

/* ==================== SUMBER RESMI ==================== */
export const OFFICIAL_SOURCES = [
  { name: 'JLPT', url: 'https://www.jlpt.jp/e/' },
  { name: 'HSK', url: 'http://www.chinesetest.cn/' },
  { name: 'TOPIK', url: 'https://www.topik.go.kr/' },
  { name: 'IELTS', url: 'https://ielts.org/' },
  { name: 'TOEFL', url: 'https://www.ets.org/toefl/' },
]

export const ACCURACY_NOTES = [
  {
    title: 'TOEFL iBT',
    body: 'Skala 1–6 baru berlaku 21 Januari 2026; masa transisi pelaporan ganda berjalan ±2 tahun.',
  },
  {
    title: 'HSK 3.0',
    body: 'Silabus direvisi November 2025 dan diimplementasikan Juli 2026, tetapi sesi ujian HSK 1–6 sepanjang 2026 masih memakai daftar kosakata 2.0. SELALU tanyakan ke pusat ujian versi mana yang dipakai.',
  },
  {
    title: 'TOPIK',
    body: 'Jadwal IBT dan PBT berbeda tiap tahun; TOPIK Speaking adalah ujian terpisah dengan pendaftaran sendiri.',
  },
]
