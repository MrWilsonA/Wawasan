import type { LangId } from './types'

export type ListeningQuestion = {
  id: string
  title: string
  scenario: string
  text: string
  reading: string
  translation: string
  prompt: string
  options: string[]
  answer: number
  voice: string
  speed?: number
  explanation: string
  keyVocab: { word: string; meaning: string }[]
}

export type ListeningLevel = {
  id: string
  name: string
  badge: string
  desc: string
  questions: ListeningQuestion[]
}

export const LISTENING_DATA: Record<LangId, ListeningLevel[]> = {
  // =========================================================================
  // JAPANESE LISTENING SUITE (N5 s.d. N1)
  // =========================================================================
  jp: [
    {
      id: 'n5',
      name: 'JLPT N5 · Fondasi Pemula',
      badge: 'N5 Dasar',
      desc: 'Kosakata harian, angka, jam, petunjuk arah stasiun, dan percakapan sederhana.',
      questions: [
        {
          id: 'jp-n5-1',
          title: 'Bertanya Stasiun Terdekat',
          scenario: 'Seorang turis bertanya arah kepada petugas di pinggir jalan.',
          text: 'すみません、一番近い地下鉄の駅はどこですか。',
          reading: 'Sumimasen, ichiban chikai chikatetsu no eki wa doko desu ka?',
          translation: 'Permisi, stasiun kereta bawah tanah terdekat ada di mana ya?',
          prompt: 'Apa yang sedang dicari oleh pembicara pada audio?',
          options: ['Stasiun kereta bawah tanah terdekat', 'Toko serba ada 24 jam', 'Pemberhentian bus bandara', 'Kedutaan besar terdekat'],
          answer: 0,
          voice: 'ja-JP',
          explanation: 'Frasa "chikatetsu no eki" (地下鉄の駅) berarti stasiun kereta bawah tanah, dan "ichiban chikai" (一番近い) berarti paling dekat.',
          keyVocab: [
            { word: '地下鉄 (chikatetsu)', meaning: 'kereta bawah tanah' },
            { word: '駅 (eki)', meaning: 'stasiun' },
            { word: '一番近い (ichiban chikai)', meaning: 'paling dekat' },
          ],
        },
        {
          id: 'jp-n5-2',
          title: 'Janji Bangun Pagi',
          scenario: 'Dua orang teman sedang membicarakan jadwal keberangkatan besok.',
          text: '明日は朝早いですね。何時に起きますか。……七時に起きます。',
          reading: 'Ashita wa asa hayai desu ne. Nan-ji ni okimasu ka? ... Shichi-ji ni okimasu.',
          translation: 'Besok pagi-pagi sekali ya. Bangun jam berapa? ... Saya bangun jam 7.',
          prompt: 'Pukul berapa pembicara kedua akan bangun besok pagi?',
          options: ['Pukul 06.00', 'Pukul 07.00', 'Pukul 08.00', 'Pukul 09.00'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Pembicara kedua menjawab jelas "Shichi-ji ni okimasu" (七時に起きます = bangun pukul 7).',
          keyVocab: [
            { word: '朝早い (asa hayai)', meaning: 'pagi-pagi buta' },
            { word: '七時 (shichi-ji)', meaning: 'jam 7' },
            { word: '起きる (okiru)', meaning: 'bangun tidur' },
          ],
        },
        {
          id: 'jp-n5-3',
          title: 'Memesan di Kedai Kopi',
          scenario: 'Pelanggan memesan minuman di kafe stasiun.',
          text: 'いらっしゃいませ。……ホットコーヒーを二つと、アイスティーを一つください。',
          reading: 'Irasshaimase. ... Hotto kōhī o futatsu to, aisu tī o hitotsu kudasai.',
          translation: 'Selamat datang. ... Tolong dua kopi panas dan satu es teh.',
          prompt: 'Berapa jumlah total minuman yang dipesan oleh pelanggan?',
          options: ['2 minuman', '3 minuman (2 kopi panas + 1 es teh)', '4 minuman', '1 minuman saja'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Pelanggan memesan "kōhī o futatsu" (2 kopi) dan "aisu tī o hitotsu" (1 es teh), sehingga totalnya adalah 3 minuman.',
          keyVocab: [
            { word: '二つ (futatsu)', meaning: 'dua buah' },
            { word: '一つ (hitotsu)', meaning: 'satu buah' },
            { word: 'ホットコーヒー', meaning: 'kopi panas' },
          ],
        },
        {
          id: 'jp-n5-4',
          title: 'Menanyakan Harga Barang di Konbini',
          scenario: 'Pelanggan menanyakan harga payung di toko swalayan.',
          text: 'すみません、この傘はいくらですか。……それは八百円です。',
          reading: 'Sumimasen, kono kasa wa ikura desu ka? ... Sore wa happyaku-en desu.',
          translation: 'Permisi, payung ini harganya berapa? ... Itu harganya 800 yen.',
          prompt: 'Berapa harga payung yang ditanyakan pembicara?',
          options: ['600 Yen', '700 Yen', '800 Yen', '900 Yen'],
          answer: 2,
          voice: 'ja-JP',
          explanation: 'Kasir menjawab "Happyaku-en desu" (八百円 = 800 yen).',
          keyVocab: [
            { word: '傘 (kasa)', meaning: 'payung' },
            { word: 'いくら (ikura)', meaning: 'berapa harga' },
            { word: '八百円 (happyaku-en)', meaning: '800 yen' },
          ],
        },
        {
          id: 'jp-n5-5',
          title: 'Prakiraan Cuaca Esok Hari',
          scenario: 'Penyiar cuaca radio memberikan informasi cuaca kota Tokyo.',
          text: '明日の東京は朝から雨が降るでしょう。傘を忘れないでください。',
          reading: 'Ashita no Tōkyō wa asa kara ame ga furu deshō. Kasa o wasurenaide kudasai.',
          translation: 'Tokyo besok diperkirakan akan hujan sejak pagi. Jangan lupa membawa payung.',
          prompt: 'Bagaimana cuaca kota Tokyo pada esok hari?',
          options: ['Cerah dan panas terik', 'Hujan sejak pagi hari', 'Berangin kencang dan bersalju', 'Mendung tanpa hujan'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Penyiar mengatakan "asa kara ame ga furu" (hujan turun sejak pagi hari).',
          keyVocab: [
            { word: '雨が降る (ame ga furu)', meaning: 'hujan turun' },
            { word: '忘れる (wasureru)', meaning: 'lupa' },
          ],
        },
        {
          id: 'jp-n5-6',
          title: 'Membeli Tiket Shinkansen',
          scenario: 'Penumpang memesan tiket shinkansen di loket stasiun.',
          text: '京都までの新幹線、指定席で大人一枚お願いします。',
          reading: 'Kyōto made no shinkansen, shiteiseki de otona ichimai onegai shimasu.',
          translation: 'Tiket Shinkansen sampai Kyoto, kursi bernomor untuk 1 orang dewasa tolong.',
          prompt: 'Ke mana tujuan tiket yang dibeli oleh penumpang tersebut?',
          options: ['Stasiun Tokyo', 'Stasiun Kyoto', 'Stasiun Osaka', 'Stasiun Nagoya'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Penumpang menyebutkan "Kyōto made" (sampai ke Kyoto) dengan "shiteiseki" (kursi bernomor).',
          keyVocab: [
            { word: '新幹線 (shinkansen)', meaning: 'kereta cepat peluru' },
            { word: '指定席 (shiteiseki)', meaning: 'kursi bertiket khusus/terpesan' },
            { word: '大人 (otona)', meaning: 'orang dewasa' },
          ],
        },
      ],
    },
    {
      id: 'n4',
      name: 'JLPT N4 · Percakapan Terstruktur',
      badge: 'N4 Menengah Awal',
      desc: 'Rencana perjalanan, belanja, situasi restoran, dan instruksi kegiatan.',
      questions: [
        {
          id: 'jp-n4-1',
          title: 'Pengumuman Diskon Supermarket',
          scenario: 'Pengumuman promo diskon jam malam di dalam toko.',
          text: '本日午後八時より、生鮮食品コーナー全品半額セールを行います。',
          reading: 'Honjitsu gogo hachi-ji yori, seisen shokuhin kōnā zenpin hangaku sēru o okonaimasu.',
          translation: 'Hari ini mulai pukul 20.00, seluruh produk di area makanan segar diskon 50%.',
          prompt: 'Berapa potongan harga yang diberikan mulai pukul 8 malam?',
          options: ['Diskon 20%', 'Diskon 50% (setengah harga)', 'Beli 1 gratis 1', 'Diskon khusus anggota 10%'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Kata "hangaku" (半額) berarti setengah harga atau diskon 50%.',
          keyVocab: [
            { word: '半額 (hangaku)', meaning: 'setengah harga (diskon 50%)' },
            { word: '生鮮食品 (seisen shokuhin)', meaning: 'makanan segar' },
          ],
        },
        {
          id: 'jp-n4-2',
          title: 'Instruksi Minum Obat dari Dokter',
          scenario: 'Dokter memberikan resep obat dan aturan minum kepada pasien.',
          text: 'この薬は食後に一日三回、必ず水で飲んでください。お茶では飲まないでください。',
          reading: 'Kono kusuri wa shokugo ni ichinichi san-kai, kanarazu mizu de nonde kudasai. Ocha dewa nomanaide kudasai.',
          translation: 'Obat ini diminum setelah makan 3 kali sehari, pastikan dengan air putih. Jangan diminum dengan teh.',
          prompt: 'Bagaimana aturan meminum obat yang benar sesuai instruksi dokter?',
          options: ['Sebelum makan dengan teh hangat', 'Sesudah makan 3 kali sehari dengan air putih', 'Sebelum tidur bersama susu', 'Kapan saja saat terasa sakit'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Dokter mengatakan "shokugo ni ichinichi san-kai, kanarazu mizu de" (setelah makan, 3 kali sehari dengan air).',
          keyVocab: [
            { word: '食後 (shokugo)', meaning: 'setelah makan' },
            { word: '必ず (kanarazu)', meaning: 'pasti / tanpa kecuali' },
          ],
        },
        {
          id: 'jp-n4-3',
          title: 'Ajakan Menonton Bioskop & Menolak Halus',
          scenario: 'Dua orang sahabat membicarakan rencana akhir pekan.',
          text: '今週末、新しい映画を見に行きませんか。……すみません、その日はレポートを書かなければならないんです。',
          reading: 'Konshūmatsu, atarashii eiga o mi ni ikimasen ka? ... Sumimasen, sono hi wa repōto o kakanakereba naranai n desu.',
          translation: 'Akhir pekan ini mau pergi nonton film baru tidak? ... Maaf, hari itu saya harus menulis laporan.',
          prompt: 'Mengapa pembicara kedua menolak ajakan nonton bioskop?',
          options: ['Karena tidak suka film tersebut', 'Karena harus mengerjakan laporan', 'Karena sedang sakit demam', 'Karena ada janji dengan keluarga'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Pembicara kedua menolak dengan alasan "repōto o kakanakereba naranai" (harus menulis laporan).',
          keyVocab: [
            { word: '今週末 (konshūmatsu)', meaning: 'akhir pekan ini' },
            { word: '〜なければならない', meaning: 'harus / wajib melakukan' },
          ],
        },
      ],
    },
    {
      id: 'n3',
      name: 'JLPT N3 · Pemahaman Situasional & Kerja',
      badge: 'N3 Menengah',
      desc: 'Wawancara kerja paruh waktu, masalah layanan pelanggan, dan percakapan kantor.',
      questions: [
        {
          id: 'jp-n3-1',
          title: 'Wawancara Kerja Paruh Waktu (Baito)',
          scenario: 'Manajer toko mewawancarai calon pekerja sambilan.',
          text: '週に何日くらい入れますか。……火曜日と木曜日の午後なら、いつでも大丈夫です。',
          reading: 'Shū ni nan-nichi kurai hairemasu ka? ... Kayōbi to mokuyōbi no gogo nara, itsu demo daijōbu desu.',
          translation: 'Bisa masuk berapa hari dalam seminggu? ... Kalau siang hari Selasa dan Kamis, saya bisa kapan saja.',
          prompt: 'Kapan pelamar tersebut bisa bekerja sambilan?',
          options: ['Setiap hari dari pagi', 'Hanya hari Sabtu dan Minggu', 'Selasa dan Kamis siang', 'Senin dan Rabu malam'],
          answer: 2,
          voice: 'ja-JP',
          explanation: 'Pelamar menyatakan sanggup bekerja "Kayōbi to mokuyōbi no gogo" (Selasa dan Kamis siang).',
          keyVocab: [
            { word: '入れる (haCommands/hairemasu)', meaning: 'bisa masuk giliran kerja' },
            { word: '午後 (gogo)', meaning: 'siang / sore' },
          ],
        },
        {
          id: 'jp-n3-2',
          title: 'Kendala Pengiriman Paket Barang',
          scenario: 'Petugas logistik menelepon penerima barang terkait keterlambatan.',
          text: '大雪の影響で高速道路が通行止めになっており、お荷物の到着が明日以降に遅れる見込みです。',
          reading: 'Ōyuki no eikyō de kōsokudōro ga tsūkōdome ni natte ori, onimotsu no tōchaku ga ashita ikō ni okureru mikomi desu.',
          translation: 'Akibat salju lebat, jalan tol ditutup, sehingga pengiriman paket Anda diperkirakan terlambat hingga besok atau setelahnya.',
          prompt: 'Apa penyebab utama paket kiriman mengalami keterlambatan?',
          options: ['Alamat penerima salah ketik', 'Jalan tol ditutup akibat salju lebat', 'Mobil kurir mengalami kecelakaan', 'Gudang logistik sedang mogok kerja'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Petugas menjelaskan "ōyuki no eikyō de kōsokudōro ga tsūkōdome" (akibat dampak salju lebat jalan tol ditutup).',
          keyVocab: [
            { word: '大雪 (ōyuki)', meaning: 'salju lebat' },
            { word: '通行止め (tsūkōdome)', meaning: 'penutupan jalan / dilarang lewat' },
            { word: '遅れる見込み (okureru mikomi)', meaning: 'diperkirakan terlambat' },
          ],
        },
      ],
    },
    {
      id: 'n2',
      name: 'JLPT N2 · Berita & Opini Formal',
      badge: 'N2 Mahir Bisnis',
      desc: 'Wacana berita, laporan statistik, diskusi lingkungan, dan koordinasi bisnis.',
      questions: [
        {
          id: 'jp-n2-1',
          title: 'Berita Radio: Tren Kerja Jarak Jauh',
          scenario: 'Penyiar berita radio membacakan hasil survei ketenagakerjaan.',
          text: 'テレワークの導入により、都心から郊外へ移住する若年層が急増しているとのことです。',
          reading: 'Terewāku no dōnyū ni yori, toshin kara kōgai e ijū suru jakunensō ga kyūzō shite iru to no koto desu.',
          translation: 'Dengan diterapkannya kerja jarak jauh, jumlah anak muda yang pindah dari pusat kota ke pinggiran dikabarkan meningkat drastis.',
          prompt: 'Tren apa yang dilaporkan oleh penyiar berita?',
          options: ['Anak muda kembali tinggal di pusat kota', 'Peningkatan drastis kepindahan anak muda ke pinggiran kota berkat telework', 'Penurunan jam kerja karyawan kantor', 'Penghapusan sistem kerja jarak jauh'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Penyiar menyebutkan "toshin kara kōgai e ijū suru jakunensō ga kyūzō" (anak muda yang pindah dari pusat kota ke pinggiran meningkat pesat).',
          keyVocab: [
            { word: '導入 (dōnyū)', meaning: 'penerapan / adopsi' },
            { word: '郊外 (kōgai)', meaning: 'pinggiran kota' },
            { word: '急増 (kyūzō)', meaning: 'peningkatan drastis' },
          ],
        },
      ],
    },
    {
      id: 'n1',
      name: 'JLPT N1 · Wacana Kompleks & Editorial',
      badge: 'N1 Fasih Mutlak',
      desc: 'Wawancara pakar sains, editorial koran, bahasa sastra, dan negosiasi tingkat tinggi.',
      questions: [
        {
          id: 'jp-n1-1',
          title: 'Wawancara Pakar: Kecerdasan Buatan & Etika',
          scenario: 'Seorang profesor filsafat teknologi membahas batasan etika AI.',
          text: 'AIの進化が目覚ましい一方で、その判断基準における透明性の欠如は、倫理的観点から看過し得ない課題と言わざるを得ません。',
          reading: 'AI no shinka ga mezamashii ippō de, sono handan kijun ni okeru tōmeisei no ketsujo wa, rinriteki kanten kara kanka shi enai kadai to iwazaru o emasen.',
          translation: 'Di tengah pesatnya kemajuan AI, kurangnya transparansi pada kriteria keputusannya tak pelak merupakan masalah yang tak boleh diabaikan dari sudut pandang etika.',
          prompt: 'Apa inti pandangan profesor terhadap perkembangan teknologi AI?',
          options: ['AI sudah sempurna dan tidak perlu diawasi', 'Kurangnya transparansi keputusan AI adalah masalah etika yang tidak boleh diabaikan', 'Perkembangan AI harus dihentikan sepenuhnya', 'AI hanya boleh digunakan untuk riset medis'],
          answer: 1,
          voice: 'ja-JP',
          explanation: 'Frasa "kanka shi enai kadai to iwazaru o emasen" (tak pelak merupakan isu yang tidak boleh diabaikan).',
          keyVocab: [
            { word: '透明性の欠如 (tōmeisei no ketsujo)', meaning: 'ketiadaan / kurangnya transparansi' },
            { word: '看過し得ない (kanka shi enai)', meaning: 'tidak dapat diabaikan / dikesampingkan' },
          ],
        },
      ],
    },
  ],

  // =========================================================================
  // MANDARIN LISTENING SUITE (HSK 1 s.d. HSK 6)
  // =========================================================================
  cn: [
    {
      id: 'hsk1',
      name: 'HSK 1 · Sapaan & Kehidupan Dasar',
      badge: 'HSK 1 Dasar',
      desc: 'Mengenal nada Pinyin, angka, anggota keluarga, jam, dan perkenalan.',
      questions: [
        {
          id: 'cn-hsk1-1',
          title: 'Menanyakan Nama & Perkenalan',
          scenario: 'Dua orang teman baru saling berkenalan di kelas bahasa Mandarin.',
          text: '你好！请问你叫什么名字？……我叫李明，很高兴认识你。',
          reading: 'Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi? ... Wǒ jiào Lǐ Míng, hěn gāoxìng rènshi nǐ.',
          translation: 'Halo! Boleh tanya nama Anda siapa? ... Nama saya Li Ming, senang berkenalan dengan Anda.',
          prompt: 'Siapakah nama pembicara kedua pada audio?',
          options: ['Wang Lei', 'Li Ming', 'Zhang Wei', 'Liu Yang'],
          answer: 1,
          voice: 'zh-CN',
          explanation: 'Pembicara kedua menjawab jelas "Wǒ jiào Lǐ Míng" (Nama saya Li Ming).',
          keyVocab: [
            { word: '请问 (qǐngwèn)', meaning: 'boleh tanya / permisi tanya' },
            { word: '高兴 (gāoxìng)', meaning: 'senang / gembira' },
          ],
        },
        {
          id: 'cn-hsk1-2',
          title: 'Membeli Apel di Toko Buah',
          scenario: 'Pelanggan menanyakan harga apel per setengah kilogram (斤).',
          text: '老板，这个苹果多少钱一斤？……五块钱一斤。',
          reading: 'Lǎobǎn, zhège píngguǒ duōshao qián yì jīn? ... Wǔ kuài qián yì jīn.',
          translation: 'Bos, apel ini berapa harganya setengah kilo? ... 5 kuai (yuan) setengah kilo.',
          prompt: 'Berapa harga apel tersebut per setengah kilogram (斤)?',
          options: ['3 Yuan', '4 Yuan', '5 Yuan (kuài)', '10 Yuan'],
          answer: 2,
          voice: 'zh-CN',
          explanation: 'Penjual menjawab "Wǔ kuài qián yì jīn" (5 yuan per jin).',
          keyVocab: [
            { word: '苹果 (píngguǒ)', meaning: 'apel' },
            { word: '多少钱 (duōshao qián)', meaning: 'berapa harga' },
            { word: '块 (kuài)', meaning: 'satuan mata uang Yuan (lisan)' },
          ],
        },
        {
          id: 'cn-hsk1-3',
          title: 'Menanyakan Waktu Keberangkatan',
          scenario: 'Dua orang teman memeriksa jam sebelum pergi ke bioskop.',
          text: '现在几点？……现在下午三点半，电影四点开始。',
          reading: 'Xiànzài jǐ diǎn? ... Xiànzài xiàwǔ sān diǎn bàn, diànyǐng sì diǎn kāishǐ.',
          translation: 'Sekarang jam berapa? ... Sekarang jam setengah 4 sore, filmnya mulai jam 4.',
          prompt: 'Pukul berapa film akan dimulai?',
          options: ['Pukul 03.00', 'Pukul 03.30', 'Pukul 04.00 sore', 'Pukul 05.00 sore'],
          answer: 2,
          voice: 'zh-CN',
          explanation: 'Pembicara menyebutkan "diànyǐng sì diǎn kāishǐ" (film mulai pukul 4).',
          keyVocab: [
            { word: '几点 (jǐ diǎn)', meaning: 'jam berapa' },
            { word: '半 (bàn)', meaning: 'setengah (30 menit)' },
            { word: '开始 (kāishǐ)', meaning: 'mulai' },
          ],
        },
      ],
    },
    {
      id: 'hsk2',
      name: 'HSK 2 · Belanja & Kegiatan Harian',
      badge: 'HSK 2 Menengah',
      desc: 'Transportasi, kondisi cuaca, pemesanan makanan di restoran, dan arah.',
      questions: [
        {
          id: 'cn-hsk2-1',
          title: 'Memesan Taksi ke Bandara',
          scenario: 'Penumpang memberi tahu sopir taksi tujuannya di Beijing.',
          text: '师傅，我去首都机场，请问大约需要多长时间？……不堵车的话四十分钟。',
          reading: 'Shīfu, wǒ qù Shǒudū Jīchǎng, qǐngwèn dàyuē xūyào duō cháng shíjiān? ... Bù dǔchē dehuà sìshí fēnzhōng.',
          translation: 'Pak sopir, saya mau ke Bandara Ibu Kota, kira-kira butuh berapa lama? ... Kalau tidak macet, 40 menit.',
          prompt: 'Berapa lama perjalanan ke bandara jika jalanan tidak macet?',
          options: ['20 menit', '30 menit', '40 menit', '1 jam'],
          answer: 2,
          voice: 'zh-CN',
          explanation: 'Sopir mengatakan "Bù dǔchē dehuà sìshí fēnzhōng" (Kalau tidak macet, 40 menit).',
          keyVocab: [
            { word: '机场 (jīchǎng)', meaning: 'bandara' },
            { word: '多长时间 (duō cháng shíjiān)', meaning: 'berapa lama waktu' },
            { word: '堵车 (dǔchē)', meaning: 'macet lalu lintas' },
          ],
        },
      ],
    },
    {
      id: 'hsk3',
      name: 'HSK 3 · Situasi Kerja & Wisata',
      badge: 'HSK 3 Mandiri',
      desc: 'Pemesanan kamar hotel, percakapan kantor, dan rencana liburan.',
      questions: [
        {
          id: 'cn-hsk3-1',
          title: 'Reservasi Kamar Hotel di Shanghai',
          scenario: 'Tamu melakukan check-in di resepsionis hotel.',
          text: '您好，我预订了一间大床房，住两个晚上，这是我的护照。',
          reading: 'Nín hǎo, wǒ yùdìng le yì jiān dàchuáng fáng, zhù liǎng ge wǎnshang, zhè shì wǒ de hùzhào.',
          translation: 'Halo, saya sudah memesan satu kamar ranjang besar untuk menginap 2 malam, ini paspor saya.',
          prompt: 'Berapa malam tamu tersebut berencana menginap di hotel?',
          options: ['1 malam', '2 malam', '3 malam', '1 minggu'],
          answer: 1,
          voice: 'zh-CN',
          explanation: 'Tamu menyebutkan "zhù liǎng ge wǎnshang" (menginap dua malam).',
          keyVocab: [
            { word: '预订 (yùdìng)', meaning: 'memesan / reservasi' },
            { word: '护照 (hùzhào)', meaning: 'paspor' },
          ],
        },
      ],
    },
  ],

  // =========================================================================
  // KOREAN LISTENING SUITE (TOPIK 1 s.d. 6)
  // =========================================================================
  kr: [
    {
      id: 'topik1',
      name: 'TOPIK I (Level 1) · Pemula Fondasi',
      badge: 'Level 1',
      desc: 'Percakapan sapaan, memesan di kafe, arah jalan, dan belanja di Myeongdong.',
      questions: [
        {
          id: 'kr-topik1-1',
          title: 'Memesan Iced Americano di Kafe Hongdae',
          scenario: 'Pelanggan memesan kopi dingin di kedai kopi Seoul.',
          text: '주문하시겠어요? ……아이스 아메리카노 두 잔 주세요. 테이크아웃 할게요.',
          reading: 'Jumun-hasigesseoyo? ... Aiseu Amerikano du jan juseyo. Teikeu-aut halgeyo.',
          translation: 'Mau pesan apa? ... Tolong dua gelas Iced Americano. Dibungkus (takeout) ya.',
          prompt: 'Berapa banyak kopi dingin yang dipesan dan bagaimana cara membawanya?',
          options: ['1 gelas diminum di tempat', '2 gelas dibungkus bawa pulang (takeout)', '3 gelas panas', '2 gelas jus jeruk'],
          answer: 1,
          voice: 'ko-KR',
          explanation: 'Pelanggan mengatakan "Amerikano du jan" (2 gelas) dan "Teikeu-aut halgeyo" (akan dibungkus/takeout).',
          keyVocab: [
            { word: '두 잔 (du jan)', meaning: 'dua gelas' },
            { word: '테이크아웃 (teikeu-aut)', meaning: 'bawa pulang / takeaway' },
          ],
        },
        {
          id: 'kr-topik1-2',
          title: 'Menanyakan Stasiun Kereta Bawah Tanah (Subway)',
          scenario: 'Seorang pejalan kaki bertanya stasiun subway terdekat.',
          text: '실례지만, 지하철역이 어디에 있어요? ……저기 편의점 앞에서 오른쪽으로 가세요.',
          reading: 'Sillyejiman, jihacheol-yeogi eodie isseoyo? ... Jeogi pyeon-uijeom ap-eseo oreunjjok-euro gaseyo.',
          translation: 'Permisi, stasiun subway ada di mana ya? ... Di depan toserba itu silakan belok ke kanan.',
          prompt: 'Ke arah mana penanya harus berbelok di depan toserba (minimarket)?',
          options: ['Belok ke kiri', 'Belok ke kanan (오른쪽)', 'Jalan lurus terus', 'Masuk ke dalam gedung'],
          answer: 1,
          voice: 'ko-KR',
          explanation: 'Petunjuk arahnya adalah "oreunjjok-euro gaseyo" (silakan belok ke kanan).',
          keyVocab: [
            { word: '지하철역 (jihacheol-yeok)', meaning: 'stasiun kereta bawah tanah' },
            { word: '오른쪽 (oreunjjok)', meaning: 'sebelah kanan' },
            { word: '편의점 (pyeon-uijeom)', meaning: 'minimarket / toserba' },
          ],
        },
      ],
    },
    {
      id: 'topik2',
      name: 'TOPIK I (Level 2) · Kehidupan Harian',
      badge: 'Level 2',
      desc: 'Membeli tiket KTX, janji bertemu teman, dan pemesanan makanan.',
      questions: [
        {
          id: 'kr-topik2-1',
          title: 'Membeli Tiket KTX ke Busan',
          scenario: 'Penumpang membeli tiket kereta cepat di Stasiun Seoul.',
          text: '부산행 KTX 열차, 제일 빠른 시간으로 한 장 부탁드립니다.',
          reading: 'Busan-haeng KTX yeolcha, jeil ppareun sigan-euro han jang butakdeurimnida.',
          translation: 'Kereta KTX tujuan Busan, tolong satu lembar tiket untuk waktu paling awal/cepat.',
          prompt: 'Kota mana yang menjadi tujuan tiket kereta cepat (KTX) tersebut?',
          options: ['Kota Incheon', 'Kota Busan', 'Kota Daegu', 'Pulau Jeju'],
          answer: 1,
          voice: 'ko-KR',
          explanation: 'Penumpang menyebut "Busan-haeng" (부산행 = tujuan Busan).',
          keyVocab: [
            { word: '제일 빠른 (jeil ppareun)', meaning: 'paling cepat / paling awal' },
            { word: '한 장 (han jang)', meaning: 'satu lembar tiket' },
          ],
        },
      ],
    },
  ],

  // =========================================================================
  // ENGLISH LISTENING SUITE (A1 s.d. C2 / IELTS)
  // =========================================================================
  en: [
    {
      id: 'a1',
      name: 'CEFR A1 · Everyday Basics',
      badge: 'A1 Starter',
      desc: 'Greetings, ordering fast food, checking train times, and simple directions.',
      questions: [
        {
          id: 'en-a1-1',
          title: 'Ordering Breakfast at a Diner',
          scenario: 'A customer orders breakfast at a cafe counter.',
          text: 'Can I get two scrambled eggs, some toast, and a cup of black coffee, please?',
          reading: 'Can I get two scrambled eggs, some toast, and a cup of black coffee, please?',
          translation: 'Bisakah saya pesan dua telur orak-arik, roti panggang, dan secangkir kopi hitam?',
          prompt: 'What drink did the customer order?',
          options: ['Orange juice', 'Hot chocolate', 'A cup of black coffee', 'Green tea'],
          answer: 2,
          voice: 'en-GB',
          explanation: 'The speaker explicitly asked for "a cup of black coffee".',
          keyVocab: [
            { word: 'scrambled eggs', meaning: 'telur orak-arik' },
            { word: 'toast', meaning: 'roti panggang' },
          ],
        },
        {
          id: 'en-a1-2',
          title: 'Train Platform Announcement',
          scenario: 'Station loudspeaker announces an arriving train in London.',
          text: 'The train now approaching platform 3 is the 10:45 service to Oxford.',
          reading: 'The train now approaching platform 3 is the 10:45 service to Oxford.',
          translation: 'Kereta yang sedang mendekati peron 3 adalah layanan pukul 10.45 tujuan Oxford.',
          prompt: 'Which platform is the train to Oxford arriving at?',
          options: ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4'],
          answer: 2,
          voice: 'en-GB',
          explanation: 'The announcement says "approaching platform 3".',
          keyVocab: [
            { word: 'approaching', meaning: 'sedang mendekat / tiba' },
            { word: 'platform', meaning: 'peron jalur stasiun' },
          ],
        },
      ],
    },
    {
      id: 'b2',
      name: 'CEFR B2 · IELTS Listening Mastery',
      badge: 'B2 / IELTS Band 7',
      desc: 'Academic campus tours, workplace meetings, and lecture extracts.',
      questions: [
        {
          id: 'en-b2-1',
          title: 'University Library Induction',
          scenario: 'A librarian explains the digital book loan policy to new students.',
          text: 'Undergraduate students are permitted to borrow up to ten books simultaneously for a maximum duration of three weeks.',
          reading: 'Undergraduate students are permitted to borrow up to ten books simultaneously for a maximum duration of three weeks.',
          translation: 'Mahasiswa S1 diizinkan meminjam hingga sepuluh buku sekaligus untuk durasi maksimal tiga minggu.',
          prompt: 'What is the maximum loan period allowed for undergraduate students?',
          options: ['One week', 'Two weeks', 'Three weeks', 'One month'],
          answer: 2,
          voice: 'en-GB',
          explanation: 'The librarian states "for a maximum duration of three weeks".',
          keyVocab: [
            { word: 'undergraduate', meaning: 'mahasiswa program S1' },
            { word: 'simultaneously', meaning: 'secara bersamaan / sekaligus' },
          ],
        },
      ],
    },
  ],
}

/**
 * Filter and generate clean, sensible vocabulary listening questions.
 * Ensures distractors are realistic word translations of the same category,
 * never messy grammar formula sentences or phonetic notes.
 */
export function generateVocabListeningQuestions(
  lang: LangId,
  cards: Array<{ id: string; front: string; back: string; reading?: string; hint?: string }>,
  count = 25,
): ListeningQuestion[] {
  if (!cards || cards.length === 0) return []

  // Sanitize card data: only retain genuine vocabulary words with clean translations
  const sanitized = cards
    .filter((c) => {
      if (!c.front || !c.back) return false
      // Filter out long grammar formulas or prompt questions
      if (c.front.includes('?') || c.front.length > 25) return false
      if (c.back.includes('— /e/') || c.back.includes('+ NEGATIF') || c.back.length > 40) return false
      return true
    })
    .map((c) => {
      // Clean up front
      let cleanFront = c.front.replace(/\(.*?\)/g, '').trim()
      if (cleanFront.includes('—')) cleanFront = cleanFront.split('—')[0].trim()

      // Clean up back translation (remove mora, parenthetical notes)
      let cleanBack = c.back.replace(/\(.*?\)/g, '').trim()
      if (cleanBack.includes('—')) cleanBack = cleanBack.split('—')[0].trim()

      return {
        ...c,
        front: cleanFront || c.front,
        back: cleanBack || c.back,
      }
    })
    .filter((c) => c.front.length > 0 && c.back.length > 0 && c.back.length < 35)

  if (sanitized.length < 4) return []

  // Shuffle pool
  const pool = [...sanitized].sort(() => Math.random() - 0.5)
  const selected = pool.slice(0, count)

  const voiceMap: Record<LangId, string> = {
    jp: 'ja-JP',
    cn: 'zh-CN',
    kr: 'ko-KR',
    en: 'en-GB',
  }

  // Common plausible fallback distractors per language if pool is small
  const fallbackDistractors: Record<LangId, string[]> = {
    jp: ['Rumah Sakit', 'Stasiun Kereta', 'Perpustakaan', 'Sekolah', 'Toko Buku', 'Bandara', 'Restoran', 'Kantor Pos', 'Taman Kota', 'Hotel'],
    cn: ['Bandara', 'Stasiun Kereta', 'Perpustakaan', 'Sekolah', 'Toko Buku', 'Rumah Sakit', 'Restoran', 'Supermarket', 'Kantor Polisi', 'Taman'],
    kr: ['Rumah Sakit', 'Stasiun Subway', 'Perpustakaan', 'Sekolah', 'Minimarket', 'Bandara Incheon', 'Kafe', 'Restoran', 'Kantor Pos', 'Taman'],
    en: ['Train Station', 'Library', 'Hospital', 'Supermarket', 'Airport', 'Post Office', 'University', 'Coffee Shop', 'Museum', 'Hotel'],
  }

  return selected.map((card, idx) => {
    // Pick 3 sensible distractors
    const candidateDistractors = sanitized
      .filter((c) => c.id !== card.id && c.back !== card.back)
      .map((c) => c.back)

    // Deduplicate
    const uniqueCandidates = Array.from(new Set(candidateDistractors)).sort(() => Math.random() - 0.5)
    const pickedDistractors = uniqueCandidates.slice(0, 3)

    // Pad if needed from fallbacks
    const fallbacks = fallbackDistractors[lang] || fallbackDistractors.jp
    let fbIndex = 0
    while (pickedDistractors.length < 3 && fbIndex < fallbacks.length) {
      const fb = fallbacks[fbIndex]
      if (fb !== card.back && !pickedDistractors.includes(fb)) {
        pickedDistractors.push(fb)
      }
      fbIndex++
    }

    const options = [card.back, ...pickedDistractors].sort(() => Math.random() - 0.5)
    const answerIndex = options.indexOf(card.back)

    return {
      id: `vocab-drill-${lang}-${idx}-${card.id}`,
      title: `Kosakata: ${card.front}`,
      scenario: `Dengarkan pelafalan kata "${card.front}" oleh penutur asli dan pilih arti terjemahan yang tepat.`,
      text: card.front,
      reading: card.reading || card.front,
      translation: card.back,
      prompt: `Apa arti kosakata "${card.front}" yang diucapkan pada audio?`,
      options,
      answer: Math.max(0, answerIndex),
      voice: voiceMap[lang] || 'ja-JP',
      explanation: `Kosakata "${card.front}" (${card.reading || card.front}) memiliki arti: "${card.back}".`,
      keyVocab: [
        { word: `${card.front} (${card.reading || card.front})`, meaning: card.back },
      ],
    }
  })
}
