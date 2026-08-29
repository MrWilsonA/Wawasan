import type { LangId } from './types'

export type HandbookChapter = {
  id: string
  title: string
  subtitle: string
  icon: string
  content: {
    summary: string
    sections: Array<{
      heading: string
      body: string
      table?: {
        head: string[]
        rows: string[][]
      }
      callout?: {
        kind: 'tip' | 'warning' | 'info'
        title: string
        text: string
      }
    }>
  }
}

export type CountryHandbook = {
  lang: LangId
  title: string
  subtitle: string
  badge: string
  authorNote: string
  chapters: HandbookChapter[]
}

export const LANGUAGE_HANDBOOKS: Record<LangId, CountryHandbook> = {
  jp: {
    lang: 'jp',
    title: 'Buku Panduan Lengkap Bahasa Jepang (日本語大百科)',
    subtitle: 'Kajian mendalam fonologi mora, aksara kanji, tata bahasa partikel, dan etiket keigo dari nol hingga JLPT N1.',
    badge: 'Ensiklopedia Jepang · JLPT N5–N1',
    authorNote: 'Disusun khusus untuk pelajar Indonesia dengan membedah perbedaan struktural antara bahasa Austronesia dan bahasa Japonic.',
    chapters: [
      {
        id: 'jp-c1',
        title: 'Bab 1: Sejarah & Evolusi Bahasa Jepang',
        subtitle: 'Dari era Man’yogana tanpa aksara hingga kelahiran Hiragana & Katakana',
        icon: 'story',
        content: {
          summary: 'Bahasa Jepang kuno (Yamato-kotoba) awalnya tidak memiliki sistem tulisan sendiri sampai aksara Hanzi Cina masuk melalui Semenanjung Korea pada abad ke-5 M.',
          sections: [
            {
              heading: '1.1 Man’yogana: Meminjam Bunyi Aksara Cina',
              body: 'Sebelum Hiragana tercipta, bangsa Jepang meminjam karakter Hanzi Cina hanya untuk merekam bunyi bahasa Jepang tanpa memedulikan artinya (disebut Man’yogana). Karena menulis satu kalimat membutuhkan puluhan karakter rumit, terciptalah dorongan untuk menyederhanakan tulisan.',
            },
            {
              heading: '1.2 Kelahiran Hiragana (Aksara Wanita) & Katakana (Aksara Biksu)',
              body: 'Pada abad ke-9 (Zaman Heian), kaum wanita istana menyederhanakan coretan kursif kanji menjadi Hiragana (dikenal sebagai onnade). Karya sastra legendaris "The Tale of Genji" karya Murasaki Shikibu ditulis dalam Hiragana. Sementara itu, para biksu Buddha mengambil potongan sudut kanji untuk mencatat terjemahan cepat sutra, yang kemudian melahirkan Katakana.',
            },
          ],
        },
      },
      {
        id: 'jp-c2',
        title: 'Bab 2: Fonologi Mora & Aksen Nada (Pitch Accent)',
        subtitle: 'Mengapa satuan ritme Jepang bukan suku kata dan bagaimana intonasi Tokyo bekerja',
        icon: 'sound',
        content: {
          summary: 'Bahasa Jepang dihitung berdasarkan mora (ketukan waktu yang sama panjang), bukan suku kata seperti Bahasa Indonesia.',
          sections: [
            {
              heading: '2.1 Tiga Elemen Satu Mora Penuh',
              body: 'Tiga hal yang wajib dihitung 1 ketukan penuh: ん (hatsuon), っ (sokuon / konsonan ganda), dan vokal panjang (chōon). Memotong mora akan mengubah arti kata secara fatal (contoh: おばさん bibi vs おばあさん nenek).',
              table: {
                head: ['Kata', 'Mora', 'Ketukan', 'Arti'],
                rows: [
                  ['きって', '3 mora', 'Ki - [jeda] - Te', 'Perangko'],
                  ['きて', '2 mora', 'Ki - Te', 'Datanglah'],
                  ['にほん', '3 mora', 'Ni - Ho - N', 'Jepang'],
                ],
              },
            },
            {
              heading: '2.2 Aksen Nada Tokyo (Atamadaka, Nakadaka, Odaka, Heiban)',
              body: 'Bahasa Jepang tidak menggunakan tekanan keras (stress accent) melainkan tinggi-rendah nada (pitch accent). Contoh: はし (HA-shi = sumpit) vs はし (ha-SHI = jembatan) vs はし (ha-shi [datar] = ujung).',
            },
          ],
        },
      },
      {
        id: 'jp-c3',
        title: 'Bab 3: Arsitektur Tata Bahasa SOV & Partikel',
        subtitle: 'Peta mental subjek, topik (は), subjek gramatikal (が), dan partikel penanda fungsi',
        icon: 'formula',
        content: {
          summary: 'Tata bahasa Jepang menaruh predikat di paling akhir (SOV) dan menggunakan partikel sebagai jangkar fungsional setiap kata.',
          sections: [
            {
              heading: '3.1 Perbedaan Abadi: Partikel は (Topik) vs が (Subjek)',
              body: 'Partikel は menandai TOPIK umum ("Soal X, ceritanya begini"), sedangkan partikel が menandai SUBJEK spesifik yang membawa informasi baru atau fokus pembeda ("Siapa yang melakukan? Dialah yang melakukan").',
              callout: {
                kind: 'tip',
                title: 'Rumus Mudah Membedakan は dan が',
                text: 'Jika menjawab pertanyaan "Siapa/Apa?", gunakan が (contoh: だれが きましたか？ たなかさんが きました). Jika melanjutkan obrolan tentang seseorang, gunakan は (たなかさんは せんせいです).',
              },
            },
          ],
        },
      },
      {
        id: 'jp-c4',
        title: 'Bab 4: Etiket Keigo Lengkap (Sonkeigo & Kenjougo)',
        subtitle: 'Prinsip Uchi vs Soto dan seni merendahkan diri demi menghormati rekan bisnis',
        icon: 'profile',
        content: {
          summary: 'Keigo bukan sekadar kesopanan, melainkan penanda batas psikologis antara kelompok dalam (Uchi) dan kelompok luar (Soto).',
          sections: [
            {
              heading: '4.1 Sonkeigo (Meninggikan Mitra) vs Kenjougo (Merendahkan Diri)',
              body: 'Gunakan Sonkeigo untuk aksi mitra bisnis, atasan dari perusahaan lain, atau pelanggan (contoh: いらっしゃる, おっしゃる). Gunakan Kenjougo untuk aksi diri sendiri atau bawahan/rekan satu kantor saat berbicara dengan pihak luar (contoh: おる, 申す, 参る).',
            },
          ],
        },
      },
    ],
  },

  cn: {
    lang: 'cn',
    title: 'Buku Panduan Lengkap Bahasa Mandarin (汉语大百科)',
    subtitle: 'Kajian mendalam fonologi Pinyin, 6 metode Rikusho, tata bahasa analitis, dan sertifikasi HSK 1–9.',
    badge: 'Ensiklopedia Mandarin · HSK 1–9',
    authorNote: 'Membedah logika pembentukan ribuan karakter Hanzi tanpa menghafal buta menggunakan sistem fonosemantik.',
    chapters: [
      {
        id: 'cn-c1',
        title: 'Bab 1: 3.300 Tahun Evolusi Karakter Hanzi',
        subtitle: 'Dari Aksara Tulang Ramalan (Jiaguwen) hingga Hanzi Sederhana 1956',
        icon: 'story',
        content: {
          summary: 'Hanzi adalah salah satu sistem tulisan tertua di dunia yang masih hidup dan digunakan tanpa putus selama lebih dari 3 milenium.',
          sections: [
            {
              heading: '1.1 Aksara Tulang Ramalan (甲骨文 Jiaguwen, 1200 SM)',
              body: 'Ditemukan pertama kali terukir pada cangkang kura-kura dan tulang belikat lembu untuk meramal nasib dinasti Shang. Bentuk awalnya murni piktografik (meniru wujud matahari, bulan, manusia, pohon).',
            },
            {
              heading: '1.2 Penyatuan Aksara Qin Shi Huang & Reformasi Libian (隶变)',
              body: 'Pada tahun 221 SM, Kaisar Pertama Qin menyatukan ribuan variasi aksara daerah menjadi Seal Script. Tak lama setelahnya, juru tulis istana menciptakan Lishu (隶书) dengan meluruskan garis melengkung menjadi garis lurus kuas demi kecepatan administrasi.',
            },
          ],
        },
      },
      {
        id: 'cn-c2',
        title: 'Bab 2: Sistem 6 Metode Rikusho (六书)',
        subtitle: 'Bagaimana 82% karakter Hanzi dibentuk dengan rumus Makna + Bunyi (Xingsheng)',
        icon: 'reference',
        content: {
          summary: 'Buku "Shuowen Jiezi" karya Xu Shen (100 M) mengklasifikasikan seluruh karakter Mandarin ke dalam 6 metode logika.',
          sections: [
            {
              heading: '2.1 形声 (Xingsheng / Fonosemantik) — 82% Populasi Karakter',
              body: 'Setiap karakter fonosemantik terdiri atas dua bagian: Sisi Radikal (memberi petunjuk kategori makna) + Sisi Fonetik (memberi petunjuk cara baca bunyi). Contoh: 湖 (danau) = 氵 (air) + 胡 (dibaca hu).',
            },
          ],
        },
      },
      {
        id: 'cn-c3',
        title: 'Bab 3: Pinyin, Nada Sandhi & Nada Netral (轻声)',
        subtitle: 'Rahasia artikulasi nada ketiga, perubahan nada 不 dan 一, serta akhiran Erhua',
        icon: 'sound',
        content: {
          summary: 'Mandarin adalah bahasa bernada (tonal language) di mana perubahan tinggi nada membedakan arti kata sepenuhnya.',
          sections: [
            {
              heading: '3.1 Aturan Nada Sandhi Wajib',
              body: '• Dua Nada 3 berurutan: Nada pertama otomatis naik menjadi Nada 2 (contoh: 你 nǐ + 好 hǎo → Ní hǎo).\n• Perubahan kata 一 (yī): Menjadi Nada 4 di depan Nada 1/2/3 (yí dìng), menjadi Nada 2 di depan Nada 4 (yí yàng).\n• Perubahan kata 不 (bù): Menjadi Nada 2 di depan Nada 4 (bú shì).',
            },
          ],
        },
      },
    ],
  },

  kr: {
    lang: 'kr',
    title: 'Buku Panduan Lengkap Bahasa Korea (한국어대백과)',
    subtitle: 'Kajian mendalam penemuan Hangeul 1446 oleh Raja Sejong, fonologi batchim, dan tata bahasa TOPIK 1–6.',
    badge: 'Ensiklopedia Korea · TOPIK I–II',
    authorNote: 'Mengupas tuntas mahakarya ilmiah Hangeul dan tata bahasa kehormatan Korea untuk penutur Indonesia.',
    chapters: [
      {
        id: 'kr-c1',
        title: 'Bab 1: Penemuan Hangeul & Dokumen Hunminjeongeum 1446',
        subtitle: 'Kisah Raja Sejong Yang Agung memberantas buta huruf rakyat jelata',
        icon: 'story',
        content: {
          summary: 'Hangeul adalah satu-satunya aksara di dunia yang pencipta, tahun penemuan, dan filosofi teorinya tercatat lengkap dalam sejarah.',
          sections: [
            {
              heading: '1.1 Monopoli Aksara Hanja oleh Elit Bangsawan (Yangban)',
              body: 'Sebelum abad ke-15, rakyat Korea harus mempelajari ribuan karakter Hanja Cina untuk menulis. Karena sangat sulit, hanya bangsawan Yangban yang melek huruf. Rakyat biasa yang tidak bersalah kerap kali dihukum secara tidak adil karena tidak mampu membaca undang-undang.',
            },
            {
              heading: '1.2 Dekrit Hunminjeongeum (훈민정음 — Suara yang Tepat Mengajari Rakyat)',
              body: 'Pada musim dingin 1443, Raja Sejong bersama para cendekiawan istana Jiphyeonjeon menciptakan 28 huruf abjad fonetik yang dirancang sedemikian mudah: "Orang pintar bisa mempelajarinya sebelum pagi usai; orang bodoh bisa memahaminya dalam sepuluh hari".',
            },
          ],
        },
      },
      {
        id: 'kr-c2',
        title: 'Bab 2: Filosofi Kosmologis Cheonjiin (천지인) & Anatomi Vokal',
        subtitle: 'Harmoni Langit (•), Bumi (ㅡ), dan Manusia (ㅣ) serta bentuk organ bicara manusia',
        icon: 'concept',
        content: {
          summary: 'Bentuk huruf vokal dan konsonan Hangeul didasari pada perpaduan kosmologi Asia Timur dan anatomi organ bicara manusia.',
          sections: [
            {
              heading: '2.1 Tiga Elemen Pembentuk Seluruh Vokal',
              body: '• Titik (• / Langit / Yang / Positif / Cerah: ㅏ, ㅗ)\n• Garis Horizontal (ㅡ / Bumi / Yin / Negatif / Gelap: ㅓ, ㅜ)\n• Garis Vertikal (ㅣ / Manusia / Netral / Penyeimbang: ㅣ, ㅐ, ㅔ)',
            },
            {
              heading: '2.2 Konsonan yang Meniru Organ Mulut',
              body: '• ㄱ (G/K): Meniru pangkal lidah yang menutup tenggorokan.\n• ㄴ (N): Meniru ujung lidah yang menyentuh langit-langit gusi atas.\n• ㅁ (M): Meniru bentuk bibir yang menutup.\n• ㅅ (S): Meniru bentuk gigi tajam.\n• ㅇ (Ng): Meniru rongga tenggorokan yang bulat terbuka.',
            },
          ],
        },
      },
      {
        id: 'kr-c3',
        title: 'Bab 3: 7 Hukum Perubahan Bunyi Konsonan Akhir (Batchim)',
        subtitle: 'Nasalisasi, Aserasi, Tensifikasi, Palatalisasi, dan Likuidasi',
        icon: 'sound',
        content: {
          summary: 'Mengapa tulisan 한국어 dibaca [한구거] dan 학교 dibaca [학꾜]? Membedakan ortografi ejaan dan pelafalan lisan.',
          sections: [
            {
              heading: '3.1 Tabel 7 Hukum Batchim Utama',
              body: 'Konsonan akhir mengalami modifikasi akustik agar alur bicara mengalir tanpa hambatan energi lidah.',
              table: {
                head: ['Hukum', 'Rumus Bunyi', 'Tulisan Asli', 'Pelafalan Lisan'],
                rows: [
                  ['Penghubungan (Yeoneum)', 'Batchim + Vokal', '한국어', '[한구거] han-gu-geo'],
                  ['Nasalisasi (Bieumhwa)', 'K/T/P + N/M → Ng/N/M', '국민 / 십년', '[궁민] / [심년]'],
                  ['Tensifikasi (Gyeong-eumhwa)', 'K/T/P + K/T/P/S/J → Ganda', '학교 / 식당', '[학꾜] / [식땅]'],
                  ['Aspirasi (Geo-seunsorihwa)', 'K/T/P/J + H → Kh/Th/Ph/Ch', '좋다 / 축하', '[조타] / [추카]'],
                  ['Palatalisasi (Gugae-eumhwa)', 'ㄷ/ㅌ + ㅣ → ㅈ/ㅊ', '같이 / 굳이', '[가치] / [구지]'],
                ],
              },
            },
          ],
        },
      },
    ],
  },

  en: {
    lang: 'en',
    title: 'Buku Panduan Lengkap Bahasa Inggris (English Master Handbook)',
    subtitle: 'Kajian mendalam evolusi Anglo-Saxon, penaklukan Norman 1066, 12 tenses, dan esai IELTS Band 9.0.',
    badge: 'Ensiklopedia Inggris · CEFR A1–C2 & IELTS',
    authorNote: 'Mengupas struktur logika bahasa Inggris, sistem connected speech, dan strategi menembus skor band tertinggi.',
    chapters: [
      {
        id: 'en-c1',
        title: 'Bab 1: Sejarah Bahasa Inggris — Dari Suku Pulau ke Bahasa Dunia',
        subtitle: 'Tiga gelombang invasi yang menciptakan sistem kosa kata ganda (Jermanik vs Norman-Prancis)',
        icon: 'story',
        content: {
          summary: 'Bahasa Inggris modern adalah hasil percampuran dahsyat antara akar Jermanik Anglo-Saxon dan pengaruh Romawi-Prancis.',
          sections: [
            {
              heading: '1.1 Invasi Suku Jermanik & Pengaruh Viking (450–1066 M)',
              body: 'Suku Angles, Saxons, dan Jutes membawa bahasa Old English. Invasi bangsa Viking Old Norse menyumbang kata ganti penting (they, them, their) serta menyederhanakan akhiran gramatikal kuno yang rumit.',
            },
            {
              heading: '1.2 Penaklukan Norman 1066: Lahirnya Kosa Kata Kasta Ganda',
              body: 'Ketika William the Conqueror menaklukkan Inggris pada 1066, bahasa Prancis Anglo-Norman menjadi bahasa bangsawan istana sementara rakyat jelata tetap berbicara bahasa Inggris Jermanik. Inilah sebabnya bahasa Inggris memiliki dua kata untuk satu konsep yang sama:',
              table: {
                head: ['Kategori', 'Akar Rakyat Jelata (Jermanik)', 'Akar Bangsawan Istana (Prancis/Latin)'],
                rows: [
                  ['Hewan vs Daging Masak', 'Cow (sapi di kandang)', 'Beef (daging di meja makan)'],
                  ['Hewan vs Daging Masak', 'Pig / Swine (babi di lumpur)', 'Pork (hidangan babi istana)'],
                  ['Tanya / Permintaan', 'Ask', 'Inquire / Request'],
                  ['Sifat Kerajaan', 'Kingly', 'Royal / Regal'],
                  ['Kekuatan', 'Might', 'Power'],
                ],
              },
            },
          ],
        },
      },
      {
        id: 'en-c2',
        title: 'Bab 2: The Great Vowel Shift & Misteri Ejaan Inggris',
        subtitle: 'Mengapa huruf "A" dibaca /eɪ/ dan huruf "I" dibaca /aɪ/?',
        icon: 'sound',
        content: {
          summary: 'Antara tahun 1400 dan 1700, posisi lidah untuk seluruh vokal panjang bahasa Inggris terangkat ke atas, sementara mesin cetak Gutenberg membekukan ejaan lama.',
          sections: [
            {
              heading: '2.1 Inkonsistensi Ejaan vs Bunyi Akustik',
              body: 'Sebelum abad ke-15, kata "bite" diucapkan /biːt/ (mirip bunyi Indonesia "bit") dan "mate" diucapkan /maːt/ (mirip "mat"). Pergeseran vokal mengangkat bunyi vokal menjadi diftong (/aɪ/, /eɪ/), sementara ejaannya terlanjur dicetak permanen oleh William Caxton pada 1476.',
            },
          ],
        },
      },
      {
        id: 'en-c3',
        title: 'Bab 3: 12 Tenses Master Matrix & Aspek Waktu',
        subtitle: 'Membedakan Simple, Continuous, Perfect, dan Perfect Continuous tanpa menghafal rumus buta',
        icon: 'formula',
        content: {
          summary: 'Tenses bahasa Inggris adalah kombinasi antara 3 Garis Waktu (Past, Present, Future) dengan 4 Sudut Pandang Aspek (Simple, Continuous, Perfect, Perfect Continuous).',
          sections: [
            {
              heading: '3.1 Matriks 12 Tenses',
              body: 'Setiap tenses merepresentasikan relasi waktu kejadian terhadap saat pembicaraan.',
              table: {
                head: ['Aspek', 'Past (Lampau)', 'Present (Sekarang)', 'Future (Masa Depan)'],
                rows: [
                  ['Simple (Fakta/Rutinitas)', 'I worked', 'I work', 'I will work'],
                  ['Continuous (Sedang Berlangsung)', 'I was working', 'I am working', 'I will be working'],
                  ['Perfect (Sudah Selesai & Berdampak)', 'I had worked', 'I have worked', 'I will have worked'],
                  ['Perfect Continuous (Durasi Hingga Titik X)', 'I had been working', 'I have been working', 'I will have been working'],
                ],
              },
            },
          ],
        },
      },
    ],
  },
}
