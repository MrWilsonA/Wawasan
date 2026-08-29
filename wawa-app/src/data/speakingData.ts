import type { LangId } from './types'

export type SpeakingPhrase = {
  id: string
  title: string
  scenario: string
  targetText: string
  romanization: string
  phoneticGuide: string
  translation: string
  toneGuide?: string
  voice: string
  difficulty: 'pemula' | 'menengah' | 'mahir'
  tips: string
}

export type SpeakingDialogue = {
  id: string
  title: string
  context: string
  turns: {
    speaker: 'wawa' | 'user'
    text: string
    reading: string
    translation: string
    prompt?: string
  }[]
}

export type SpeakingLevel = {
  id: string
  name: string
  badge: string
  desc: string
  phrases: SpeakingPhrase[]
  dialogues: SpeakingDialogue[]
}

export const SPEAKING_DATA: Record<LangId, SpeakingLevel[]> = {
  // =========================================================================
  // JAPANESE SPEAKING SUITE
  // =========================================================================
  jp: [
    {
      id: 'n5',
      name: 'JLPT N5 · Fondasi Ucapan & Sapaan',
      badge: 'N5 Pemula',
      desc: 'Melatih pelafalan vokal murni Jepang, panjang pendek mora, dan sapaan alami.',
      phrases: [
        {
          id: 'jp-spk-n5-1',
          title: 'Perkenalan Diri (Jikoshoukai)',
          scenario: 'Menyapa dan memperkenalkan nama kepada rekan baru.',
          targetText: 'はじめまして。どうぞよろしくお願いします。',
          romanization: 'Hajimemashite. Dōzo yoroshiku onegai shimasu.',
          phoneticGuide: 'Ha-ji-me-ma-shi-te. Dō-zo yo-ro-shi-ku o-ne-gai shi-ma-su.',
          translation: 'Senang berkenalan dengan Anda. Mohon bimbingan dan kerja samanya.',
          toneGuide: 'Pitch accent: Dōzo (pola atamadaka, nada turun di dō)',
          voice: 'ja-JP',
          difficulty: 'pemula',
          tips: 'Pastikan "dōzo" diucapkan 2 ketukan mora (d-o-o-z-o), jangan disingkat menjadi "dozo".',
        },
        {
          id: 'jp-spk-n5-2',
          title: 'Memesan Makanan di Restoran',
          scenario: 'Memesan ramen dan air putih kepada pelayan.',
          targetText: 'すみません、ラーメンを一つとお水をください。',
          romanization: 'Sumimasen, rāmen o hitotsu to omizu o kudasai.',
          phoneticGuide: 'Su-mi-ma-sen, rā-men o hi-to-tsu to o-mi-zu o ku-da-sai.',
          translation: 'Permisi, tolong satu ramen dan air putihnya.',
          voice: 'ja-JP',
          difficulty: 'pemula',
          tips: 'Partikel "o" dilafalkan lembut seperti vokal /o/ murni tanpa desis.',
        },
        {
          id: 'jp-spk-n5-3',
          title: 'Menanyakan Harga Barang',
          scenario: 'Menanyakan harga suvenir di toko Tokyo.',
          targetText: 'これはいくらですか。',
          romanization: 'Kore wa ikura desu ka?',
          phoneticGuide: 'Ko-re wa i-ku-ra de-su ka?',
          translation: 'Berapa harga barang ini?',
          voice: 'ja-JP',
          difficulty: 'pemula',
          tips: 'Intonasi di ujung kata "ka" dinaikkan sedikit untuk menandai kalimat tanya.',
        },
        {
          id: 'jp-spk-n5-4',
          title: 'Meminta Bantuan di Stasiun',
          scenario: 'Bertanya jalur kereta menuju Shibuya kepada petugas.',
          targetText: '渋谷へ行く電車はどれですか。',
          romanization: 'Shibuya e iku densha wa dore desu ka?',
          phoneticGuide: 'Shi-bu-ya e i-ku den-sha wa do-re de-su ka?',
          translation: 'Kereta yang menuju Shibuya yang mana ya?',
          voice: 'ja-JP',
          difficulty: 'pemula',
          tips: 'Partikel へ ditulis "he" tetapi wajib dilafalkan sebagai "e".',
        },
      ],
      dialogues: [
        {
          id: 'jp-dia-n5-1',
          title: 'Percakapan di Konbini (Toserba 24 Jam)',
          context: 'Membeli bento di minimarket dan meminta dihangatkan.',
          turns: [
            { speaker: 'wawa', text: 'いらっしゃいませ！お弁当温めますか。', reading: 'Irasshaimase! Obentō atatamemasu ka?', translation: 'Selamat datang! Mau dibantu hangatkan bentonya?' },
            { speaker: 'user', text: 'はい、お願いします。', reading: 'Hai, onegai shimasu.', translation: 'Ya, tolong ya.', prompt: 'Katakan "Hai, onegai shimasu" dengan sopan.' },
            { speaker: 'wawa', text: 'かしこまりました。袋はご利用ですか。', reading: 'Kashikomarimashita. Fukuro wa go-riyō desu ka?', translation: 'Baik. Apakah butuh kantong plastik?' },
            { speaker: 'user', text: 'いいえ、大丈夫です。', reading: 'Iie, daijōbu desu.', translation: 'Tidak usah, tidak apa-apa.', prompt: 'Katakan "Iie, daijōbu desu" untuk menolak kantong plastik.' },
          ],
        },
      ],
    },
    {
      id: 'n4',
      name: 'JLPT N4 · Komunikasi Situasional',
      badge: 'N4 Menengah Awal',
      desc: 'Melatih kemampuan bertanya izin, menyampaikan alasan, dan ungkapan terima kasih.',
      phrases: [
        {
          id: 'jp-spk-n4-1',
          title: 'Meminta Izin Memotret',
          scenario: 'Meminta izin sebelum mengambil foto di galeri pameran.',
          targetText: 'ここで写真を撮ってもいいですか。',
          romanization: 'Koko de shashin o totte mo ii desu ka?',
          phoneticGuide: 'Ko-ko de sha-shin o tot-te mo ii de-su ka?',
          translation: 'Bolehkah saya mengambil foto di sini?',
          voice: 'ja-JP',
          difficulty: 'menengah',
          tips: 'Bentuk 〜てもいいですか adalah pola baku yang sangat sopan untuk meminta izin.',
        },
      ],
      dialogues: [],
    },
    {
      id: 'n3',
      name: 'JLPT N3 · Percakapan Kasual & Kantor',
      badge: 'N3 Menengah',
      desc: 'Melatih kelancaran ritme percakapan kantor dan penghubung kalimat alami.',
      phrases: [
        {
          id: 'jp-spk-n3-1',
          title: 'Meminta Izin Pulang Lebih Dulu',
          scenario: 'Pamit pulang lebih awal kepada atasan dan rekan kantor.',
          targetText: 'お先に失礼します。明日もよろしくお願いします。',
          romanization: 'Osaki ni shitsurei shimasu. Ashita mo yoroshiku onegai shimasu.',
          phoneticGuide: 'O-sa-ki ni shi-tsu-rei shi-ma-su. A-shi-ta mo yo-ro-shi-ku o-ne-gai shi-ma-su.',
          translation: 'Saya permisi pulang duluan ya. Sampai jumpa besok lagi.',
          voice: 'ja-JP',
          difficulty: 'menengah',
          tips: 'Kombinasi wajib etika kerja Jepang saat meninggalkan meja kantor.',
        },
      ],
      dialogues: [],
    },
    {
      id: 'n1',
      name: 'JLPT N1 · Bahasa Keigo & Presentasi Bisnis',
      badge: 'N1 Mahir / Fasih',
      desc: 'Tingkat kesopanan sonkeigo/kenjougo dan argumentasi bisnis formal.',
      phrases: [
        {
          id: 'jp-spk-n1-1',
          title: 'Presentasi Solusi Kemitraan',
          scenario: 'Menyampaikan usulan strategis kepada dewan direksi klien.',
          targetText: '弊社の新システムをご導入いただくことで、業務効率の大幅な改善が見込まれます。',
          romanization: 'Heisha no shin shisutemu o go-dōnyū itadaku koto de, gyōmu kōritsu no ōhaba na kaizen ga mikomaremasu.',
          phoneticGuide: 'Hei-sha no shin shi-su-te-mu o go-dō-nyū i-ta-da-ku ko-to de, gyō-mu kō-ri-tsu no ō-ha-ba na kai-zen ga mi-ko-ma-re-ma-su.',
          translation: 'Dengan mengadopsi sistem baru dari perusahaan kami, efisiensi operasional diperkirakan akan meningkat secara signifikan.',
          voice: 'ja-JP',
          difficulty: 'mahir',
          tips: 'Gunakan "heisha" (bentuk rendah hati untuk perusahaan kita) dan "go-dōnyū itadaku" (bentuk hormat untuk klien).',
        },
      ],
      dialogues: [],
    },
  ],

  // =========================================================================
  // MANDARIN SPEAKING SUITE
  // =========================================================================
  cn: [
    {
      id: 'hsk1',
      name: 'HSK 1 · Fondasi 4 Nada & Sapaan',
      badge: 'HSK 1 Pemula',
      desc: 'Melatih kejelasan 4 nada Mandarin (shēngdiào), vokal pinyin, dan kalimat sehari-hari.',
      phrases: [
        {
          id: 'cn-spk-hsk1-1',
          title: 'Sapaan & Menanyakan Kabar',
          scenario: 'Menyapa teman lama saat berpapasan.',
          targetText: '你好！最近怎么样？',
          romanization: 'Nǐ hǎo! Zuìjìn zěnmeyàng?',
          phoneticGuide: 'Nǐ (nada 3) hǎo (nada 3 → berubah jadi nada 2)! Zuì-jìn zěn-me-yàng?',
          translation: 'Halo! Akhir-akhir ini bagaimana kabarmu?',
          toneGuide: 'Aturan perubahan nada: Ketika dua nada ke-3 bertemu (Nǐ + hǎo), kata pertama dibaca menjadi nada ke-2 (Ní hǎo).',
          voice: 'zh-CN',
          difficulty: 'pemula',
          tips: 'Lafalkan "zěn-me-yàng" dengan nada netral di suku kata tengah (me).',
        },
        {
          id: 'cn-spk-hsk1-2',
          title: 'Mengucapkan Terima Kasih & Sama-Sama',
          scenario: 'Merespons bantuan orang lain dengan sopan.',
          targetText: '太谢谢你了！……不客气。',
          romanization: 'Tài xièxie nǐ le! ... Bú kèqi.',
          phoneticGuide: 'Tài xiè-xie nǐ le! ... Bú kè-qi.',
          translation: 'Terima kasih banyak ya! ... Sama-sama.',
          voice: 'zh-CN',
          difficulty: 'pemula',
          tips: 'Pada kata "bú kèqi", huruf 不 berubah menjadi nada ke-2 (bú) karena diikuti kata bernada ke-4 (kè).',
        },
      ],
      dialogues: [
        {
          id: 'cn-dia-hsk1-1',
          title: 'Membeli Minuman Bubble Tea',
          context: 'Memesan teh susu boba di kedai teh Shanghai.',
          turns: [
            { speaker: 'wawa', text: '您好，想喝点什么？', reading: 'Nín hǎo, xiǎng hē diǎn shénme?', translation: 'Halo, mau minum apa?' },
            { speaker: 'user', text: '我要一杯珍珠奶茶，少糖。', reading: 'Wǒ yào yì bēi zhēnzhū nǎichá, shǎo táng.', translation: 'Saya mau satu gelas pearl milk tea, gulanya sedikit.', prompt: 'Katakan pesananmu dengan jelas: "Wǒ yào yì bēi zhēnzhū nǎichá, shǎo táng."' },
            { speaker: 'wawa', text: '好的，加冰吗？', reading: 'Hǎode, jiā bīng ma?', translation: 'Baik, mau pakai es?' },
            { speaker: 'user', text: '去冰，谢谢。', reading: 'Qù bīng, xièxie.', translation: 'Tanpa es (no ice), terima kasih.', prompt: 'Katakan "Qù bīng, xièxie."' },
          ],
        },
      ],
    },
  ],

  // =========================================================================
  // KOREAN SPEAKING SUITE
  // =========================================================================
  kr: [
    {
      id: 'topik1',
      name: 'TOPIK I (Level 1) · Pelafalan Hangeul & Sapaan',
      badge: 'Level 1',
      desc: 'Melatih ritme intonasi bahasa Korea, bentuk kesopanan 해요체, dan sapaan sehari-hari.',
      phrases: [
        {
          id: 'kr-spk-topik1-1',
          title: 'Sapaan Sopan Sehari-Hari',
          scenario: 'Menyapa rekan kerja di pagi hari.',
          targetText: '안녕하세요! 좋은 아침이에요.',
          romanization: 'Annyeonghaseyo! Joeun achim-ieyo.',
          phoneticGuide: 'An-nyeong-ha-se-yo! Jo-eun a-chim-i-e-yo.',
          translation: 'Halo! Selamat pagi.',
          voice: 'ko-KR',
          difficulty: 'pemula',
          tips: 'Kata "좋은" dibaca [조은] karena batchim ㅎ melebur di depan vokal 은.',
        },
        {
          id: 'kr-spk-topik1-2',
          title: 'Meminta Tolong di Restoran',
          scenario: 'Meminta air minum tambahan di restoran Korea.',
          targetText: '여기 물 좀 더 주세요.',
          romanization: 'Yeogi mul jom deo juseyo.',
          phoneticGuide: 'Yeo-gi mul jom deo ju-se-yo.',
          translation: 'Permisi, tolong minta air lagi ya di sini.',
          voice: 'ko-KR',
          difficulty: 'pemula',
          tips: 'Kata "좀" (jom) berfungsi melembutkan permintaan agar terdengar ramah dan santun.',
        },
      ],
      dialogues: [],
    },
  ],

  // =========================================================================
  // ENGLISH SPEAKING SUITE
  // =========================================================================
  en: [
    {
      id: 'a1',
      name: 'CEFR A1 · Natural Introductions & Cafe Orders',
      badge: 'A1 Starter',
      desc: 'Master basic connected speech, polite ordering, and clear self-introductions.',
      phrases: [
        {
          id: 'en-spk-a1-1',
          title: 'Polite Cafe Ordering',
          scenario: 'Ordering a flat white and pastry at a London coffee shop.',
          targetText: 'Could I please get a flat white with oat milk, and a croissant?',
          romanization: 'Could I please get a flat white with oat milk, and a croissant?',
          phoneticGuide: '/kʊd aɪ pliːz ɡet ə flæt waɪt wɪð əʊt mɪlk, ænd ə kwʌsɒ̃/',
          translation: 'Bisakah saya pesan flat white dengan susu oat, dan satu croissant?',
          voice: 'en-GB',
          difficulty: 'pemula',
          tips: 'Link "Could I" smoothly into /kʊ-daɪ/ rather than pausing between the words.',
        },
      ],
      dialogues: [],
    },
  ],
}
