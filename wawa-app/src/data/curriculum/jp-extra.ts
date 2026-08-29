import type { Unit } from '../types'

/**
 * JP_EXTRA: Comprehensive, book-grade Japanese curriculum from zero to JLPT N1.
 * Covers full vocabulary, listening, reading, speaking, and writing competencies.
 */
export const JP_EXTRA: Record<number, Unit[]> = {
  // -------------------------------------------------------------
  // GERBANG 0 (Sistem Bunyi, Huruf & Angka)
  // -------------------------------------------------------------
  0: [
    {
      id: 'jp-g0-extra-u1',
      title: 'Dakuon, Handakuon & Youon (Bunyi Gabungan)',
      subtitle: 'Membedakan bunyi keruh (tenten ゛), setengah keruh (maru ゜), dan vokal kecil (ゃ ゅ ょ)',
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
            ['Ta (た/ち/つ/て/と)', 'Da/Ji/Zu/De/Do (だ/ぢ/づ/で/ど)', '—', 'でんしゃ (Kereta)'],
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
          title: 'Latihan Dakuon, Handakuon & Youon',
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
    {
      id: 'jp-g0-extra-u3',
      title: 'Kata Bantu Satuan Bilangan (助数詞 Josuushi)',
      subtitle: 'Menghitung benda tipis (枚), silinder panjang (本), hewan kecil (匹), dan buku (冊)',
      level: 'N5',
      badge: '〜本 · 〜枚 · 〜匹',
      notes: [
        {
          kind: 'concept',
          title: 'Logika Menghitung Objek dalam Bahasa Jepang',
          body: 'Bahasa Jepang tidak bisa menghitung objek hanya dengan angka murni (seperti "2 pensil"). Harus ada kata bantu hitung (counter) sesuai bentuk fisik benda: panjang silinder (本 hon), lembaran tipis (枚 mai), buku jilid (冊 satsu), mesin/kendaraan (台 dai).',
        },
        {
          kind: 'table',
          title: 'Tabel Satuan Hitungan Terpopuler N5',
          head: ['Satuan Hitung', 'Kategori Objek', 'Contoh Benda', 'Contoh Hitungan'],
          rows: [
            ['本 (hon/pon/bon)', 'Benda panjang & silinder', 'Botol, payung, pena, pohon, jalan', 'いっぽん (1), にほん (2), さんぼん (3)'],
            ['枚 (mai)', 'Benda tipis & datar', 'Kertas, baju, piring, tiket, perangko', 'いちまい (1), にまい (2), さんまい (3)'],
            ['匹 (hiki/piki/biki)', 'Hewan kecil & ikan', 'Kucing, anjing, ikan, serangga', 'いっぴき (1), にひき (2), さんびき (3)'],
            ['冊 (satsu)', 'Buku & majalah terjilid', 'Buku tulis, novel, kamus', 'いっさつ (1), にさつ (2), さんさつ (3)'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g0-xu3-l1',
          title: 'Menghitung Objek di Sekitar Kita',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'jx-cnt1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Untuk menghitung 3 lembar tiket kereta, satuan apa yang digunakan?',
              options: ['さんまい (枚)', 'さんぼん (本)', 'さんびき (匹)', 'さんさつ (冊)'],
              answer: 0,
              explain: 'Tiket adalah benda tipis dan pipih sehingga wajib menggunakan satuan 枚 (mai): さんまい.',
            },
            {
              id: 'jx-cnt2',
              type: 'choice',
              skill: 'menyimak',
              display: 'ジュースを にほん かいました。',
              reading: 'Jūsu o nihon kaimashita.',
              prompt: 'Berapa banyak jus yang dibeli pada kalimat di atas?',
              options: ['2 botol / kaleng', '2 lembar', '2 buku', '2 ekor'],
              answer: 0,
              explain: '本 (hon) digunakan untuk benda panjang/silinder seperti botol atau kaleng jus. にほん = 2 botol.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-mai', front: '〜枚 (まい)', back: 'Satuan lembar (kertas, baju, tiket)', reading: 'mai', lang: 'jp', tag: 'Hitungan' },
        { id: 'jp-xc-hon', front: '〜本 (ほん)', back: 'Satuan batang/botol (benda silinder)', reading: 'hon', lang: 'jp', tag: 'Hitungan' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 1 (Tingkat N5 — Pola Kalimat, Kata Sifat & Partikel)
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
    {
      id: 'jp-g1-extra-u2',
      title: 'Kata Sifat i (い形容詞) vs Kata Sifat na (な形容詞)',
      subtitle: 'Konjugasi negatif, lampau, dan menyambungkan dua kata sifat',
      level: 'N5',
      badge: '〜くない · 〜でした · 〜くて',
      notes: [
        {
          kind: 'concept',
          title: 'Dua Ras Kata Sifat dalam Bahasa Jepang',
          body: '1. I-Keiyoushi: Berakhiran vokal い murni (takai, oishii, samui). Mengubah bentuknya sendiri secara internal (takakunai, takakatta).\n2. Na-Keiyoushi: Berakhiran selain i atau kata serapan (shizuka, kirei, benri). Membutuhkan kata bantu desu/da (shizuka janai, shizuka deshita).',
        },
        {
          kind: 'table',
          title: 'Matriks Konjugasi Kata Sifat',
          head: ['Bentuk', 'I-Keiyoushi (Tinggi: たかい)', 'Na-Keiyoushi (Sunyi: しずか)', 'Pengecualian: Bagus (いい)'],
          rows: [
            ['Positif Sekarang', 'たかいです', 'しずかです', 'いいです'],
            ['Negatif Sekarang', 'たかくないです', 'しずかじゃないです', 'よくないです'],
            ['Positif Lampau', 'たかかったです', 'しずかでした', 'よかったです'],
            ['Negatif Lampau', 'たかくなかったです', 'しずかじゃなかったです', 'よくなかったです'],
          ],
        },
      ],
      lessons: [
        {
          id: 'jp-g1-xu2-l1',
          title: 'Konjugasi Kata Sifat Praktis',
          kind: 'drill',
          xp: 15,
          exercises: [
            {
              id: 'jx-adj1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Bentuk lampau dari kata sifat さむい (samui = dingin) adalah…',
              options: ['さむかったです', 'さむいでした', 'さむくなかったです', 'さむくないでした'],
              answer: 0,
              explain: 'I-keiyoushi mengubah akhiran -i menjadi -katta: さむい → さむかったです.',
            },
            {
              id: 'jx-adj2',
              type: 'choice',
              skill: 'membaca',
              prompt: 'Bagaimana mengatakan "Kemarin cuacanya bagus"? (Bagus = いい / よい)',
              options: ['きのうは てんきが よかったです', 'きのうは てんきが いいでした', 'きのうは てんきが いかったです', 'きのうは てんきが よいでした'],
              answer: 0,
              explain: 'Kata いい (ii) saat dikonjugasikan berubah menjadi basis よ- : よかったです.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-takai', front: '高い (たかい)', back: 'Tinggi / Mahal (I-keiyoushi)', reading: 'takai', lang: 'jp', tag: 'KataSifat' },
        { id: 'jp-xc-shizuka', front: '静か (しずか)', back: 'Sunyi / Tenang (Na-keiyoushi)', reading: 'shizuka', lang: 'jp', tag: 'KataSifat' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 2 (Tingkat N4 — Kemampuan, Izin & Pasif Kausatif)
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
    {
      id: 'jp-g2-extra-u2',
      title: 'Memberi & Menerima Bantuan: あげる vs くれる vs もらう',
      subtitle: 'Arah perpindahan kebaikan dan sudut pandang psikologis penutur',
      level: 'N4',
      badge: '〜てあげる · 〜てくれる · 〜てもらう',
      notes: [
        {
          kind: 'concept',
          title: 'Arah Aliran Kebaikan (Benefactive)',
          body: '1. 〜てあげる (-te ageru): Penutur memberi kebaikan kepada orang lain (arah keluar).\n2. 〜てくれる (-te kureru): Orang lain memberi kebaikan kepada penutur / pihak penutur (arah masuk).\n3. 〜てもらう (-te morau): Penutur menerima kebaikan setelah meminta / berterima kasih atas bantuan pihak lain.',
        },
      ],
      lessons: [
        {
          id: 'jp-g2-xu2-l1',
          title: 'Menentukan Kata Bantu Memberi-Menerima',
          kind: 'drill',
          xp: 20,
          exercises: [
            {
              id: 'jx-give1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'ともだちが にほんごを おしえて___。 (Teman saya berbaik hati mengajari saya bahasa Jepang)',
              options: ['くれました', 'あげました', 'もらいました', 'やりました'],
              answer: 0,
              explain: 'Ketika orang lain melakukan sesuatu demi kebaikan penutur, kita menggunakan くれました (kureru).',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-kureru', front: '〜てくれる', back: 'Berbaik hati melakukan sesuatu untukku', reading: 'te kureru', lang: 'jp', tag: 'N4' },
        { id: 'jp-xc-morau', front: '〜てもらう', back: 'Menerima bantuan dari seseorang', reading: 'te morau', lang: 'jp', tag: 'N4' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 3 (Tingkat N3 — Transitif/Intransitif, Dugaan & Waktu)
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
    {
      id: 'jp-g3-extra-u2',
      title: 'Modalitas Dugaan & Panca Indra: 〜そうだ vs 〜ようだ vs 〜らしい',
      subtitle: 'Membedakan dugaan visual sekilas, kesimpulan analogi, dan kabar burung dari orang lain',
      level: 'N3',
      badge: 'そうだ · ようだ · らしい',
      notes: [
        {
          kind: 'concept',
          title: 'Peta Mental Tiga Jenis Dugaan',
          body: '1. 〜そうだ (sou da): Dugaan visual sekilas ("kelihatannya akan hujan", "kuenya tampak lezat").\n2. 〜ようだ (you da): Kesimpulan berbasis bukti panca indra menyeluruh ("sepertinya ada orang di dalam rumah karena lampunya menyala").\n3. 〜らしい (rashii): Kabar burung / rumor dari pihak ketiga ("katanya besok ada diskon besar").',
        },
      ],
      lessons: [
        {
          id: 'jp-g3-xu2-l1',
          title: 'Membedakan Nuansa Dugaan N3',
          kind: 'drill',
          xp: 20,
          exercises: [
            {
              id: 'jx-mod1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'あめが ふり___です。 (Melihat awan gelap tebal, tampaknya sebentar lagi akan turun hujan)',
              options: ['そう (dugaan visual sekilas)', 'よう (kesimpulan analogi)', 'らしい (kabar burung)', 'はず (kepastian logis)'],
              answer: 0,
              explain: 'Melihat tanda fisik langsung yang akan terjadi seketika menggunakan 〜そう: ふりそうです.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-souda', front: '〜そうだ', back: 'Tampaknya / kelihatannya (visual sekilas)', reading: 'sō da', lang: 'jp', tag: 'N3' },
        { id: 'jp-xc-rashii', front: '〜らしい', back: 'Kabarnya / katanya (berdasarkan kabar orang)', reading: 'rashii', lang: 'jp', tag: 'N3' },
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
    {
      id: 'jp-g4-extra-u2',
      title: 'Bahasa Berita & Jurnalistik NHK: 〜つつある vs 〜おそれがある',
      subtitle: 'Menyatakan tren perubahan bertahap dan potensi ancaman bahaya dalam wacana publik',
      level: 'N2',
      badge: 'つつある · おそれがある',
      notes: [
        {
          kind: 'concept',
          title: 'Pola Baku Berita & Artikel Ilmiah',
          body: '1. 〜つつある (-tsutsu aru): "Sedang dalam proses berubah secara bertahap" (contoh: 景気は回復しつつある = Perekonomian sedang berangsur pulih).\n2. 〜おそれがある (-osore ga aru): "Dikhawatirkan / ada bahaya bahwa..." (contoh: 台風が上陸するおそれがある = Dikhawatirkan badai topan akan menerjang daratan).',
        },
      ],
      lessons: [
        {
          id: 'jp-g4-xu2-l1',
          title: 'Membaca Tajuk Berita Televisi & Koran',
          kind: 'drill',
          xp: 25,
          exercises: [
            {
              id: 'jx-news1',
              type: 'choice',
              skill: 'membaca',
              prompt: 'おおあめの ため、かわが はんらんする___。 (Akibat hujan lebat, dikhawatirkan sungai akan meluap)',
              options: ['おそれがある (kekhawatiran bahaya)', 'つつある (proses bertahap)', 'にすぎない (hanya sebatas)', 'どころではない (jangankan)'],
              answer: 0,
              explain: 'おそれがある digunakan untuk bahaya atau bencana yang dikhawatirkan akan terjadi.',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-tsutsu', front: '〜つつある', back: 'Sedang berangsur berubah (tren formal)', reading: 'tsutsu aru', lang: 'jp', tag: 'N2' },
        { id: 'jp-xc-osore', front: '〜おそれがある', back: 'Dikhawatirkan / berpotensi bahaya', reading: 'osore ga aru', lang: 'jp', tag: 'N2' },
      ],
    },
  ],

  // -------------------------------------------------------------
  // GERBANG 5 (Tingkat N1 — Keigo Korporat & Retorika Klasik)
  // -------------------------------------------------------------
  5: [
    {
      id: 'jp-g5-extra-u1',
      title: 'Sonkeigo vs Kenjougo Bisnis Tingkat Tertinggi',
      subtitle: 'Seni meninggikan mitra bisnis dan merendahkan pihak sendiri secara natural',
      level: 'N1',
      badge: '敬語 · 尊敬 vs 謙譲',
      notes: [
        {
          kind: 'concept',
          title: 'Prinsip Uchi (Dalam) vs Soto (Luar) dalam Keigo',
          body: 'Ketika berbicara dengan pihak luar (klien/mitra), bos Anda sendiri di kantor dianggap "Uchi" sehingga harus direndahkan dengan Kenjougo, bukan ditinggikan! Contoh: "Shachou no Tanaka wa orimasen" (bukan "irasshaimasen").',
        },
      ],
      lessons: [
        {
          id: 'jp-g5-xu1-l1',
          title: 'Simulasi Percakapan Telepon Bisnis Nyata',
          kind: 'drill',
          xp: 30,
          exercises: [
            {
              id: 'jx11',
              type: 'choice',
              skill: 'berbicara',
              prompt: 'Saat klien menelepon menanyakan keberadaan bos Anda, ucapan mana yang benar?',
              options: [
                'たなかしゃちょうは ただいま がいしゅつして おられます',
                'たなかは ただいま がいしゅつして おります',
                'たなかしゃちょうは ただいま いらっしゃいません',
                'たなかさんは ただいま おでかけです',
              ],
              answer: 1,
              explain: 'Di depan orang luar, kita merendahkan atasan sendiri dengan menyebut nama saja tanpa gelar dan menggunakan kata kerja kenjougo おります (orimasu).',
            },
          ],
        },
      ],
      cards: [
        { id: 'jp-xc-orimasu', front: 'おります', back: 'Bentuk merendah (Kenjougo) dari います', reading: 'orimasu', lang: 'jp', tag: 'N1' },
      ],
    },
    {
      id: 'jp-g5-extra-u2',
      title: 'Ungkapan Klasik & Retorika N1: 〜極まりない vs 〜を禁じ得ない',
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
          id: 'jp-g5-xu1-l2',
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
