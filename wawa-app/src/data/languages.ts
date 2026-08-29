import type { Language, LangId } from './types'

export const LANGUAGES: Record<LangId, Language> = {
  jp: {
    id: 'jp',
    name: 'Jepang',
    nativeName: '日本語',
    exam: 'JLPT',
    examFull: '日本語能力試験 — Japanese-Language Proficiency Test',
    levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
    color: '#e8564f',
    colorSoft: '#ffe7e5',
    tagline: 'Tiga aksara, satu logika',
    hookForIndonesians:
      'Vokal Jepang hampir identik dengan vokal Indonesia — tapi kita punya /ə/ yang tidak ada di Jepang, dan kita menghitung suku kata sementara Jepang menghitung mora.',
    script: 'Hiragana · Katakana · Kanji',
    wordOrder: 'SOV — kata kerja selalu di akhir',
  },
  cn: {
    id: 'cn',
    name: 'Mandarin',
    nativeName: '汉语',
    exam: 'HSK',
    examFull: '汉语水平考试 — Chinese Proficiency Test',
    levels: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7–9'],
    color: '#f5a623',
    colorSoft: '#fff2dc',
    tagline: '82% hanzi adalah rumus, bukan gambar',
    hookForIndonesians:
      'Urutan kata SVO sama dengan Bahasa Indonesia — kabar baik. Tapi Bahasa Indonesia tidak bernada, dan telinga kita tidak terlatih mendengar tinggi-rendah sebagai pembeda arti.',
    script: 'Hanzi 简体字',
    wordOrder: 'SVO — tapi keterangan selalu di DEPAN kata kerja',
  },
  kr: {
    id: 'kr',
    name: 'Korea',
    nativeName: '한국어',
    exam: 'TOPIK',
    examFull: '한국어능력시험 — Test of Proficiency in Korean',
    levels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'],
    color: '#4a7fe0',
    colorSoft: '#e6efff',
    tagline: 'Aksara yang dirancang, bukan diwariskan',
    hookForIndonesians:
      'Hangeul bisa dibaca dalam 90 menit. Tapi kemudahan itu berhenti di aksara: tiga tingkat konsonan (ㅂ/ㅍ/ㅃ) dan tujuh tingkat tutur tidak punya padanan di Bahasa Indonesia.',
    script: 'Hangeul 한글',
    wordOrder: 'SOV — sama seperti Jepang',
  },
  en: {
    id: 'en',
    name: 'Inggris',
    nativeName: 'English',
    exam: 'IELTS & TOEFL',
    examFull: 'IELTS Academic · TOEFL iBT (skala baru 1–6)',
    levels: ['B1', 'B2', 'C1', 'C2'],
    color: '#56bd3d',
    colorSoft: '#e9f8e4',
    tagline: 'Dari pasif kuat ke skor tinggi',
    hookForIndonesians:
      'Bahasa Indonesia tidak punya kala, artikel, jamak wajib, atau konjugasi — empat sumber kesalahan terbesar kita di IELTS/TOEFL, dan semuanya bisa dilatih terpisah.',
    script: 'Latin (dilewati)',
    wordOrder: 'SVO — 12 tenses + klausa',
  },
}

export const LANG_ORDER: LangId[] = ['jp', 'cn', 'kr', 'en']

export const langList = () => LANG_ORDER.map((id) => LANGUAGES[id])
