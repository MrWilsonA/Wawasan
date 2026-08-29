import type { LangId, Unit } from '../types'

/**
 * Closing quizzes for the gates whose base modules didn't define one.
 *
 * The curriculum rule is absolute: a gate is passed only by scoring ≥85% on its
 * closing quiz ("Nilai 84% = ulang gerbang, tanpa pengecualian"). Without a
 * quiz the unlock logic falls back to "all lessons touched", which is a weaker
 * bar than the curriculum specifies — so every gate gets one.
 *
 * Merged last by `curriculum/index.ts`, keyed by language then gate index.
 */
export const GATE_QUIZZES: Record<LangId, Record<number, Unit>> = {
  /* =============================== JEPANG =============================== */
  jp: {
    2: {
      id: 'jp-g2-gate',
      title: 'Kuis Gerbang 2',
      subtitle: 'Kata inti — ko-so-a-do, angka, waktu',
      level: 'N5',
      badge: '関門2',
      lessons: [
        {
          id: 'jp-g2-gate-l1',
          title: 'Kuis Gerbang 2',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'berbicara',
              prompt: 'Buku ada di tangan LAWAN BICARA. Anda menyebutnya…',
              options: ['これ', 'それ', 'あれ', 'どれ'],
              answer: 1,
              explain: 'こ dekat saya · そ dekat kamu · あ jauh dari kita berdua. Bahasa Indonesia hanya punya dua tingkat, Jepang tiga.',
            },
            {
              id: 'g2', type: 'choice', skill: 'menyimak',
              display: '9時', prompt: 'Bacaan yang benar?',
              options: ['きゅうじ', 'くじ', 'ここのじ', 'なのじ'],
              answer: 1,
              explain: 'くじ — salah satu dari tiga jam tak beraturan bersama よじ (4時) dan しちじ (7時).',
            },
            {
              id: 'g3', type: 'fill', skill: 'membaca',
              prompt: '"Bekerja dari jam 9 sampai jam 5."',
              sentence: 'くじ ___ ごじ ___ はたらきます。',
              bank: ['から', 'まで', 'に', 'で'],
              answers: ['から', 'まで'],
              explain: 'から = titik awal · まで = titik akhir.',
            },
            {
              id: 'g4', type: 'match', skill: 'membaca',
              prompt: 'Pasangkan kata penunjuk tempat.',
              pairs: [
                ['ここ', 'di sini'],
                ['そこ', 'di situ (dekat kamu)'],
                ['あそこ', 'di sana (jauh dari kita berdua)'],
                ['どこ', 'di mana'],
              ],
              explain: 'Pola こ-そ-あ-ど berulang di semua kategori: これ/ここ/この/こちら.',
            },
            {
              id: 'g5', type: 'choice', skill: 'membaca',
              display: '4時', prompt: 'Bacaan yang benar?',
              options: ['しじ', 'よんじ', 'よじ', 'しちじ'],
              answer: 2,
              explain: 'よじ. Ketiga jam tak beraturan sering keluar di soal menyimak N5.',
            },
          ],
        },
      ],
    },
    4: {
      id: 'jp-g4-gate',
      title: 'Kuis Gerbang 4',
      subtitle: 'Produksi — menyusun kalimat sendiri',
      level: 'N4',
      badge: '関門4',
      lessons: [
        {
          id: 'jp-g4-gate-l1',
          title: 'Kuis Gerbang 4',
          kind: 'gate',
          xp: 45,
          exercises: [
            {
              id: 'g1', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Setiap hari saya belajar bahasa Jepang di perpustakaan."',
              chunks: ['わたしは', 'まいにち', 'としょかんで', 'にほんごを', 'べんきょうします'],
              answer: [0, 1, 2, 3, 4],
              explain: 'Topik → waktu → tempat aksi (で) → objek (を) → kata kerja. Kata kerja SELALU di akhir.',
            },
            {
              id: 'g2', type: 'type', skill: 'menulis',
              prompt: 'Terjemahkan: "Tolong lihat ini." (lihat = みる)',
              accept: ['これをみてください', 'これを見てください'],
              placeholder: 'これ…',
              explain: '～てください = permintaan sopan, dibentuk dari て形.',
            },
            {
              id: 'g3', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Karena panas, saya membuka jendela."',
              chunks: ['あついです', 'から', 'まどを', 'あけます'],
              answer: [0, 1, 2, 3],
              explain: 'から sebagai penanda sebab diletakkan SESUDAH klausa alasan — kebalikan "karena" Bahasa Indonesia.',
            },
            {
              id: 'g4', type: 'type', skill: 'menulis',
              display: 'およぐ', prompt: 'Ubah ke て形.',
              accept: ['およいで'],
              placeholder: 'およ…',
              explain: 'ぐ → いで, bukan いて. Bandingkan かく → かいて.',
            },
            {
              id: 'g5', type: 'choice', skill: 'berbicara',
              prompt: 'Berapa kalimat sendiri yang harus diproduksi di 10 menit terakhir tiap sesi?',
              options: ['1', '3', '5', '10'],
              answer: 2,
              explain: 'Lima kalimat memakai struktur hari itu. Bukan menyalin — memproduksi. Ini bagian Output dari template 60 menit.',
            },
          ],
        },
      ],
    },
  },

  /* ============================== MANDARIN ============================== */
  cn: {
    0: {
      id: 'cn-g0-gate',
      title: 'Kuis Gerbang 0',
      subtitle: 'Pinyin & nada — gerbang yang tidak boleh dipercepat',
      level: 'HSK 1',
      badge: '关卡0',
      lessons: [
        {
          id: 'cn-g0-gate-l1',
          title: 'Kuis Gerbang 0',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'berbicara',
              display: '你好', prompt: 'Ditulis nǐ hǎo (3+3). Diucapkan bagaimana?',
              options: ['nǐ hǎo (tetap)', 'ní hǎo', 'nì hǎo', 'nī hǎo'],
              answer: 1,
              explain: 'Dua nada 3 berturut-turut → yang PERTAMA jadi nada 2.',
            },
            {
              id: 'g2', type: 'choice', skill: 'berbicara',
              display: '一个', prompt: '个 bernada 4. Bagaimana 一 dibaca?',
              options: ['yī', 'yì', 'yí', 'yi'],
              answer: 2,
              explain: '一 di depan nada 4 → yí. Di depan nada 1/2/3 → yì.',
            },
            {
              id: 'g3', type: 'choice', skill: 'berbicara',
              prompt: 'Huruf "c" dalam pinyin dibaca?',
              options: ['"c" seperti "cari"', '"k"', '"ts" seperti "tsunami"', '"s"'],
              answer: 2,
              explain: 'Jebakan besar bagi pembaca Indonesia. 菜 cài = "tsai", bukan "cai".',
            },
            {
              id: 'g4', type: 'sort', skill: 'berbicara',
              prompt: 'Di mana posisi lidahnya?',
              buckets: ['Di gigi', 'Menekuk', 'Datar, senyum'],
              items: [
                { text: 'z c s', bucket: 0 },
                { text: 'zh ch sh r', bucket: 1 },
                { text: 'j q x', bucket: 2 },
              ],
              explain: 'Bahasa Indonesia hanya punya yang pertama — dua sisanya dibangun dari nol.',
            },
            {
              id: 'g5', type: 'match', skill: 'menyimak',
              prompt: 'Semua dibaca "ma". Pasangkan dengan artinya.',
              pairs: [
                ['妈 mā', 'ibu'],
                ['麻 má', 'rami'],
                ['马 mǎ', 'kuda'],
                ['骂 mà', 'memarahi'],
              ],
              explain: 'Hanya nada yang membedakan. Salah nada = kata berbeda, bukan "aksen aneh".',
            },
            {
              id: 'g6', type: 'choice', skill: 'berbicara',
              display: '去 qù', prompt: 'Vokalnya diucapkan bagaimana?',
              options: ['seperti "u" pada "buku"', 'seperti ü (bibir bulat, lidah "i")', 'seperti "o"', 'seperti "eu"'],
              answer: 1,
              explain: 'Setelah j/q/x/y, "u" SELALU berarti ü — titiknya dihilangkan karena tidak ambigu.',
            },
          ],
        },
      ],
    },
    2: {
      id: 'cn-g2-gate',
      title: 'Kuis Gerbang 2',
      subtitle: 'Kata inti — 量词, 是有在, waktu',
      level: 'HSK 2',
      badge: '关卡2',
      lessons: [
        {
          id: 'cn-g2-gate-l1',
          title: 'Kuis Gerbang 2',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'fill', skill: 'membaca',
              prompt: 'Isi 量词: "dua buku"',
              sentence: '两 ___ 书',
              bank: ['本', '张', '条', '只'],
              answers: ['本'],
              explain: '本 běn khusus buku dan majalah.',
            },
            {
              id: 'g2', type: 'choice', skill: 'membaca',
              prompt: 'Negatif dari 我有书?',
              options: ['我不有书', '我没有书', '我不是有书', '我没是书'],
              answer: 1,
              explain: '有 SELALU dinegasikan dengan 没 — satu-satunya kata kerja yang begitu.',
            },
            {
              id: 'g3', type: 'choice', skill: 'berbicara',
              prompt: '"Jam 2" dalam Mandarin?',
              options: ['二点', '两点', '二时', '双点'],
              answer: 1,
              explain: '两 untuk menghitung · 二 untuk angka & urutan (二月, 第二).',
            },
            {
              id: 'g4', type: 'sort', skill: 'membaca',
              prompt: 'Panjang LENTUR (条) atau panjang KAKU (支)?',
              buckets: ['条 lentur', '支 kaku'],
              items: [
                { text: '鱼 ikan', bucket: 0 },
                { text: '路 jalan', bucket: 0 },
                { text: '裤子 celana', bucket: 0 },
                { text: '笔 pena', bucket: 1 },
              ],
              explain: '条 = panjang & bisa melengkung · 支 = panjang & kaku.',
            },
            {
              id: 'g5', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Jumat, 28 Agustus 2026"',
              chunks: ['2026年', '8月', '28日', '星期五'],
              answer: [0, 1, 2, 3],
              explain: 'Besar dulu, kecil kemudian — kebalikan urutan Bahasa Indonesia.',
            },
          ],
        },
      ],
    },
    4: {
      id: 'cn-g4-gate',
      title: 'Kuis Gerbang 4',
      subtitle: 'Produksi — susun kalimat & 成语',
      level: 'HSK 4',
      badge: '关卡4',
      lessons: [
        {
          id: 'cn-g4-gate-l1',
          title: 'Kuis Gerbang 4',
          kind: 'gate',
          xp: 45,
          exercises: [
            {
              id: 'g1', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Dia kemarin menelepon saya."',
              chunks: ['他', '昨天', '给我', '打', '电话'],
              answer: [0, 1, 2, 3, 4],
              explain: 'Subjek → waktu → penerima (给我) → kata kerja → objek.',
            },
            {
              id: 'g2', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Kakak saya bekerja di Beijing."',
              chunks: ['我哥哥', '在北京', '工作'],
              answer: [0, 1, 2],
              explain: 'Keterangan tempat SELALU sebelum kata kerja.',
            },
            {
              id: 'g3', type: 'match', skill: 'membaca',
              prompt: 'Pasangkan 成语 dengan padanan Indonesianya.',
              pairs: [
                ['入乡随俗', 'Di mana bumi dipijak, di situ langit dijunjung'],
                ['一举两得', 'Sekali dayung dua tiga pulau terlampaui'],
                ['半途而废', 'Berhenti di tengah jalan'],
              ],
              explain: 'Padanan peribahasa jauh lebih mudah diingat daripada terjemahan harfiah.',
            },
            {
              id: 'g4', type: 'choice', skill: 'menulis',
              prompt: 'Strategi menyusun kalimat dari kata acak (HSK 4)?',
              options: [
                'Mulai dari kata pertama secara alfabetis',
                'Cari KATA KERJA dulu, lalu subjek, lalu tempel keterangan di DEPAN kata kerja',
                'Susun sesuai panjang kata',
                'Tebak saja',
              ],
              answer: 1,
              explain: 'Kata kerja adalah poros kalimat. Keterangan selalu di depannya, objek di belakangnya.',
            },
          ],
        },
      ],
    },
  },

  /* =============================== KOREA =============================== */
  kr: {
    0: {
      id: 'kr-g0-gate',
      title: 'Kuis Gerbang 0',
      subtitle: 'Bunyi jamo — tiga tingkat konsonan',
      level: 'Level 1',
      badge: '관문0',
      lessons: [
        {
          id: 'kr-g0-gate-l1',
          title: 'Kuis Gerbang 0',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'match', skill: 'menyimak',
              prompt: 'Pasangkan kata dengan artinya. Hanya tingkat konsonan yang membedakan.',
              pairs: [
                ['불 bul', 'api'],
                ['풀 pul', 'rumput'],
                ['뿔 ppul', 'tanduk'],
              ],
              explain: 'Tiga kata berbeda, satu vokal sama. Kesalahan di sini mengganti kata, bukan sekadar aksen.',
            },
            {
              id: 'g2', type: 'choice', skill: 'berbicara',
              prompt: 'Tisu di depan mulut HAMPIR TIDAK BERGERAK. Konsonan apa?',
              options: ['ㅂ', 'ㅍ', 'ㅃ', 'ㅁ'],
              answer: 2,
              explain: 'ㅃ tegang: tenggorokan menegang, hembusan nyaris nol. ㅍ justru sebaliknya.',
            },
            {
              id: 'g3', type: 'sort', skill: 'berbicara',
              prompt: 'Kelompokkan menurut tingkatnya.',
              buckets: ['Biasa 평음', 'Beraspirasi 격음', 'Tegang 경음'],
              items: [
                { text: 'ㄱ ㄷ ㅂ ㅅ ㅈ', bucket: 0 },
                { text: 'ㅋ ㅌ ㅍ ㅊ', bucket: 1 },
                { text: 'ㄲ ㄸ ㅃ ㅆ ㅉ', bucket: 2 },
              ],
              explain: 'Huruf digandakan = tegang. Guratan tambahan = hembusan lebih kuat.',
            },
            {
              id: 'g4', type: 'judge', skill: 'berbicara',
              statement: 'Bahasa Indonesia punya tiga tingkat konsonan seperti bahasa Korea.',
              answer: false,
              explain: 'Indonesia hanya punya DUA (b vs p). Tingkat ketiga (tegang) harus dibangun dari nol — inilah tantangan terbesar Gerbang 0 Korea.',
            },
          ],
        },
      ],
    },
    1: {
      id: 'kr-g1-gate',
      title: 'Kuis Gerbang 1',
      subtitle: 'Hangeul — desain, blok, batchim, perubahan bunyi',
      level: 'Level 2',
      badge: '관문1',
      lessons: [
        {
          id: 'kr-g1-gate-l1',
          title: 'Kuis Gerbang 1',
          kind: 'gate',
          xp: 45,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'menyimak',
              display: '한국어', prompt: 'Bagaimana SEBENARNYA diucapkan?',
              options: ['han-guk-eo', 'han-gu-geo', 'han-guk-geo', 'ha-nguk-eo'],
              answer: 1,
              explain: '연음 — batchim ㄱ pindah ke posisi awal 어. Mengucapkan "han-guk-eo" langsung menandakan pemula.',
            },
            {
              id: 'g2', type: 'sort', skill: 'menyimak',
              prompt: 'Bunyi batchim apa yang dihasilkan?',
              buckets: ['[t] ㄷ', '[k] ㄱ', '[p] ㅂ'],
              items: [
                { text: '옷 baju', bucket: 0 },
                { text: '꽃 bunga', bucket: 0 },
                { text: '낮 siang', bucket: 0 },
                { text: '밖 luar', bucket: 1 },
                { text: '앞 depan', bucket: 2 },
              ],
              explain: '27 batchim runtuh jadi hanya 7 bunyi. Ejaan harus dihafal per kata.',
            },
            {
              id: 'g3', type: 'choice', skill: 'membaca',
              prompt: 'ㄱ + satu guratan = ㅋ. Apa yang bertambah?',
              options: ['Kekerasan suara', 'HEMBUSAN (aspirasi)', 'Panjang bunyi', 'Nada'],
              answer: 1,
              explain: 'Guratan tambahan SELALU berarti hembusan lebih kuat — berlaku di seluruh sistem konsonan.',
            },
            {
              id: 'g4', type: 'choice', skill: 'menyimak',
              display: '학교', prompt: 'Diucapkan bagaimana?',
              options: ['[학교]', '[학꾜]', '[항교]', '[하꾜]'],
              answer: 1,
              explain: '경음화 penegangan: ㄱ batchim + ㄱ → ㄲ tegang.',
            },
            {
              id: 'g5', type: 'choice', skill: 'membaca',
              prompt: 'Vokal hangeul dibangun dari tiga simbol apa?',
              options: [
                'Air, api, tanah',
                'Langit (·), bumi (ㅡ), manusia (ㅣ)',
                'Atas, tengah, bawah',
                'Konsonan, vokal, batchim',
              ],
              answer: 1,
              explain: '천 cheon · 지 ji · 인 in — filsafat tiga unsur. ㅏ = manusia + langit di timur (terang).',
            },
            {
              id: 'g6', type: 'choice', skill: 'menulis',
              display: '아', prompt: 'Kenapa ada ㅇ di depan?',
              options: [
                'Karena dibaca "nga"',
                'Karena setiap blok WAJIB dimulai konsonan — ㅇ jadi pengisi yang diam',
                'Karena itu tanda baca',
                'Karena kesalahan cetak',
              ],
              answer: 1,
              explain: 'ㅇ diam di awal blok, tapi berbunyi "ng" sebagai batchim: 강 = gang.',
            },
          ],
        },
      ],
    },
    2: {
      id: 'kr-g2-gate',
      title: 'Kuis Gerbang 2',
      subtitle: 'Kata inti — dua sistem angka & kata bantu',
      level: 'Level 1',
      badge: '관문2',
      lessons: [
        {
          id: 'kr-g2-gate-l1',
          title: 'Kuis Gerbang 2',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'membaca',
              prompt: '"Jam 3 lewat 30 menit" dalam bahasa Korea?',
              options: ['삼 시 삼십 분', '세 시 삼십 분', '세 시 서른 분', '삼 시 서른 분'],
              answer: 1,
              explain: 'Jam pakai angka ASLI Korea (세), menit pakai angka Tionghoa (삼십). Dua sistem dalam satu frasa.',
            },
            {
              id: 'g2', type: 'choice', skill: 'membaca',
              prompt: '"Satu apel" dalam bahasa Korea?',
              options: ['사과 하나 개', '사과 한 개', '한 사과 개', '개 한 사과'],
              answer: 1,
              explain: '하나 memendek jadi 한 di depan kata bantu. Urutan: benda → angka → kata bantu.',
            },
            {
              id: 'g3', type: 'sort', skill: 'membaca',
              prompt: 'Sistem angka mana yang dipakai?',
              buckets: ['Asli Korea 고유어', 'Asal Tionghoa 한자어'],
              items: [
                { text: 'Usia (스무 살)', bucket: 0 },
                { text: 'Jam (세 시)', bucket: 0 },
                { text: 'Menit (삼십 분)', bucket: 1 },
                { text: 'Uang (오천 원)', bucket: 1 },
              ],
              explain: 'Yang bisa "dihitung dengan jari" → asli Korea. Satuan formal → Tionghoa.',
            },
            {
              id: 'g4', type: 'match', skill: 'membaca',
              prompt: 'Pasangkan kata bantu dengan bendanya.',
              pairs: [
                ['마리', 'hewan'],
                ['권', 'buku'],
                ['장', 'benda datar'],
                ['분', 'orang (hormat)'],
              ],
              explain: 'Konsepnya sama dengan "ekor / helai / buah" di Bahasa Indonesia.',
            },
          ],
        },
      ],
    },
    4: {
      id: 'kr-g4-gate',
      title: 'Kuis Gerbang 4',
      subtitle: 'Produksi — struktur esai 쓰기',
      level: 'Level 4',
      badge: '관문4',
      lessons: [
        {
          id: 'kr-g4-gate-l1',
          title: 'Kuis Gerbang 4',
          kind: 'gate',
          xp: 45,
          exercises: [
            {
              id: 'g1', type: 'order', skill: 'menulis',
              prompt: 'Susun struktur esai 쓰기 54.',
              chunks: ['서론 — pengantar', '본론 1 — argumen pertama', '본론 2 — argumen kedua', '결론 — simpulan'],
              answer: [0, 1, 2, 3],
              explain: 'Struktur ini dinilai secara eksplisit. Kerangka dihafal, isinya baru dipikirkan saat ujian.',
            },
            {
              id: 'g2', type: 'choice', skill: 'menulis',
              prompt: 'Esai soal 54 WAJIB memakai tingkat tutur apa?',
              options: ['해요체', '하십시오체', '해라체 (-다/-는다)', '반말'],
              answer: 2,
              explain: '해라체 adalah bentuk TULISAN. Memakai 해요체 memotong skor secara signifikan.',
            },
            {
              id: 'g3', type: 'choice', skill: 'menulis',
              prompt: 'Soal 54 bernilai berapa poin dari total 300?',
              options: ['10', '30', '50', '100'],
              answer: 2,
              explain: '50 poin — hampir 17% total. Inilah pembeda Level 5–6.',
            },
            {
              id: 'g4', type: 'order', skill: 'menulis',
              prompt: 'Susun: "Saya makan nasi."',
              chunks: ['저는', '밥을', '먹어요'],
              answer: [0, 1, 2],
              explain: 'SOV — kata kerja selalu di akhir, sama seperti Jepang.',
            },
          ],
        },
      ],
    },
  },

  /* =============================== INGGRIS =============================== */
  en: {
    0: {
      id: 'en-g0-gate',
      title: 'Kuis Gerbang 0',
      subtitle: 'Sistem bunyi — fonem & connected speech',
      level: 'B1',
      badge: 'Gate 0',
      lessons: [
        {
          id: 'en-g0-gate-l1',
          title: 'Kuis Gerbang 0',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'berbicara',
              prompt: 'Bagaimana mengucapkan /θ/ pada "think"?',
              options: ['Seperti "t"', 'Seperti "s"', 'Julurkan lidah di antara gigi', 'Seperti "f"'],
              answer: 2,
              explain: 'Bunyi interdental. Mengganti dengan "t" adalah pola transfer paling umum dari Bahasa Indonesia.',
            },
            {
              id: 'g2', type: 'choice', skill: 'berbicara',
              display: 'comfortable', prompt: 'Di mana penekanannya?',
              options: ['comFORtable', 'COMfortable', 'comforTAble', 'comfortaBLE'],
              answer: 1,
              explain: 'Penekanan salah membuat kata sulit dikenali meski bunyinya benar.',
            },
            {
              id: 'g3', type: 'match', skill: 'menyimak',
              prompt: 'Pasangkan proses connected speech dengan contohnya.',
              pairs: [
                ['Linking', 'an apple → "a-napple"'],
                ['Elision', 'next day → "nex day"'],
                ['Weak form', 'a cup of tea → "a cup ə tea"'],
              ],
              explain: 'Penutur asli tidak bicara "terlalu cepat" — kata-katanya menyatu dan sebagian bunyi hilang.',
            },
            {
              id: 'g4', type: 'judge', skill: 'berbicara',
              statement: 'Untuk mendapat band Pronunciation tinggi, Anda perlu menghilangkan aksen Indonesia.',
              answer: false,
              explain: 'Yang dinilai kejelasan, penekanan, dan intonasi — bukan aksen. Aksen Indonesia yang jelas bisa band 8.',
            },
          ],
        },
      ],
    },
    2: {
      id: 'en-g2-gate',
      title: 'Kuis Gerbang 2',
      subtitle: 'Kosakata akademik & collocation',
      level: 'B2',
      badge: 'Gate 2',
      lessons: [
        {
          id: 'en-g2-gate-l1',
          title: 'Kuis Gerbang 2',
          kind: 'gate',
          xp: 40,
          exercises: [
            {
              id: 'g1', type: 'choice', skill: 'menulis',
              prompt: 'Collocation akademik untuk "melakukan penelitian"?',
              options: ['do research', 'make research', 'conduct research', 'take research'],
              answer: 2,
              explain: '"conduct research" adalah collocation baku.',
            },
            {
              id: 'g2', type: 'match', skill: 'menulis',
              prompt: 'Pasangkan versi lemah dengan versi akademik.',
              pairs: [
                ['big problem', 'pressing concern'],
                ['get results', 'obtain results'],
                ['very important', 'of paramount importance'],
                ['talk about', 'address'],
              ],
              explain: 'Empat penggantian ini saja menaikkan kesan Lexical Resource secara terukur.',
            },
            {
              id: 'g3', type: 'choice', skill: 'menulis',
              prompt: 'Keterampilan tunggal paling menentukan di IELTS DAN TOEFL?',
              options: ['Menghafal esai', 'Parafrase', 'Menulis cepat', 'Menghafal idiom'],
              answer: 1,
              explain: 'Parafrase dipakai di keempat bagian sekaligus. Menghafal esai justru berbahaya.',
            },
            {
              id: 'g4', type: 'choice', skill: 'menulis',
              prompt: 'Mana yang lebih baik untuk Lexical Resource?',
              options: [
                'Sepuluh kata C2 yang dipakai kira-kira',
                'Kosakata B2 yang tepat + beberapa kata C1 yang benar-benar dikuasai',
                'Kalimat sepanjang mungkin',
                'Mengulang kata dari soal',
              ],
              answer: 1,
              explain: 'Akurasi > kerumitan. Satu kata C2 yang salah konteks merugikan lebih dari sepuluh kata B2 yang tepat.',
            },
          ],
        },
      ],
    },
    3: {
      id: 'en-g3-gate',
      title: 'Kuis Gerbang 3',
      subtitle: 'Tata bahasa — artikel, kala, struktur C1',
      level: 'C1',
      badge: 'Gate 3',
      lessons: [
        {
          id: 'en-g3-gate-l1',
          title: 'Kuis Gerbang 3',
          kind: 'gate',
          xp: 50,
          exercises: [
            {
              id: 'g1', type: 'fill', skill: 'menulis',
              prompt: 'Lengkapi artikelnya.',
              sentence: 'I saw ___ dog. ___ dog was barking.',
              bank: ['a', 'the', 'an'],
              answers: ['a', 'the'],
              explain: 'Penyebutan pertama "a" (pembaca belum tahu), penyebutan kedua "the" (sekarang sudah tahu yang mana).',
            },
            {
              id: 'g2', type: 'choice', skill: 'menulis',
              prompt: 'Mana yang BENAR?',
              options: [
                'I have seen him yesterday',
                'I saw him yesterday',
                'I have saw him yesterday',
                'I was seeing him yesterday',
              ],
              answer: 1,
              explain: 'Begitu waktunya disebut dan sudah selesai, wajib past simple.',
            },
            {
              id: 'g3', type: 'choice', skill: 'menulis',
              prompt: 'Bentuk inversi yang benar dari "I have never seen such a thing."',
              options: [
                'Never I have seen such a thing',
                'Never have I seen such a thing',
                'Never did I have seen such a thing',
                'Never seen have I such a thing',
              ],
              answer: 1,
              explain: 'Setelah adverbia negatif di awal, subjek dan auxiliary BERTUKAR posisi.',
            },
            {
              id: 'g4', type: 'sort', skill: 'menulis',
              prompt: 'Terhitung atau tak terhitung?',
              buckets: ['Terhitung', 'Tak terhitung'],
              items: [
                { text: 'suggestion', bucket: 0 },
                { text: 'student', bucket: 0 },
                { text: 'advice', bucket: 1 },
                { text: 'information', bucket: 1 },
                { text: 'equipment', bucket: 1 },
              ],
              explain: '"suggestion" terhitung tapi "advice" tidak — tidak ada logika yang memprediksinya, hafal per kata.',
            },
            {
              id: 'g5', type: 'choice', skill: 'menulis',
              prompt: 'Perbaiki: "I am interested with music."',
              options: ['interested on', 'interested in', 'interested to', 'interested about'],
              answer: 1,
              explain: '"interested IN" — kesalahan ini berasal dari terjemahan harfiah "tertarik dengan".',
            },
            {
              id: 'g6', type: 'choice', skill: 'menulis',
              prompt: '"12 tenses" sebenarnya adalah…',
              options: [
                '12 bentuk yang tidak berhubungan',
                '3 kala × 4 aspek — dua keputusan, bukan dua belas hafalan',
                '6 kala × 2 aspek',
                'Hanya 3 yang dipakai',
              ],
              answer: 1,
              explain: 'Pilih kalanya (kapan), lalu aspeknya (bagaimana peristiwa itu dilihat).',
            },
          ],
        },
      ],
    },
    4: {
      id: 'en-g4-gate',
      title: 'Kuis Gerbang 4',
      subtitle: 'Produksi — Writing & Speaking',
      level: 'B2',
      badge: 'Gate 4',
      lessons: [
        {
          id: 'en-g4-gate-l1',
          title: 'Kuis Gerbang 4',
          kind: 'gate',
          xp: 45,
          exercises: [
            {
              id: 'g1', type: 'order', skill: 'menulis',
              prompt: 'Susun pola pengembangan paragraf CEED.',
              chunks: ['Claim — topic sentence', 'Explanation — mengapa demikian', 'Example — contoh konkret', 'Development — dampaknya'],
              answer: [0, 1, 2, 3],
              explain: 'CEED mengisi paragraf ±90 kata tanpa mengulang ide.',
            },
            {
              id: 'g2', type: 'choice', skill: 'menulis',
              prompt: 'IELTS Task 1 tanpa overview mendapat maksimal band berapa?',
              options: ['Band 7', 'Band 6', 'Band 5', 'Tidak ada penalti'],
              answer: 2,
              explain: 'Task Achievement dibatasi band 5 — berapa pun bagusnya bahasanya.',
            },
            {
              id: 'g3', type: 'choice', skill: 'menulis',
              prompt: 'Kesalahan fatal di TOEFL Integrated Writing?',
              options: ['Terlalu banyak kata', 'Memasukkan OPINI PRIBADI', 'Memakai kalimat pasif', 'Menulis empat paragraf'],
              answer: 1,
              explain: 'Tugasnya merangkum kuliah dan MENGONTRASKANNYA dengan bacaan. Opini pribadi tidak dinilai.',
            },
            {
              id: 'g4', type: 'choice', skill: 'berbicara',
              prompt: 'IELTS Part 2: kehabisan bahan di detik ke-80 dari 120. Apa yang dilakukan?',
              options: [
                'Berhenti bicara',
                'Tambahkan pengandaian: "If I had more time, I\'d also…"',
                'Ulangi apa yang sudah dikatakan',
                'Minta pertanyaan lain',
              ],
              answer: 1,
              explain: 'Berhenti lebih awal memotong Fluency. Pengandaian sekaligus menunjukkan penguasaan conditional.',
            },
            {
              id: 'g5', type: 'choice', skill: 'berbicara',
              prompt: 'Kenapa jawaban singkat memotong skor di IELTS Speaking?',
              options: [
                'Karena penguji tidak suka',
                'Karena Fluency dinilai dari kemampuan bicara panjang & terhubung — penguji INGIN Anda bicara panjang',
                'Karena waktunya harus habis',
                'Karena jawaban singkat pasti salah',
              ],
              answer: 1,
              explain: 'Dalam budaya Indonesia menjawab singkat dianggap sopan. Di IELTS itu justru merugikan.',
            },
          ],
        },
      ],
    },
  },
}
