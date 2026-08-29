import type { Unit } from '../types'

/** Additional English units, merged into the existing gates by index. */
export const EN_EXTRA: Record<number, Unit[]> = {
  /* ==================== GERBANG 0 — SISTEM BUNYI ==================== */
  0: [
    {
      id: 'en-g0-u2',
      title: 'Connected Speech',
      subtitle: 'Kenapa penutur asli terdengar "menelan" kata',
      level: 'B1',
      badge: 'wanna',
      notes: [
        {
          kind: 'concept',
          title: 'Masalahnya bukan kecepatan',
          body: 'Pelajar sering mengira penutur asli bicara terlalu cepat. Yang sebenarnya terjadi: kata-kata MENYATU dan sebagian bunyi hilang. Anda mencari batas kata yang secara akustik memang tidak ada di sana.',
        },
        {
          kind: 'table',
          title: 'Empat proses yang wajib dikenali',
          head: ['Proses', 'Apa yang terjadi', 'Contoh', 'Terdengar'],
          rows: [
            ['Linking', 'Konsonan akhir menyambung ke vokal awal', 'an apple', '"a-napple"'],
            ['Elision', 'Bunyi /t/ /d/ hilang di antara konsonan', 'next day', '"nex day"'],
            ['Assimilation', 'Bunyi berubah menyesuaikan tetangganya', 'ten boys', '"tem boys"'],
            ['Weak forms', 'Kata fungsi jadi /ə/', 'a cup of tea', '"a cup ə tea"'],
          ],
        },
        {
          kind: 'table',
          title: 'Weak form — kata yang hampir selalu direduksi',
          head: ['Kata', 'Bentuk kuat', 'Bentuk lemah (biasa)'],
          rows: [
            ['and', '/ænd/', '/ən/ — "fish ən chips"'],
            ['of', '/ɒv/', '/əv/ atau /ə/'],
            ['to', '/tuː/', '/tə/ — "I want tə go"'],
            ['can', '/kæn/', '/kən/'],
            ['for', '/fɔː/', '/fə/'],
            ['have', '/hæv/', '/əv/ — "should əv" (bukan "should of"!)'],
          ],
        },
        {
          kind: 'warning',
          title: 'Kenapa ini penting untuk pelajar Indonesia',
          body: 'Bahasa Indonesia mengucapkan setiap suku kata dengan panjang relatif sama (syllable-timed). Bahasa Inggris memampatkan suku kata tak bertekanan (stress-timed). Kita mendengar dengan telinga syllable-timed, jadi bunyi yang dimampatkan terasa "hilang" — padahal ia memang dimampatkan.',
        },
        {
          kind: 'tip',
          title: 'Latihan yang paling efektif: shadowing',
          body: 'Putar 30 detik audio, ucapkan BERSAMAAN dengan pembicara, bukan setelahnya. Anda akan otomatis meniru pemampatannya karena tidak sempat mengucapkan setiap suku kata penuh. Ini melatih telinga dan mulut sekaligus.',
        },
      ],
      lessons: [
        {
          id: 'en-g0-u2-l1',
          title: 'Mengenali bunyi terhubung',
          kind: 'drill',
          xp: 14,
          exercises: [
            {
              id: 'e1',
              type: 'choice',
              skill: 'menyimak',
              display: 'an apple',
              prompt: 'Bagaimana ini terdengar dalam ucapan alami?',
              options: ['an - apple (dengan jeda)', '"a-napple" — /n/ menyambung ke vokal', '"an-nepel"', '"en epel"'],
              answer: 1,
              explain: 'Linking: konsonan akhir menyambung ke vokal awal kata berikutnya. Batas katanya secara akustik hilang.',
            },
            {
              id: 'e2',
              type: 'match',
              skill: 'menyimak',
              prompt: 'Pasangkan proses dengan contohnya.',
              pairs: [
                ['Linking', 'an apple → "a-napple"'],
                ['Elision', 'next day → "nex day"'],
                ['Assimilation', 'ten boys → "tem boys"'],
                ['Weak form', 'a cup of tea → "a cup ə tea"'],
              ],
              explain: 'Empat proses ini menjelaskan hampir semua kasus "kok saya tidak dengar kata itu".',
            },
            {
              id: 'e3',
              type: 'choice',
              skill: 'menyimak',
              prompt: 'Kenapa orang menulis "should of" padahal seharusnya "should have"?',
              options: [
                'Kesalahan ejaan biasa',
                'Karena weak form "have" /əv/ terdengar persis seperti "of"',
                'Karena artinya sama',
                'Karena dialek tertentu',
              ],
              answer: 1,
              explain: 'Bukti bahwa weak form itu nyata — sampai penutur asli sendiri salah menuliskannya.',
            },
            {
              id: 'e4',
              type: 'choice',
              skill: 'berbicara',
              prompt: 'Apa perbedaan ritme Bahasa Indonesia dan Inggris?',
              options: [
                'Indonesia lebih cepat',
                'Indonesia syllable-timed (tiap suku kata relatif sama), Inggris stress-timed (yang tak bertekanan dimampatkan)',
                'Inggris punya lebih banyak vokal',
                'Tidak ada perbedaan ritme',
              ],
              answer: 1,
              explain: 'Kita mendengar dengan telinga syllable-timed, jadi suku kata yang dimampatkan terasa hilang. Shadowing adalah cara tercepat memperbaikinya.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-c-linking', front: 'Empat proses connected speech', back: 'Linking · Elision · Assimilation · Weak forms', lang: 'en', tag: 'Listening' },
        { id: 'en-c-weak', front: 'Weak form "have"', back: '/əv/ — terdengar seperti "of". Karena itu ada kesalahan "should of"', lang: 'en', tag: 'Listening' },
      ],
    },
  ],

  /* ==================== GERBANG 1 — PREPOSISI & TATA BAHASA DASAR ==================== */
  1: [
    {
      id: 'en-g1-u1',
      title: 'Preposisi Waktu & Tempat: In vs On vs At',
      subtitle: 'Piramida segitiga terbalik dari umum/luas hingga spesifik/titik',
      level: 'A1',
      badge: 'in · on · at',
      notes: [
        {
          kind: 'concept',
          title: 'Segitiga Terbalik Preposisi (In → On → At)',
          body: '1. IN (Paling Luas/Umum): Abad, dekade, tahun, bulan, musim (in 2026, in July, in summer) / Negara, kota, ruang tertutup (in Indonesia, in Jakarta, in the room).\n2. ON (Lebih Spesifik): Hari, tanggal, hari raya, permukaan (on Monday, on August 28th, on the table, on the bus).\n3. AT (Paling Sempit/Titik Presisi): Jam, titik lokasi presisi (at 7:00 PM, at the door, at home).',
        },
        {
          kind: 'table',
          title: 'Matriks In vs On vs At',
          head: ['Preposisi', 'Waktu (Kapan?)', 'Tempat (Di mana?)', 'Contoh Kalimat'],
          rows: [
            ['IN', 'Bulan/Tahun/Musim', 'Kota/Negara/Ruang', 'I was born in August in Jakarta.'],
            ['ON', 'Hari/Tanggal Pasti', 'Permukaan/Jalan/Transportasi Publik', 'The exam is on Friday on Elm Street.'],
            ['AT', 'Jam Presisi', 'Titik Lokasi Tertentu', 'Meet me at 8:30 at the station.'],
          ],
        },
      ],
      lessons: [
        {
          id: 'en-g1-u1-l1',
          title: 'Menentukan Preposisi In/On/At',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'en-pr1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Lengkapilah kalimat: The meeting starts ___ 9:00 AM ___ Monday.',
              options: ['at / on', 'in / on', 'on / at', 'at / in'],
              answer: 0,
              explain: 'Jam menggunakan "at" (at 9:00 AM), sedangkan hari menggunakan "on" (on Monday).',
            },
            {
              id: 'en-pr2',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Lengkapilah kalimat: We arrived ___ Tokyo ___ 2024.',
              options: ['in / in', 'at / on', 'on / in', 'in / at'],
              answer: 0,
              explain: 'Kota besar (Tokyo) dan tahun (2024) keduanya berada pada lingkup luas sehingga menggunakan "in".',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-xc-in-time', front: 'In 2026 / In July', back: 'Preposisi Waktu: Tahun, Bulan, Musim (Luas)', reading: 'Preposition', lang: 'en', tag: 'A1' },
        { id: 'en-xc-on-date', front: 'On Monday / On Aug 28', back: 'Preposisi Waktu: Hari & Tanggal (Spesifik)', reading: 'Preposition', lang: 'en', tag: 'A1' },
        { id: 'en-xc-at-time', front: 'At 7:00 PM / At noon', back: 'Preposisi Waktu: Jam Presisi & Titik Lokasi', reading: 'Preposition', lang: 'en', tag: 'A1' },
      ],
    },
  ],

  /* ==================== GERBANG 2 — MODAL VERBS & KEHARUSAN ==================== */
  2: [
    {
      id: 'en-g2-u1',
      title: 'Modal Verbs: Must vs Have to vs Should',
      subtitle: 'Membedakan kewajiban mutlak internal, aturan eksternal hukum, dan saran halus',
      level: 'A2',
      badge: 'must · have to · should',
      notes: [
        {
          kind: 'concept',
          title: 'Tiga Tingkat Keharusan dalam Bahasa Inggris',
          body: '1. MUST: Keharusan dari dalam diri sendiri / perasaan mendesak penutur ("I must study hard"). Bentuk negatif MUST NOT = Larangan keras (Dilarang!).\n2. HAVE TO: Keharusan karena aturan eksternal / hukum / SOP perusahaan ("You have to wear a seatbelt"). Bentuk negatif DON\'T HAVE TO = Tidak harus / tidak wajib (Boleh ya, boleh tidak).\n3. SHOULD: Saran / anjuran terbaik ("You should sleep early").',
        },
      ],
      lessons: [
        {
          id: 'en-g2-u1-l1',
          title: 'Memilih Modal Verb yang Tepat',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'en-mod1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'You ___ smoke here. It is strictly forbidden by law.',
              options: ['must not (larangan mutlak)', 'don\'t have to (tidak wajib)', 'should (saran)', 'might not (mungkin tidak)'],
              answer: 0,
              explain: '"Must not" menyatakan larangan keras yang tidak boleh dilanggar.',
            },
            {
              id: 'en-mod2',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Tomorrow is Sunday, so I ___ wake up early.',
              options: ['don\'t have to', 'must not', 'should not', 'can\'t'],
              answer: 0,
              explain: '"Don\'t have to" menyatakan tidak ada keharusan (bebas).',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-xc-must-not', front: 'Must not', back: 'Dilarang keras (prohibition)', reading: 'Modal Verb', lang: 'en', tag: 'A2' },
        { id: 'en-xc-dont-have-to', front: "Don't have to", back: 'Tidak perlu / tidak wajib (tidak ada keharusan)', reading: 'Modal Verb', lang: 'en', tag: 'A2' },
      ],
    },
  ],

  /* ==================== GERBANG 3 — TATA BAHASA ==================== */
  3: [
    {
      id: 'en-g3-u3',
      title: 'Artikel a / an / the',
      subtitle: 'Kesalahan #1 pelajar Indonesia — dan ia bisa dilatih',
      level: 'B1',
      badge: 'a/the',
      notes: [
        {
          kind: 'warning',
          title: 'Kenapa ini sangat sulit bagi kita',
          body: 'Bahasa Indonesia TIDAK PUNYA artikel sama sekali. "Saya membeli buku" tidak menyatakan apakah bukunya satu atau banyak, sudah dikenal atau belum. Bahasa Inggris memaksa Anda memutuskan itu di setiap kata benda — dan tidak ada pilihan "tidak menyatakan".',
        },
        {
          kind: 'formula',
          title: 'Pohon keputusan tiga pertanyaan',
          pre: '① Kata bendanya bisa dihitung?\n     TIDAK → tanpa artikel, atau "the" kalau spesifik\n              (water, information, advice)\n     YA ↓\n\n② Pembaca sudah tahu YANG MANA?\n     YA  → the\n              (the book I told you about)\n     TIDAK ↓\n\n③ Tunggal atau jamak?\n     Tunggal → a / an\n     Jamak   → tanpa artikel (atau some)',
        },
        {
          kind: 'table',
          title: 'Kapan "the" wajib',
          head: ['Kasus', 'Contoh'],
          rows: [
            ['Sudah disebut sebelumnya', 'I saw a dog. THE dog was barking.'],
            ['Hanya ada satu di dunia', 'the sun, the moon, the internet'],
            ['Superlatif & urutan', 'the best, the first, the same'],
            ['Diikuti keterangan pembatas', 'the book ON THE TABLE'],
            ['Nama sungai, laut, kepulauan', 'the Nile, the Pacific, the Philippines'],
          ],
        },
        {
          kind: 'table',
          title: 'Kata benda tak terhitung yang sering dikira terhitung',
          head: ['Salah', 'Benar'],
          rows: [
            ['an information', 'information / a piece of information'],
            ['an advice', 'advice / a piece of advice'],
            ['a research', 'research / a study'],
            ['equipments', 'equipment'],
            ['furnitures', 'furniture'],
            ['a homework', 'homework / an assignment'],
          ],
        },
        {
          kind: 'tip',
          title: 'Cara berlatih yang benar-benar bekerja',
          body: 'Jangan menghafal aturan. Ambil satu paragraf teks IELTS band 9, HAPUS semua artikelnya, lalu isi ulang dari nol dan bandingkan. Sepuluh menit sehari selama dua minggu memperbaiki lebih banyak daripada membaca daftar aturan berjam-jam.',
        },
      ],
      lessons: [
        {
          id: 'en-g3-u3-l1',
          title: 'Memilih artikel',
          kind: 'drill',
          xp: 16,
          exercises: [
            {
              id: 'e1',
              type: 'fill',
              skill: 'menulis',
              prompt: 'Lengkapi: "I saw ___ dog. ___ dog was barking."',
              sentence: 'I saw ___ dog. ___ dog was barking.',
              bank: ['a', 'the', 'an', '—'],
              answers: ['a', 'the'],
              explain: 'Penyebutan PERTAMA pakai "a" (pembaca belum tahu). Penyebutan KEDUA pakai "the" (sekarang sudah tahu yang mana).',
            },
            {
              id: 'e2',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Mana yang BENAR?',
              options: [
                'He gave me an advice',
                'He gave me a advice',
                'He gave me some advice',
                'He gave me advices',
              ],
              answer: 2,
              explain: '"advice" tak terhitung — tidak bisa "an advice" atau "advices". Kalau perlu satuan: "a piece of advice".',
            },
            {
              id: 'e3',
              type: 'sort',
              skill: 'menulis',
              prompt: 'Terhitung atau tak terhitung?',
              buckets: ['Terhitung', 'Tak terhitung'],
              items: [
                { text: 'book', bucket: 0 },
                { text: 'student', bucket: 0 },
                { text: 'suggestion', bucket: 0 },
                { text: 'information', bucket: 1 },
                { text: 'equipment', bucket: 1 },
                { text: 'research', bucket: 1 },
              ],
              explain: 'Perhatikan "suggestion" terhitung tapi "advice" tidak — tidak ada logika yang bisa memprediksinya, harus dihafal per kata.',
            },
            {
              id: 'e4',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Kenapa "the book on the table" memakai "the"?',
              options: [
                'Karena buku selalu pakai the',
                'Karena ada keterangan pembatas yang membuatnya spesifik — pembaca tahu buku yang mana',
                'Karena "table" pakai the',
                'Karena tunggal',
              ],
              answer: 1,
              explain: 'Keterangan pembatas ("on the table", "I told you about") otomatis membuat kata benda spesifik → the.',
            },
            {
              id: 'e5',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Latihan artikel yang paling efektif menurut modul ini?',
              options: [
                'Menghafal semua aturan',
                'Hapus artikel dari paragraf band 9, isi ulang, lalu bandingkan',
                'Selalu pakai "the" kalau ragu',
                'Menghindari kata benda',
              ],
              answer: 1,
              explain: 'Sepuluh menit sehari selama dua minggu memperbaiki lebih banyak daripada berjam-jam membaca aturan.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-c-artikel', front: 'Pohon keputusan artikel', back: '① bisa dihitung? ② pembaca tahu yang mana? → the ③ tunggal → a/an, jamak → tanpa artikel', lang: 'en', tag: 'Grammar' },
        { id: 'en-c-uncount', front: 'information · advice · research · equipment · furniture', back: 'Semua TAK TERHITUNG. ❌ an advice ❌ informations', lang: 'en', tag: 'Grammar' },
      ],
    },
    {
      id: 'en-g3-u4',
      title: 'Sistem Kala & Aspek',
      subtitle: 'Bukan 12 hal terpisah — hanya 3 × 4',
      level: 'B2',
      badge: '3×4',
      notes: [
        {
          kind: 'formula',
          title: '"12 tenses" sebenarnya sebuah tabel',
          pre: '          SIMPLE      CONTINUOUS    PERFECT        PERFECT CONT.\nPAST      did         was doing     had done       had been doing\nPRESENT   do/does     is doing      have done      have been doing\nFUTURE    will do     will be doing will have done will have been doing\n\n3 kala × 4 aspek = 12. Hafal 3 dan 4, bukan 12.',
        },
        {
          kind: 'table',
          title: 'Apa yang dinyatakan tiap ASPEK',
          head: ['Aspek', 'Menyatakan', 'Contoh'],
          rows: [
            ['Simple', 'fakta, kebiasaan, peristiwa utuh', 'I work here.'],
            ['Continuous', 'sedang berlangsung, sementara, belum selesai', 'I am working on it.'],
            ['Perfect', 'hubungan dengan titik waktu lain', 'I have worked here since 2020.'],
            ['Perfect continuous', 'durasi yang berlanjut sampai titik itu', 'I have been working since 8 a.m.'],
          ],
        },
        {
          kind: 'contrast',
          title: 'Present perfect vs past simple — jebakan terbesar',
          body: 'Past simple: waktunya SELESAI dan diketahui. "I saw him yesterday." Present perfect: masih terhubung ke sekarang, waktunya TIDAK disebut. "I have seen him." ❌ "I have seen him yesterday" — begitu ada "yesterday", wajib past simple.',
        },
        {
          kind: 'warning',
          title: 'Kata kerja keadaan tidak dipakai dalam continuous',
          body: 'know, believe, want, need, understand, belong, seem, contain. ❌ "I am knowing" → ✅ "I know". Pengecualian yang sudah diterima: "I\'m loving it" (informal), "I\'m thinking about it" (berpikir sebagai proses, bukan pendapat).',
        },
      ],
      lessons: [
        {
          id: 'en-g3-u4-l1',
          title: 'Memilih kala & aspek',
          kind: 'drill',
          xp: 16,
          exercises: [
            {
              id: 'e1',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Mana yang BENAR?',
              options: [
                'I have seen him yesterday',
                'I saw him yesterday',
                'I have saw him yesterday',
                'I was seeing him yesterday',
              ],
              answer: 1,
              explain: 'Begitu waktunya disebut dan sudah selesai ("yesterday"), wajib past simple. Present perfect tidak boleh dengan keterangan waktu selesai.',
            },
            {
              id: 'e2',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Mana yang SALAH?',
              options: ['I am working on it', 'I am knowing the answer', 'I know the answer', 'I have been working'],
              answer: 1,
              explain: '"know" adalah kata kerja KEADAAN — tidak dipakai dalam bentuk continuous.',
            },
            {
              id: 'e3',
              type: 'sort',
              skill: 'menulis',
              prompt: 'Aspek apa yang dipakai?',
              buckets: ['Simple', 'Continuous', 'Perfect'],
              items: [
                { text: 'I work here.', bucket: 0 },
                { text: 'Water boils at 100°C.', bucket: 0 },
                { text: 'I am working on it.', bucket: 1 },
                { text: 'She is staying with us.', bucket: 1 },
                { text: 'I have lived here since 2020.', bucket: 2 },
                { text: 'He has finished.', bucket: 2 },
              ],
              explain: 'Simple = fakta/kebiasaan · Continuous = sementara & belum selesai · Perfect = terhubung ke titik waktu lain.',
            },
            {
              id: 'e4',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Kenapa lebih mudah menghafal "3 × 4" daripada "12 tenses"?',
              options: [
                'Karena angkanya lebih kecil',
                'Karena kala dan aspek adalah dua pilihan TERPISAH yang dikombinasikan — bukan 12 bentuk yang tidak berhubungan',
                'Karena hanya 3 yang dipakai',
                'Karena aspeknya opsional',
              ],
              answer: 1,
              explain: 'Pilih kalanya (kapan), lalu pilih aspeknya (bagaimana peristiwa itu dilihat). Dua keputusan, bukan dua belas hafalan.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-c-tense', front: '"12 tenses" sebenarnya?', back: '3 kala (past/present/future) × 4 aspek (simple/continuous/perfect/perfect continuous)', lang: 'en', tag: 'Grammar' },
        { id: 'en-c-presperf', front: 'I have seen him yesterday?', back: 'SALAH. Ada keterangan waktu selesai → wajib past simple: I saw him yesterday', lang: 'en', tag: 'Grammar' },
      ],
    },
  ],

  /* ==================== GERBANG 4 — PRODUKSI ==================== */
  4: [
    {
      id: 'en-g4-u3',
      title: 'IELTS Task 1 — Deskripsi Data',
      subtitle: 'Tanpa overview = maksimal band 5',
      level: 'B2',
      badge: 'Task 1',
      notes: [
        {
          kind: 'formula',
          title: 'Struktur empat paragraf',
          pre: 'PARAGRAF 1 — Introduction (1 kalimat)\n  Parafrase judul grafiknya. Jangan menyalin.\n\nPARAGRAF 2 — OVERVIEW (2 kalimat)  ★ WAJIB\n  Tren PALING BESAR, tanpa satu pun angka.\n  Diawali "Overall, …"\n\nPARAGRAF 3 — Detail kelompok 1 (dengan angka)\nPARAGRAF 4 — Detail kelompok 2 (dengan angka)',
        },
        {
          kind: 'warning',
          title: 'Overview adalah syarat mutlak',
          body: 'Tanpa overview, Task Achievement dibatasi di band 5 — berapa pun bagusnya bahasa Anda. Overview tidak boleh mengandung angka; ia menyatakan gambaran besar (apa yang naik, apa yang turun, mana yang tertinggi).',
        },
        {
          kind: 'table',
          title: 'Kosakata tren — variasikan, jangan ulangi "increase"',
          head: ['Arah', 'Kata kerja', 'Kata benda', 'Keterangan'],
          rows: [
            ['Naik', 'rise, climb, surge, soar', 'a rise, an upward trend', 'sharply, steadily, gradually'],
            ['Turun', 'fall, decline, plummet, dip', 'a decline, a downturn', 'slightly, dramatically'],
            ['Stabil', 'remain stable, plateau, level off', 'a plateau', 'consistently'],
            ['Fluktuasi', 'fluctuate, vary', 'fluctuation', 'erratically'],
            ['Puncak', 'peak at, reach a peak of', 'a peak', '—'],
          ],
        },
        {
          kind: 'tip',
          title: 'Dua pola kalimat yang menaikkan Grammatical Range',
          body: '① "The figure for X rose sharply, whereas that for Y declined." (perbandingan + substitusi "that for"). ② "Having peaked at 60% in 2010, the proportion fell steadily." (participle clause). Tiga struktur seperti ini per esai sudah cukup.',
        },
      ],
      lessons: [
        {
          id: 'en-g4-u3-l1',
          title: 'Menulis deskripsi data',
          kind: 'drill',
          xp: 16,
          exercises: [
            {
              id: 'e1',
              type: 'order',
              skill: 'menulis',
              prompt: 'Susun struktur Task 1 yang benar.',
              chunks: [
                'Introduction — parafrase judul grafik',
                'Overview — tren terbesar, TANPA angka',
                'Detail kelompok 1 — dengan angka',
                'Detail kelompok 2 — dengan angka',
              ],
              answer: [0, 1, 2, 3],
              explain: 'Overview datang KEDUA, sebelum detail. Menaruhnya di akhir sebagai "kesimpulan" adalah kesalahan umum.',
            },
            {
              id: 'e2',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Mana overview yang BENAR?',
              options: [
                'In 2010, sales were 45%, rising to 60% in 2015.',
                'Overall, sales rose steadily throughout the period, while costs remained stable.',
                'The graph shows sales and costs.',
                'In conclusion, sales were higher.',
              ],
              answer: 1,
              explain: 'Overview menyatakan gambaran besar TANPA angka. Opsi 1 punya angka (itu detail), opsi 3 hanya introduction.',
            },
            {
              id: 'e3',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Task 1 tanpa overview mendapat maksimal band berapa?',
              options: ['Band 7', 'Band 6', 'Band 5', 'Tidak ada penalti'],
              answer: 2,
              explain: 'Task Achievement dibatasi band 5 — berapa pun bagusnya kosakata dan tata bahasanya.',
            },
            {
              id: 'e4',
              type: 'match',
              skill: 'menulis',
              prompt: 'Pasangkan arah tren dengan kata kerjanya.',
              pairs: [
                ['Naik tajam', 'surged / soared'],
                ['Turun drastis', 'plummeted'],
                ['Stabil', 'levelled off / plateaued'],
                ['Naik-turun tak beraturan', 'fluctuated'],
              ],
              explain: 'Mengulang "increase" enam kali memotong Lexical Resource. Variasi kata kerja tren adalah cara termudah menaikkannya.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-c-task1', front: 'Struktur IELTS Task 1', back: 'Intro → OVERVIEW (tanpa angka) → detail 1 → detail 2', lang: 'en', tag: 'Writing' },
        { id: 'en-c-trend', front: 'Kosakata tren naik/turun', back: 'surge, soar, climb / plummet, dip, decline / plateau, level off', lang: 'en', tag: 'Writing' },
      ],
    },
  ],

  /* ==================== GERBANG 5 — STRATEGI UJIAN ==================== */
  5: [
    {
      id: 'en-g5-u2',
      title: 'Jenis Soal Reading',
      subtitle: 'Masing-masing punya trik sendiri',
      level: 'B2',
      badge: 'T/F/NG',
      notes: [
        {
          kind: 'table',
          title: 'Jenis soal & strateginya',
          head: ['Jenis', 'Strategi'],
          rows: [
            ['True / False / Not Given', 'FALSE = teks MEMBANTAH · NOT GIVEN = teks DIAM. Jangan pakai pengetahuan umum'],
            ['Yes / No / Not Given', 'Sama, tetapi tentang PENDAPAT penulis, bukan fakta'],
            ['Matching headings', 'Baca kalimat PERTAMA dan TERAKHIR tiap paragraf lebih dulu'],
            ['Sentence completion', 'Perhatikan batas kata. Jawaban harus persis dari teks'],
            ['Multiple choice', 'Eliminasi dulu. Distraktor biasanya benar sebagian'],
            ['Matching information', 'Paling makan waktu — kerjakan TERAKHIR'],
            ['Summary completion', 'Tentukan jenis kata yang dibutuhkan sebelum mencari'],
          ],
        },
        {
          kind: 'warning',
          title: 'Kesalahan #1: FALSE padahal NOT GIVEN',
          body: 'FALSE berarti teks secara aktif MEMBANTAH pernyataan itu. Kalau teks hanya tidak menyebutkannya, jawabannya NOT GIVEN. Pelajar sering menjawab FALSE karena pernyataannya "terasa salah" menurut pengetahuan mereka sendiri — itu bukan yang ditanyakan.',
        },
        {
          kind: 'formula',
          title: 'Alokasi waktu IELTS Reading',
          pre: '3 teks · 40 soal · 60 menit · TANPA waktu transfer tambahan\n\n  Teks 1  →  17 menit  (paling mudah, kerjakan cepat)\n  Teks 2  →  20 menit\n  Teks 3  →  20 menit  (paling sulit)\n  Sisa    →   3 menit  memindahkan & memeriksa\n\nBerbeda dari Listening yang punya 10 menit transfer.',
        },
        {
          kind: 'tip',
          title: 'Parafrase adalah kunci sesungguhnya',
          body: 'Soal HAMPIR TIDAK PERNAH memakai kata yang sama dengan teks. Soal bilang "significant increase", teks bilang "rose considerably". Yang Anda cari adalah MAKNA yang cocok, bukan kata yang cocok. Inilah kenapa parafrase adalah keterampilan tunggal paling menentukan.',
        },
      ],
      lessons: [
        {
          id: 'en-g5-u2-l1',
          title: 'Menaklukkan jenis soal',
          kind: 'drill',
          xp: 16,
          exercises: [
            {
              id: 'e1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Teks: "The museum opened in 1885." Pernyataan: "The museum was the first in the city." Jawabannya?',
              options: ['TRUE', 'FALSE', 'NOT GIVEN', 'Tidak bisa dijawab'],
              answer: 2,
              explain: 'Teks tidak menyebutkan apa pun tentang museum lain di kota itu. Ia tidak membantah — ia DIAM → NOT GIVEN.',
            },
            {
              id: 'e2',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Teks: "Sales rose considerably." Soal mencari: "significant increase". Apa yang terjadi?',
              options: [
                'Tidak cocok karena katanya berbeda',
                'Cocok — ini parafrase, dan itu memang cara soal dibuat',
                'Perlu mencari kata "significant" di teks',
                'Jawabannya NOT GIVEN',
              ],
              answer: 1,
              explain: 'Soal hampir tidak pernah memakai kata yang sama. Cari MAKNA yang cocok, bukan kata yang cocok.',
            },
            {
              id: 'e3',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Soal "Matching headings": apa yang dibaca lebih dulu?',
              options: [
                'Seluruh paragraf dengan teliti',
                'Kalimat PERTAMA dan TERAKHIR tiap paragraf',
                'Hanya judulnya',
                'Paragraf terakhir saja',
              ],
              answer: 1,
              explain: 'Ide pokok paragraf hampir selalu ada di kalimat pertama atau terakhir. Membaca semuanya membuang waktu yang dibutuhkan teks 3.',
            },
            {
              id: 'e4',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Jenis soal apa yang sebaiknya dikerjakan TERAKHIR?',
              options: ['True/False/Not Given', 'Sentence completion', 'Matching information (paragraf mana yang memuat X)', 'Multiple choice'],
              answer: 2,
              explain: 'Matching information menuntut memindai SELURUH teks untuk tiap soal — paling makan waktu, dan jawabannya tidak berurutan.',
            },
            {
              id: 'e5',
              type: 'choice',
              skill: 'membaca',
              prompt: 'IELTS Reading: 60 menit untuk 3 teks. Kenapa alokasinya tidak rata 20-20-20?',
              options: [
                'Boleh rata saja',
                'Teks 1 paling mudah — kerjakan ~17 menit, sisakan 3 menit untuk memindahkan jawaban',
                'Teks 3 paling mudah',
                'Karena teks 1 lebih panjang',
              ],
              answer: 1,
              explain: 'Reading TIDAK punya waktu transfer tambahan seperti Listening. Waktu memindahkan jawaban harus diambil dari 60 menit itu.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-c-tfng2', front: 'Museum buka 1885. "Museum pertama di kota." Jawabannya?', back: 'NOT GIVEN — teks diam soal museum lain, bukan membantah', lang: 'en', tag: 'Reading' },
        { id: 'en-c-waktu', front: 'Alokasi waktu IELTS Reading', back: '17 + 20 + 20 + 3 menit transfer. TIDAK ada waktu transfer tambahan', lang: 'en', tag: 'Reading' },
      ],
    },
    {
      id: 'en-g5-extra-u1',
      title: 'Academic Writing Task 2: Cohesion, Lexical Resource & Inversion',
      subtitle: 'Teknik penulisan esai argumen berbobot akademis tinggi untuk meraih Band 8.5–9.0',
      level: 'C2',
      badge: 'IELTS Band 9 · Inversion',
      notes: [
        {
          kind: 'concept',
          title: 'Negative Inversion untuk Penekanan Retorika C2',
          body: 'Dalam penulisan formal C2/IELTS, menaruh kata keterangan negatif di awal kalimat membalik susunan subjek dan kata kerja bantu (Auxiliary Inversion):\n• "Rarely have we witnessed such rapid technological shifts..." (Bukan "We have rarely witnessed...")\n• "Not only does education enhance individual prosperity, but it also fosters national resilience."\n• "Under no circumstances should governments neglect public health funding."',
        },
        {
          kind: 'table',
          title: 'Frasa Penghubung Esai Akademik Tingkat Tinggi',
          head: ['Fungsi Wacana', 'Frasa Biasa (B1/B2)', 'Frasa Akademik Tingkat Tinggi (C1/C2)'],
          rows: [
            ['Menyajikan kontras', 'However / On the other hand', 'Conversely / Notwithstanding this fact'],
            ['Memberi alasan', 'Because of this / So', 'Consequently / It follows that...'],
            ['Menekankan dampak', 'It has a big effect on...', 'It exerts a profound influence on...'],
            ['Menyimpulkan', 'In conclusion / I think', 'In the final analysis, it is compelling that...'],
          ],
        },
      ],
      lessons: [
        {
          id: 'en-g5-xu1-l1',
          title: 'Menguasai Struktur Kalimat Inversi C2',
          kind: 'drill',
          xp: 30,
          exercises: [
            {
              id: 'ex1',
              type: 'choice',
              skill: 'menulis',
              prompt: 'Pilihlah bentuk kalimat inversi yang tepat untuk esai formal:',
              options: [
                'Seldom have researchers encountered such anomalies.',
                'Seldom researchers have encountered such anomalies.',
                'Seldom have encountered researchers such anomalies.',
                'Seldom researchers encountered such anomalies.',
              ],
              answer: 0,
              explain: 'Setelah adverbia negatif di awal kalimat (Seldom, Rarely, Scarcely), kata kerja bantu (have) mendahului subjek (researchers).',
            },
            {
              id: 'ex2',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Padanan akademik formal dari "This affects the economy greatly" adalah…',
              options: [
                'This exerts a profound socioeconomic impact.',
                'This makes the economy very different.',
                'This changes the money in the country big time.',
                'This has lots of results for economic things.',
              ],
              answer: 0,
              explain: '"Exerts a profound socioeconomic impact" menunjukkan penguasaan Lexical Resource tingkat Band 8.5+ di IELTS Academic Writing.',
            },
          ],
        },
      ],
      cards: [
        { id: 'en-xc-inversion', front: 'Negative Inversion: Seldom / Rarely', back: 'Seldom + Aux + Subject + Verb ("Seldom have we seen...")', reading: 'Grammar C2', lang: 'en', tag: 'C2' },
      ],
    },
  ],
}
