import type { Unit } from '../types'

/**
 * JP_EXTRA: Massive expansion of Japanese curriculum from beginner zero to advanced N1.
 * Provides encyclopedia-grade pedagogical depth for Indonesian learners.
 */
export const JP_EXTRA: Record<number, Unit[]> = {
  // -------------------------------------------------------------
  // GERBANG 0 (Sistem Bunyi & Pondasi Aksara)
  // -------------------------------------------------------------
  0: [
    {
      id: 'jp-g0-extra-u1',
      title: 'Dakuon, Handakuon & Youon (Bunyi Gabungan)',
      subtitle: 'Membedakan bunyi keruh (tenten), setengah keruh (maru), dan vokal kecil (ya, yu, yo)',
      level: 'N5',
      badge: 'が ざ だ ば ぱ / きゃ きゅ きょ',
      notes: [
        {
          kind: 'concept',
          title: 'Perubahan Bunyi dengan Titik Dua (Tenten ゛) dan Lingkaran (Maru ゜)',
          body: 'Dalam Hiragana & Katakana, tanda tenten (゛) mengubah konsonan tak bersuara menjadi bersuara (K→G, S→Z, T→D, H→B). Tanda maru (゜) khusus untuk baris H mengubahnya menjadi letup bibir (H→P).',
        },
        {
          kind: 'table',
          title: 'Tabel Perubahan Dakuon & Handakuon',
          head: ['Baris Asal', 'Dakuon (゛)', 'Handakuon (゜)', 'Contoh Kata'],
          rows: [
            ['Ka (か/き/く/け/こ)', 'Ga (が/ぎ/ぐ/げ/ご)', '—', 'ぎんこう (Bank)'],
            ['Sa (さ/し/す/せ/そ)', 'Za/Ji/Zu/Ze/Zo (ざ/じ/ず/ぜ/ぞ)', '—', 'ざっし (Majalah)'],
            ['Ta (た/ち/つ/て/と)', 'Da/Ji/Zu/De/Do (だ/ぢ/づ/de/do)', '—', 'でんしゃ (Kereta)'],
            ['Ha (は/ひ/ふ/へ/ほ)', 'Ba (ば/び/ぶ/べ/ぼ)', 'Pa (ぱ/ぴ/ぷ/ぺ/ぽ)', 'ぱん (Roti), ほんば (Asli)'],
          ],
        },
        {
          kind: 'warning',
          title: 'Jebakan Bunyi Youon (ゃ ゅ ょ kecil)',
          body: 'Bunyi gabungan Youon ditulis dengan huruf baris -i ditambah ya/yu/yo berukuran setengah (kecil). Contoh: きよ (ki-yo = 2 mora) BERBEDA TOTAL dengan きょ (kyo = 1 mora). Contoh: じゆう (ji-yu-u = kebebasan) vs じゅう (jū = sepuluh).',
        },
      ],
      lessons: [
        {
          id: 'jp-g0-xu1-l1',
          title: 'Latihan Dakuon & Handakuon',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'jx1',
              type: 'choice',
              skill: 'menyimak',
              display: 'でんしゃ',
              reading: 'densha',
              prompt: 'Apa arti kata でんしゃ?',
              options: ['Kereta api', 'Pesawat terbang', 'Sepeda motor', 'Mobil dinas'],
              answer: 0,
              explain: 'でんしゃ (densha) = kereta listrik / kereta api.',
            },
            {
              id: 'jx2',
              type: 'choice',
              skill: 'menyimak',
              display: 'びょういん',
              reading: 'byōin',
              prompt: 'Berapa mora dalam kata びょういん (Rumah Sakit)?',
              options: ['2 mora', '3 mora', '4 mora', '5 mora'],
              answer: 2,
              explain: 'びょう (byo-u = 2) + い (1) + ん (1) = 4 mora. Bandingkan dengan びよういん (Salon Kecantikan, 5 mora).',
            },
            {
              id: 'jx3',
              type: 'match',
              skill: 'membaca',
              prompt: 'Pasangkan kata dengan maknanya yang tepat.',
              pairs: [
                ['びょういん', 'Rumah sakit'],
                ['びよういん', 'Salon kecantikan'],
                ['きょう', 'Hari ini'],
                ['ぎんこう', 'Bank'],
              ],
              explain: 'Membedakan vokal kecil (youon) dan vokal normal sangat krusial agar tidak salah tujuan di Jepang.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-densha', front: 'でんしゃ', back: 'Kereta api listrik', reading: 'densha', lang: 'jp', tag: 'Dakuon' },
        { id: 'jp-xc-byoin', front: 'びょういん', back: 'Rumah sakit (4 mora)', reading: 'byōin', lang: 'jp', tag: 'Youon' },
        { id: 'jp-xc-biyoin', front: 'びよういん', back: 'Salon kecantikan (5 mora)', reading: 'biyōin', lang: 'jp', tag: 'Youon' },
      ],
    },
    {
      id: 'jp-g0-extra-u2',
      title: 'Katakana & Kosakata Serapan Asing (Gairaigo)',
      subtitle: 'Memahami fonologi serapan bahasa Inggris, Jerman, & Portugis ke dalam bahasa Jepang',
      level: 'N5',
      badge: 'カタカナ · 外来語',
      notes: [
        {
          kind: 'concept',
          title: 'Kenapa Bahasa Jepang Membutuhkan Katakana?',
          body: 'Katakana digunakan khusus untuk kata serapan asing (Gairaigo), nama orang non-Jepang, nama negara asing, onomatopoeia suara robotik/tiruan, dan penekanan ilmiah (nama spesies botani).',
        },
        {
          kind: 'table',
          title: 'Kosakata Serapan yang Artinya Bergeser (Japlish / Wasei-eigo)',
          head: ['Kata Katakana', 'Berasal Dari', 'Arti Sebenarnya di Jepang', 'Arti Asli Bahasa Inggris'],
          rows: [
            ['マンション (manshon)', 'Mansion', 'Apartemen beton bertingkat biasa', 'Rumah mewah miliarder'],
            ['アパート (apāto)', 'Apartment', 'Rumah petak kayu 2 lantai sederhana', 'Apartemen'],
            ['アルバイト (arubaito)', 'Arbeit (Jerman)', 'Pekerjaan paruh waktu / part-time', 'Pekerjaan (umum)'],
            ['コンセント (konsento)', 'Concentric plug', 'Stopkontak listrik di dinding', 'Izin / kesepakatan (consent)'],
            ['スキンシップ (sukinshippu)', 'Skin + ship (ciptaan Jepang)', 'Sentuhan fisik kasih sayang / pelukan', 'Bukan kata bahasa Inggris asli'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g0-xu2-l1',
          title: 'Mengenali Kata Serapan Katakana',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'jx12',
              type: 'choice',
              skill: 'menyimak',
              display: 'アルバイト',
              reading: 'arubaito',
              prompt: 'Apa arti kata アルバイト di Jepang?',
              options: ['Kerja paruh waktu (part-time)', 'Kerja lembur malam', 'Kerja kantoran tetap', 'Pekerja lepas mandiri'],
              answer: 0,
              explain: 'アルバイト berasal dari bahasa Jerman "Arbeit", di Jepang artinya kerja sambilan/part-time.',
            },
            {
              id: 'jx13',
              type: 'choice',
              skill: 'membaca',
              display: 'マンション',
              reading: 'manshon',
              prompt: 'Di Jepang, マンション merujuk pada…',
              options: ['Rumah istana megah', 'Apartemen gedung beton modern', 'Rumah gubuk tradisional', 'Kamar hotel bintang 5'],
              answer: 1,
              explain: 'Wasei-eigo: mansion di Jepang berarti apartemen berstruktur beton bertingkat.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-arubaito', front: 'アルバイト', back: 'Kerja paruh waktu / sambilan', reading: 'arubaito', lang: 'jp', tag: 'Katakana' },
        { id: 'jp-xc-manshon', front: 'マンション', back: 'Apartemen gedung bertingkat', reading: 'manshon', lang: 'jp', tag: 'Katakana' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 1 (Tingkat N5 — Pola Kalimat & Partikel Inti)
  // -------------------------------------------------------------
  1: [
    {
      id: 'jp-g1-extra-u1',
      title: 'Tiga Kelompok Kata Kerja & Rumus Perubahan Bentuk Te (〜て形)',
      subtitle: 'Pondasi utama untuk membentuk kalimat perintah, sambung, dan sedang berlangsung',
      level: 'N5',
      badge: '動詞グループ · て形',
      notes: [
        {
          kind: 'concept',
          title: 'Klasifikasi 3 Golongan Kata Kerja Jepang',
          body: '1. Golongan 1 (Godan / Lima Vokal): Berakhiran u, ku, su, tsu, nu, bu, mu, ru (didahului vokal selain i/e).\n2. Golongan 2 (Ichidan): Berakhiran -iru atau -eru (contoh: たべる taberu, みる miru).\n3. Golongan 3 (Fukisoku / Tak Beraturan): Hanya ada dua kata: くる (kuru = datang) dan する (suru = melakukan).',
        },
        {
          kind: 'table',
          title: 'Tabel Lagu Sakti Perubahan Bentuk Te (Golongan 1)',
          head: ['Akhiran Kamus', 'Berubah Menjadi', 'Contoh Kamus', 'Bentuk Te'],
          rows: [
            ['う (u), つ (tsu), る (ru)', 'って (-tte)', 'かう (kau) / まつ (matsu) / とる (toru)', 'かって / まって / とって'],
            ['む (mu), ぶ (bu), ぬ (nu)', 'んで (-nde)', 'のむ (nomu) / あそぶ (asobu) / しぬ (shinu)', 'のんで / あそんで / しんで'],
            ['く (ku)', 'いて (-ite) *Pengecualian いく→いって', 'かく (kaku)', 'かいて'],
            ['ぐ (gu)', 'いで (-ide)', 'およぐ (oyogu)', 'およいで'],
            ['す (su)', 'して (-shite)', 'はなす (hanasu)', 'はなして'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g1-xu1-l1',
          title: 'Latihan Konjugasi Bentuk Te',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'jx14',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Bentuk te dari kata kerja のむ (nomu = minum) adalah…',
              options: ['のんで', 'のみて', 'のって', 'のして'],
              answer: 0,
              explain: 'Kata kerja berakhiran -mu (Golongan 1) berubah menjadi -nde: のむ → のんで.',
            },
            {
              id: 'jx15',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Bentuk te dari kata kerja たべる (taberu = makan, Golongan 2) adalah…',
              options: ['たべて', 'たべって', 'たべんで', 'たべして'],
              answer: 0,
              explain: 'Golongan 2 (akhiran -eru) tinggal menghilangkan る dan menambahkan て: たべる → たべて.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-nonde', front: 'のんで', back: 'Minumlah / Minum dan... (Bentuk Te)', reading: 'nonde', lang: 'jp', tag: 'BentukTe' },
        { id: 'jp-xc-tabete', front: 'たべて', back: 'Makanlah / Makan dan... (Bentuk Te)', reading: 'tabete', lang: 'jp', tag: 'BentukTe' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 2 (Tingkat N4 — Konjugasi Bentuk Te, Nai, & Syarat)
  // -------------------------------------------------------------
  2: [
    {
      id: 'jp-g2-extra-u1',
      title: 'Bentuk Pasif (受け身), Kausatif (使役) & Kausatif-Pasif',
      subtitle: 'Memahami sudut pandang korban (penderitaan) dan suruhan dalam budaya Jepang',
      level: 'N4',
      badge: 'られる · させる · させられる',
      notes: [
        {
          kind: 'concept',
          title: 'Bentuk Pasif Penderitaan (Meiwaku Ukemi)',
          body: 'Di Jepang, kalimat pasif sering kali memuat rasa "merasa dirugikan/menderita akibat tindakan orang lain". Contoh: 雨に降られた (Ame ni furareta = Saya kehujanan / menderita karena hujan turun padaku).',
        },
        {
          kind: 'table',
          title: 'Matriks 3 Bentuk Hubungan Kekuasaan & Aksi',
          head: ['Bentuk', 'Arti', 'Golongan 1 (Contoh: 飲む)', 'Golongan 2 (Contoh: 食べる)'],
          rows: [
            ['Pasif (〜られる)', 'Dikenai aksi / dibuat menderita', 'のまれる (diminum)', 'たべられる (dimakan)'],
            ['Kausatif (〜させる)', 'Menyuruh / membiarkan', 'のませる (menyuruh minum)', 'たべさせる (menyuruh makan)'],
            ['Kausatif-Pasif (〜させられる)', 'Dipaksa / terpaksa melakukan', 'のませられる (dipaksa minum)', 'たべさせられる (dipaksa makan)'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g2-xu1-l1',
          title: 'Membedakan Pasif, Kausatif, dan Kausatif-Pasif',
          kind: 'drill',
          xp: 20,
          exercises: [
            {
              id: 'jx16',
              type: 'choice',
              skill: 'membaca',
              prompt: 'きのう、あめに___、かぜを ひきました。 (Kemarin saya kehujanan dan jadi masuk angin)',
              options: ['ふられて (pasif penderitaan)', 'ふらせて (kausatif)', 'ふって (aktif biasa)', 'ふらせられて (kausatif-pasif)'],
              answer: 0,
              explain: 'Meiwaku Ukemi: あめにふられて = menderita akibat dituruni hujan.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-furareta', front: 'あめにふられた', back: 'Kehujanan (Pasif penderitaan)', reading: 'ame ni furareta', lang: 'jp', tag: 'N4' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 3 (Tingkat N3 — Pola Menengah, Pendapat & Fakta)
  // -------------------------------------------------------------
  3: [
    {
      id: 'jp-g3-extra-u1',
      title: 'Kata Kerja Transitif vs Intransitif (他動詞 vs 自動詞)',
      subtitle: 'Membedakan aksi yang disengaja manusia (〜を) dan kejadian alami tanpa pelaku (〜が)',
      level: 'N3',
      badge: '自動詞 vs 他動詞',
      notes: [
        {
          kind: 'concept',
          title: 'Pasangan Intransitif (Jidoushi) vs Transitif (Tadoushi)',
          body: '1. Jidoushi (Intransitif): Fokus pada KONDISI / STATUS yang terjadi dengan sendirinya. Menggunakan partikel が (ga). Contoh: ドアが 開く (Pintu terbuka).\n2. Tadoushi (Transitif): Fokus pada AKSI PELAKU yang menyengaja. Menggunakan partikel を (o). Contoh: ドアを 開ける (Saya membuka pintu).',
        },
        {
          kind: 'table',
          title: 'Tabel Pasangan Jidoushi vs Tadoushi Wajib N3',
          head: ['Jidoushi (Intransitif 〜が)', 'Tadoushi (Transitif 〜を)', 'Arti Dasar'],
          rows: [
            ['あく (aku) — pintu terbuka', 'あける (akeru) — membuka pintu', 'Buka'],
            ['しまる (shimaru) — pintu tertutup', 'しめる (shimeru) — menutup pintu', 'Tutup'],
            ['つく (tsuku) — lampu menyala', 'つける (tsukeru) — menyalakan lampu', 'Nyalakan'],
            ['きえる (kieru) — api/lampu padam', 'けす (kesu) — memadamkan api/lampu', 'Padamkan'],
            ['おちる (ochiru) — barang terjatuh', 'おとす (otosu) — menjatuhkan barang', 'Jatuh'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g3-xu1-l1',
          title: 'Latihan Memilih Pasangan Transitif/Intransitif',
          kind: 'drill',
          xp: 20,
          exercises: [
            {
              id: 'jx17',
              type: 'choice',
              skill: 'membaca',
              prompt: 'でんきが___。 (Lampu menyala dengan sendirinya)',
              options: ['つきました (intransitif)', 'つけました (transitif)', 'けしました (mematikan)', 'あけました (membuka)'],
              answer: 0,
              explain: 'Partikel が menandakan kondisi alami intransitif: でんきが つきました (lampu menyala).',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-aku', front: '開く (あく)', back: 'Terbuka (Intransitif 〜が)', reading: 'aku', lang: 'jp', tag: 'Jidoushi' },
        { id: 'jp-xc-akeru', front: '開ける (あける)', back: 'Membuka (Transitif 〜を)', reading: 'akeru', lang: 'jp', tag: 'Tadoushi' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 4 (Tingkat N2 — Bahasa Berita & Esai Formal)
  // -------------------------------------------------------------
  4: [
    {
      id: 'jp-g4-extra-u1',
      title: 'Struktur Logika Esai Formal: 〜わけではない vs 〜どころではない',
      subtitle: 'Membedakan penyangkalan sebagian halus dan situasi darurat yang mustahil',
      level: 'N2',
      badge: 'わけではない · どころではない',
      notes: [
        {
          kind: 'concept',
          title: 'Penyangkalan Halus vs Ketidakmungkinan Mutlak',
          body: '1. 〜わけではない (-wake dewa nai) = "Bukan berarti selalu begitu" (Penyangkalan parsial, tidak mutlak).\n2. 〜どころではない (-dokoro dewa nai) = "Jangankan melakukan X, situasinya sangat gawat sampai tidak sempat memikirkannya sama sekali".',
        },
      ],
      lessons: [
        {
          id: 'jp-g4-xu1-l1',
          title: 'Analisis Nuansa Kalimat N2',
          kind: 'drill',
          xp: 25,
          exercises: [
            {
              id: 'jx18',
              type: 'choice',
              skill: 'membaca',
              prompt: 'しけんの まえのひ だから、あそぶ___。 (Karena besok ujian, jangankan main, waktu belajar saja kurang)',
              options: ['どころではない', 'わけではない', 'ものだ', 'はずだ'],
              answer: 0,
              explain: 'どころではない menandakan situasi mendesak di mana aktivitas tersebut sama sekali tidak memungkinkan untuk dilakukan.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-dokoro', front: '〜どころではない', back: 'Jangankan... situasi sama sekali tidak memungkinkan', reading: 'dokoro dewa nai', lang: 'jp', tag: 'N2' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 5 (Tingkat N1 — Keigo Tingkat Tinggi & Esai Akademik)
  // -------------------------------------------------------------
  5: [
    {
      id: 'jp-g5-extra-u1',
      title: 'Ungkapan Klasik & Tata Bahasa Tingkat N1: 〜極まりない vs 〜を禁じ得ない',
      subtitle: 'Bahasa sastra dan ekspresi retorika tinggi dalam opini editorial Jepang',
      level: 'N1',
      badge: '極まりない · 禁じ得ない',
      notes: [
        {
          kind: 'concept',
          title: 'Kosakata & Tata Bahasa Tertinggi N1',
          body: '1. 〜きわまりない (kiwamarinai) / 〜きわまる (kiwamaru) = "Sangat amat luar biasa / tiada taranya" (biasanya untuk emosi ekstrem seperti rasa malu, tidak sopan, atau bahaya).\n2. 〜をきんじえない (o kinjienai) = "Tidak dapat membendung / tidak kuasa menahan" (contoh: rasa sedih, simpati, atau kemarahan).',
        },
      ],
      lessons: [
        {
          id: 'jp-g5-xu1-l1',
          title: 'Membaca Tajuk Rencana & Editorial Tingkat N1',
          kind: 'drill',
          xp: 30,
          exercises: [
            {
              id: 'jx19',
              type: 'choice',
              skill: 'membaca',
              prompt: 'ひさいちの さんじょうを みて、なみだを___。 (Melihat penderitaan di daerah bencana, saya tak kuasa membendung air mata)',
              options: ['禁じ得ない (kinjienai)', '極まりない (kiwamarinai)', 'やまない (yamanai)', 'たえない (taenai)'],
              answer: 0,
              explain: '涙を禁じ得ない (namida o kinjienai) adalah kolokasi tingkat N1 yang berarti tak kuasa menahan air mata.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-kinjienai', front: '〜を禁じ得ない', back: 'Tak kuasa membendung (emosi/air mata/kemarahan)', reading: 'o kinji enai', lang: 'jp', tag: 'N1' },
      ],
    },
  ],
}
