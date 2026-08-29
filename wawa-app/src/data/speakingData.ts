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
          phoneticGuide: 'Ha-ji-me-ma-shite. Dō-zo yo-ro-shi-ku o-ne-gai shi-ma-su.',
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
      ],
      dialogues: [
        {
          id: 'jp-dia-n5-1',
          title: 'Percakapan di Konbini',
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
          phoneticGuide: 'Nǐ (nada 3) hǎo (nada 3 → berubah jadi nada 2)! Zuìjìn zěn-me-yàng?',
          translation: 'Halo! Akhir-akhir ini bagaimana kabarmu?',
          toneGuide: 'Aturan perubahan nada: Ketika dua nada ke-3 bertemu (Nǐ + hǎo), kata pertama dibaca menjadi nada ke-2 (Ní hǎo).',
          voice: 'zh-CN',
          difficulty: 'pemula',
          tips: 'Lafalkan "Nǐ hǎo" sebagai "Ní hǎo" agar terdengar luwes seperti penutur asli.',
        },
        {
          id: 'cn-spk-hsk1-2',
          title: 'Ungkapan Terima Kasih Sopan',
          scenario: 'Mengucapkan terima kasih atas bantuan seseorang.',
          targetText: '太谢谢你了，不客气！',
          romanization: 'Tài xièxie nǐ le, bú kèqi!',
          phoneticGuide: 'Tài (nada 4) xiè-xie (nada 4 + netral) nǐ le, bú kè-qi!',
          translation: 'Terima kasih banyak ya! Sama-sama!',
          voice: 'zh-CN',
          difficulty: 'pemula',
          tips: 'Kata "bù" berubah menjadi nada ke-2 ("bú") saat bertemu suku kata nada ke-4 ("kè").',
        },
      ],
      dialogues: [
        {
          id: 'cn-dia-hsk1-1',
          title: 'Membeli Buah di Pasar',
          context: 'Menanyakan harga buah apel dan menawar ramah.',
          turns: [
            { speaker: 'wawa', text: '你好！买什么苹果？', reading: 'Nǐ hǎo! Mǎi shénme píngguǒ?', translation: 'Halo! Mau beli apel jenis apa?' },
            { speaker: 'user', text: '这个苹果一斤多少钱？', reading: 'Zhè ge píngguǒ yì jīn duōshao qián?', translation: 'Apel ini satu kati berapa harganya?', prompt: 'Katakan "Zhè ge píngguǒ yì jīn duōshao qián?"' },
            { speaker: 'wawa', text: '十块钱一斤，很甜的！', reading: 'Shí kuài qián yì jīn, hěn tián de!', translation: 'Sepuluh yuan satu kati, manis sekali!' },
            { speaker: 'user', text: '太好了，给我两斤吧。', reading: 'Tài hǎo le, gěi wǒ liǎng jīn ba.', translation: 'Bagus sekali, tolong beri saya dua kati ya.', prompt: 'Katakan "Tài hǎo le, gěi wǒ liǎng jīn ba."' },
          ],
        },
      ],
    },
    {
      id: 'hsk3',
      name: 'HSK 3 · Diskusi Topik Harian & Perjalanan',
      badge: 'HSK 3 Menengah',
      desc: 'Melatih intonasi penghubung klausa (suīrán... dànshì) dan kelancaran bercerita.',
      phrases: [
        {
          id: 'cn-spk-hsk3-1',
          title: 'Menceritakan Rencana Liburan',
          scenario: 'Membagikan rencana bepergian ke Shanghai saat musim gugur.',
          targetText: '虽然工作很忙，但我打算秋天去上海旅游。',
          romanization: 'Suīrán gōngzuò hěn máng, dàn wǒ dǎsuàn qiūtiān qù Shànghǎi lǚyóu.',
          phoneticGuide: 'Suī-rán gōng-zuò hěn máng, dàn wǒ dǎ-suàn qiū-tiān qù Shàng-hǎi lǚ-yóu.',
          translation: 'Meskipun pekerjaan sangat sibuk, saya berencana pergi berwisata ke Shanghai saat musim gugur.',
          voice: 'zh-CN',
          difficulty: 'menengah',
          tips: 'Beri jeda lembut setelah koma untuk menjaga ritme nafas yang tenang.',
        },
      ],
      dialogues: [],
    },
    {
      id: 'hsk6',
      name: 'HSK 6 · Orasi & Ekspresi Idiomatik (Chengyu)',
      badge: 'HSK 6 Mahir / Fasih',
      desc: 'Melatih artikulasi cepat pada peribahasa 4 karakter dan retorika formal.',
      phrases: [
        {
          id: 'cn-spk-hsk6-1',
          title: 'Menggunakan Idiom Chengyu',
          scenario: 'Menyampaikan filosofi ketekunan jangka panjang dalam pidato.',
          targetText: '千里之行，始于足下；只要持之以恒，终将取得成功。',
          romanization: 'Qiānlǐ zhī xíng, shǐ yú zú xià; zhǐyào chí zhī yǐ héng, zhōng jiāng qǔdé chénggōng.',
          phoneticGuide: 'Qiān-lǐ zhī xíng, shǐ yú zú xià; zhǐ-yào chí zhī yǐ héng, zhōng jiāng qǔ-dé chéng-gōng.',
          translation: 'Perjalanan ribuan li bermula dari langkah pertama di bawah kaki; asalkan tekun tanpa henti, pada akhirnya pasti meraih kesuksesan.',
          voice: 'zh-CN',
          difficulty: 'mahir',
          tips: 'Lafalkan idiom dengan tempo mantap dan tegas pada suku kata terakhir "héng" dan "gōng".',
        },
      ],
      dialogues: [],
    },
  ],

  kr: [
    {
      id: 'topik1',
      name: 'TOPIK I Lv 1 · Pengucapan Hangul & Partikel',
      badge: 'TOPIK 1 Pemula',
      desc: 'Melatih bunyi vokal ganda, konsonan akhir (batchim), dan akhiran sopan -eyo.',
      phrases: [
        {
          id: 'kr-spk-topik1-1',
          title: 'Salam & Perkenalan Diri',
          scenario: 'Menyapa dan memperkenalkan diri dalam bahasa Korea.',
          targetText: '안녕하세요? 저는 인도네시아 사람이에요.',
          romanization: 'Annyeonghaseyo? Jeoneun Indoneshia saram-ieyo.',
          phoneticGuide: 'An-nyeong-ha-se-yo? Jeo-neun In-do-ne-si-a sa-ram-i-e-yo.',
          translation: 'Halo, apa kabar? Saya adalah orang Indonesia.',
          voice: 'ko-KR',
          difficulty: 'pemula',
          tips: 'Lafalkan "saram-ieyo" dengan menyambung konsonan m ke vokal i (/sarami-eyo/).',
        },
        {
          id: 'kr-spk-topik1-2',
          title: 'Meminta Tolong di Restoran',
          scenario: 'Meminta air minum tambahan di kedai makanan.',
          targetText: '여기 물 좀 더 주세요. 감사합니다!',
          romanization: 'Yeogi mul jom deo juseyo. Gamsahamnida!',
          phoneticGuide: 'Yeo-gi mul jom deo ju-se-yo. Gam-sa-ham-ni-da!',
          translation: 'Tolong tambahkan air minum di sini ya. Terima kasih!',
          voice: 'ko-KR',
          difficulty: 'pemula',
          tips: 'Kata "mul" memiliki batchim /l/ yang diartikulasikan dengan lidah menempel di langit-langit mulut.',
        },
      ],
      dialogues: [
        {
          id: 'kr-dia-topik1-1',
          title: 'Percakapan Belanja di Myeongdong',
          context: 'Menanyakan harga masker kosmetik.',
          turns: [
            { speaker: 'wawa', text: '어서 오세요! 찾으시는 거 있으세요?', reading: 'Eoseo oseyo! Chajeusineun geo isseuseyo?', translation: 'Selamat datang! Ada barang yang sedang dicari?' },
            { speaker: 'user', text: '이 마스크팩 얼마예요?', reading: 'I maseukeupaek eolmayeyo?', translation: 'Berapa harga masker wajah ini?', prompt: 'Katakan "I maseukeupaek eolmayeyo?"' },
            { speaker: 'wawa', text: '하나에 천 원이에요. 열 개 사면 두 개 더 드려요!', reading: 'Hana-e cheon won-ieyo. Yeol gae samyeon du gae deo deuryeoyo!', translation: 'Satunya 1.000 won. Beli 10 dapat bonus 2!' },
            { speaker: 'user', text: '네, 열 개 주세요.', reading: 'Ne, yeol gae juseyo.', translation: 'Baik, tolong berikan 10 buah ya.', prompt: 'Katakan "Ne, yeol gae juseyo."' },
          ],
        },
      ],
    },
    {
      id: 'topik4',
      name: 'TOPIK II Lv 4 · Diskusi & Pendapat Terstruktur',
      badge: 'TOPIK 4 Menengah',
      desc: 'Melatih bentuk formal -seumnida / -neun geot gat-eumnida dalam menyatakan pandangan.',
      phrases: [
        {
          id: 'kr-spk-topik4-1',
          title: 'Menyampaikan Opini Proyek',
          scenario: 'Memberikan pendapat profesional dalam diskusi tim.',
          targetText: '제 생각에는 이번 기획이 시장 트렌드에 잘 맞는 것 같습니다.',
          romanization: 'Je saenggak-eneun ibeon gihoeg-i sijang teurendeu-e jal matneun geot gatseumnida.',
          phoneticGuide: 'Je saeng-ga-ge-neun i-beon gi-hoe-gi si-jang teu-ren-deu-e jal man-neun geot gat-seum-ni-da.',
          translation: 'Menurut pendapat saya, perencanaan kali ini tampaknya sangat sesuai dengan tren pasar.',
          voice: 'ko-KR',
          difficulty: 'menengah',
          tips: 'Pola "-neun geot gatseumnida" adalah cara paling elegan dan sopan untuk menyatakan pendapat pribadi di Korea.',
        },
      ],
      dialogues: [],
    },
    {
      id: 'topik6',
      name: 'TOPIK II Lv 6 · Debat Akademik & Kefasihan Native',
      badge: 'TOPIK 6 Mahir / Fasih',
      desc: 'Pengucapan berwibawa pada forum seminar dan orasi formal.',
      phrases: [
        {
          id: 'kr-spk-topik6-1',
          title: 'Sambutan Seminar Budaya',
          scenario: 'Membuka seminar internasional mengenai pertukaran budaya Asia.',
          targetText: '문화적 다양성을 존중하는 바탕 위에서만 진정한 인류의 공존과 번영이 가능합니다.',
          romanization: 'Munhwajeok dayangseong-eul jonjunghaneun batang wie-seoman jinjeonghan inryu-ui gongjon-gwa beon-yeong-i ganeunghamnida.',
          phoneticGuide: 'Mun-hwa-jeok da-yang-seong-eul jon-jung-ha-neun ba-tang wi-e-seo-man jin-jeong-han in-nyu-ui gong-jon-gwa beon-yeong-i ga-neung-ham-ni-da.',
          translation: 'Hanya di atas fondasi penghormatan terhadap keberagaman budayalah, koeksistensi dan kemakmuran sejati umat manusia dapat terwujud.',
          voice: 'ko-KR',
          difficulty: 'mahir',
          tips: 'Pastikan asimilasi fonetik pada "inryu" dilafalkan mulus menjadi /in-nyu/.',
        },
      ],
      dialogues: [],
    },
  ],

  en: [
    {
      id: 'a1',
      name: 'CEFR A1 · Pronunciation Foundation & Connected Speech',
      badge: 'A1 Pemula',
      desc: 'Melatih linking sound, intonasi sapaan, dan pemesanan sederhana.',
      phrases: [
        {
          id: 'en-spk-a1-1',
          title: 'Ordering Coffee and Snack',
          scenario: 'Politely ordering a flat white coffee at a London cafe.',
          targetText: 'Could I please have a flat white and a warm croissant?',
          romanization: 'Could I please have a flat white and a warm croissant?',
          phoneticGuide: '/kʊd aɪ pliːz hæv ə flæt waɪt ənd ə wɔːm kwæˈsɒ̃/',
          translation: 'Bisakah saya pesan kopi flat white dan satu croissant hangat?',
          voice: 'en-GB',
          difficulty: 'pemula',
          tips: 'Link "could" and "I" smoothly: /kʊ-daɪ/.',
        },
        {
          id: 'en-spk-a1-2',
          title: 'Introducing Your Profession',
          scenario: 'Meeting colleagues at an international meetup.',
          targetText: 'Hi everyone, I am a software designer based in Jakarta.',
          romanization: 'Hi everyone, I am a software designer based in Jakarta.',
          phoneticGuide: '/haɪ ˈevriwʌn, aɪ æm ə ˈsɒftweə dɪˈzaɪnə beɪst ɪn dʒəˈkɑːtə/',
          translation: 'Halo semuanya, saya seorang desainer perangkat lunak yang berdomisili di Jakarta.',
          voice: 'en-GB',
          difficulty: 'pemula',
          tips: 'Sentence stress goes on key content words: "software designer" and "Jakarta".',
        },
      ],
      dialogues: [
        {
          id: 'en-dia-a1-1',
          title: 'Hotel Check-in Dialogue',
          context: 'Checking into a hotel room in London.',
          turns: [
            { speaker: 'wawa', text: 'Good afternoon! Welcome to the Royal Garden Hotel. Do you have a reservation?', reading: 'Good afternoon! Welcome...', translation: 'Selamat siang! Selamat datang di Royal Garden Hotel. Apakah ada reservasi?' },
            { speaker: 'user', text: 'Yes, I booked a double room under the name of Wilson.', reading: 'Yes, I booked a double room under the name of Wilson.', translation: 'Ya, saya memesan kamar double atas nama Wilson.', prompt: 'Say "Yes, I booked a double room under the name of Wilson."' },
            { speaker: 'wawa', text: 'Splendid! May I please have your passport for registration?', reading: 'Splendid! May I please have your passport...', translation: 'Bagus sekali! Boleh saya pinjam paspor Anda untuk registrasi?' },
            { speaker: 'user', text: 'Here is my passport, thank you very much.', reading: 'Here is my passport, thank you very much.', translation: 'Ini paspor saya, terima kasih banyak.', prompt: 'Say "Here is my passport, thank you very much."' },
          ],
        },
      ],
    },
    {
      id: 'b2',
      name: 'CEFR B2 · Academic Pitch & Professional Workplace',
      badge: 'B2 Lanjutan',
      desc: 'Melatih intonasi presentasi, phrasing argumen, dan IELTS Speaking Part 2.',
      phrases: [
        {
          id: 'en-spk-b2-1',
          title: 'Delivering a Business Pitch',
          scenario: 'Presenting a new product value proposition to investors.',
          targetText: 'Our primary objective is to significantly reduce customer churn by streamlining the onboarding workflow.',
          romanization: 'Our primary objective is to significantly reduce customer churn by streamlining the onboarding workflow.',
          phoneticGuide: '/aʊə ˈpraɪməri əbˈdʒektɪv ɪz tuː sɪɡˈnɪfɪkəntli rɪˈdjuːs ˈkʌstəmə tʃɜːn baɪ ˈstriːmlaɪnɪŋ ði ˈɒnbɔːdɪŋ ˈwɜːkfləʊ/',
          translation: 'Tujuan utama kami adalah secara signifikan memangkas kehilangan pelanggan dengan merampingkan alur orientasi pengguna.',
          voice: 'en-GB',
          difficulty: 'menengah',
          tips: 'Emphasize "primary objective", "significantly reduce", and "streamlining".',
        },
      ],
      dialogues: [],
    },
    {
      id: 'c2',
      name: 'CEFR C2 · Native Rhetoric & Nuanced Articulation',
      badge: 'C2 Fasih / Native',
      desc: 'Melatih orasi publik yang berbobot dan artikulasi ide filosofis abstrak.',
      phrases: [
        {
          id: 'en-spk-c2-1',
          title: 'Keynote Address on Ethics in AI',
          scenario: 'Delivering an opening address at an international symposium.',
          targetText: 'Technological progress must never outpace our collective ethical responsibility to safeguard human agency and dignity.',
          romanization: 'Technological progress must never outpace our collective ethical responsibility to safeguard human agency and dignity.',
          phoneticGuide: '/ˌteknəˈlɒdʒɪkl ˈprəʊɡres mʌst ˈnevə ˌaʊtˈpeɪs ˈaʊə kəˈlektɪv ˈeθɪkl rɪˌspɒnsəˈbɪləti tuː ˈseɪfɡɑːd ˈhjuːmən ˈeɪdʒənsi ənd ˈdɪɡnəti/',
          translation: 'Kemajuan teknologi tidak boleh melampaui tanggung jawab etis kolektif kita untuk menjaga kehendak bebas dan martabat manusia.',
          voice: 'en-GB',
          difficulty: 'mahir',
          tips: 'Deliver with steady pauses before "ethical responsibility" and "human agency and dignity".',
        },
      ],
      dialogues: [],
    },
  ],
}
