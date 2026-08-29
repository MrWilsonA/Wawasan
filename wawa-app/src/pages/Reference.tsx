import { useState } from 'react'
import { Callout, Card, Chip, DataTable, SectionTitle, Tabs } from '@/components/ui'
import {
  CEFR_MASTER, CEFR_CAVEAT, JLPT_LEVELS, HSK_20, HSK_30, HSK_DELTA, HSK_TIMELINE,
  TOPIK_LEVELS, TOPIK_SPEAKING, TOPIK_WRITING_TASKS, IELTS_BANDS, CROSS_CONVERSION,
  IELTS_VS_TOEFL, CHOOSE_EXAM, MULTILANG_PATH, MULTILANG_RULE, ENTRY_POINTS,
  OFFICIAL_SOURCES, ACCURACY_NOTES, DOC_VERSION,
} from '@/data/reference'

type Tab = 'induk' | 'jlpt' | 'hsk' | 'topik' | 'inggris' | 'jalur'

export default function Reference() {
  const [tab, setTab] = useState<Tab>('induk')
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow={`Versi dokumen ${DOC_VERSION.version} · diverifikasi ${DOC_VERSION.verified}`}
        title="Referensi"
        sub="Seluruh tabel perbandingan dan skor, dalam satu tempat."
      />
      <Tabs
        tabs={[
          { id: 'induk' as const, label: '🌐 Tabel induk' },
          { id: 'jlpt' as const, label: '🇯🇵 JLPT' },
          { id: 'hsk' as const, label: '🇨🇳 HSK' },
          { id: 'topik' as const, label: '🇰🇷 TOPIK' },
          { id: 'inggris' as const, label: '🇬🇧 IELTS & TOEFL' },
          { id: 'jalur' as const, label: '🧭 Jalur' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'induk' ? <Induk /> : null}
      {tab === 'jlpt' ? <Jlpt /> : null}
      {tab === 'hsk' ? <Hsk /> : null}
      {tab === 'topik' ? <Topik /> : null}
      {tab === 'inggris' ? <Inggris /> : null}
      {tab === 'jalur' ? <Jalur /> : null}

      <Card tone="cream">
        <SectionTitle eyebrow="Catatan akurasi" title="Tiga hal yang berubah cepat" />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {ACCURACY_NOTES.map((n) => (
            <div key={n.title} className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3.5">
              <div className="font-display text-[14px] font-extrabold text-amber-600">{n.title}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{n.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink-faint">Sumber resmi:</span>
          {OFFICIAL_SOURCES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border-2 border-sand bg-white px-3 py-1 text-[12px] font-extrabold text-teal-600 underline-offset-2 hover:underline"
            >
              {s.name} ↗
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Induk() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          eyebrow="CEFR"
          title="Tabel Induk — perbandingan semua ujian"
          sub="Menyelaraskan seluruh sistem sertifikasi terhadap CEFR, standar acuan internasional."
        />
        <DataTable
          head={['CEFR', 'Deskripsi', '🇯🇵 JLPT', '🇨🇳 HSK 2.0', '🇨🇳 HSK 3.0', '🇰🇷 TOPIK', '🇬🇧 IELTS', '🇺🇸 TOEFL baru', 'TOEFL lama']}
          rows={CEFR_MASTER.map((r) => [
            <strong key="c" className="text-ink">{r.cefr}</strong>,
            r.desc, r.jlpt, r.hsk2, r.hsk3, r.topik, r.ielts, r.toeflNew, r.toeflOld,
          ])}
          dense
        />
        <Callout kind="warning" title="Penting">{CEFR_CAVEAT}</Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="Titik masuk" title="Untuk siapa platform ini" />
        <DataTable
          head={['Profil pelajar', 'Titik masuk']}
          rows={ENTRY_POINTS.map((e) => [e.profile, e.entry])}
          dense
        />
        <p className="mt-3 rounded-2xl border-2 border-teal-200 bg-teal-50 p-3.5 text-[13.5px] text-ink-soft">
          <strong className="text-ink">Prasyarat teknis:</strong> hanya kemauan + kemampuan baca Bahasa
          Indonesia. Tidak ada prasyarat bahasa asing apa pun.
        </p>
      </Card>
    </div>
  )
}

function Jlpt() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle eyebrow="日本語能力試験" title="JLPT — semua level" />
        <DataTable
          head={['Level', 'Kanji', 'Kosakata', 'Jam belajar*', 'Total', 'Lulus', 'Minimum per bagian', 'Waktu']}
          rows={JLPT_LEVELS.map((l) => [
            <strong key="l" className="text-ink">{l.level}</strong>,
            l.kanji, l.vocab, l.hours, String(l.total),
            <span key="p" className="font-display font-extrabold text-ink">{l.pass}</span>,
            l.sections, l.time,
          ])}
          dense
        />
        <Callout kind="warning" title="Jebakan skor bagian">
          N1 dengan total <strong className="text-ink">130</strong> tetap{' '}
          <strong className="text-ink">GAGAL</strong> jika nilai Simak hanya 18. Ambang bagian bersifat mutlak.
        </Callout>
        <Callout kind="tip" title="Sertifikat berlaku seumur hidup">
          JLPT tidak kedaluwarsa — berbeda dengan IELTS, TOEFL, dan TOPIK yang berlaku 2 tahun.
        </Callout>
      </Card>
    </div>
  )
}

function Hsk() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          eyebrow="Situasi 2026"
          title="HSK 2.0 vs HSK 3.0"
          sub="Bagian paling membingungkan bagi calon peserta ujian saat ini. Baca sebelum mendaftar."
        />
        <div className="mb-4">
          <DataTable head={['Tahun', 'Peristiwa']} rows={HSK_TIMELINE.map((t) => [<strong key="y" className="text-ink">{t.year}</strong>, t.event])} dense />
        </div>
        <Callout kind="warning" title="Sebelum mendaftar, tanyakan ke pusat ujian">
          “Sesi ini memakai daftar kosakata HSK 2.0 atau 3.0?” — jawaban ini menentukan berapa kata yang
          harus Anda hafalkan. Selisihnya bisa <strong className="text-ink">ratusan kata</strong>.
        </Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="Sistem lama" title="HSK 2.0 — masih dipakai untuk ujian reguler 2026" />
        <DataTable
          head={['Level', 'Kosakata', 'Karakter', 'Total', 'Lulus', 'Struktur', 'Waktu', 'CEFR']}
          rows={HSK_20.map((h) => [
            <strong key="l" className="text-ink">{h.level}</strong>,
            h.vocab, h.chars, String(h.total), String(h.pass), h.structure, h.time, h.cefr,
          ])}
          dense
        />
        <p className="mt-2 text-[12px] text-ink-faint">
          HSK 1 &amp; 2 memakai pinyin di seluruh soal. Sejak HSK 3, pinyin dihilangkan sepenuhnya.
        </p>
      </Card>

      <Card>
        <SectionTitle eyebrow="Silabus revisi Nov 2025, berlaku Juli 2026" title="HSK 3.0" />
        <DataTable
          head={['Level', 'Tahap', 'Kosakata', 'Karakter', 'Tulis tangan', 'Tata bahasa', 'CEFR']}
          rows={HSK_30.map((h) => [
            <strong key="l" className="text-ink">{h.level}</strong>,
            h.stage, h.vocab, h.chars, h.hand, h.grammar, h.cefr,
          ])}
          dense
        />
        <Callout kind="warning" title="HSK 7-9 adalah SATU ujian">
          Anda mengikuti satu tes, dan skor akhir menentukan Anda mendapat sertifikat level 7, 8, atau 9.
          Penilaiannya memakai <em>item response theory</em>. Komponen{' '}
          <strong className="text-ink">翻译 Terjemah</strong> dan <strong className="text-ink">口语 Berbicara</strong>{' '}
          adalah tambahan baru yang tidak ada di HSK 2.0.
        </Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="Selisih" title="Berapa kata baru per level" />
        <DataTable
          head={['Naik dari → ke', 'HSK 2.0', 'HSK 3.0 (revisi)']}
          rows={HSK_DELTA.map((d) => [d.step, d.v20, d.v30])}
          dense
        />
        <Callout kind="warning" title="Lompatan HSK 6 → 7-9 adalah +5.600 kata">
          Lebih besar dari seluruh perjalanan HSK 1 sampai 6 <em>digabung</em>. Rencanakan minimal{' '}
          <strong className="text-ink">2–3 tahun</strong> untuk lompatan ini.
        </Callout>
      </Card>
    </div>
  )
}

function Topik() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle eyebrow="한국어능력시험" title="Ambang skor per level" />
        <DataTable
          head={['Ujian', 'Level', 'Skor PBT', 'Skor IBT', 'CEFR (indikatif)']}
          rows={TOPIK_LEVELS.map((t) => [
            t.exam, <strong key="l" className="text-ink">{t.level}</strong>, t.pbt, t.ibt, t.cefr,
          ])}
          dense
        />
        <Callout kind="tip" title="Anda memilih UJIAN, bukan level">
          Anda memilih TOPIK I atau II, dan skor menentukan level yang diperoleh. Di bawah ambang minimum ={' '}
          <strong className="text-ink">불합격</strong> (tidak bersertifikat), bukan “gagal level tertentu”.
        </Callout>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Ujian terpisah" title="TOPIK 말하기 (Speaking)" />
          <DataTable head={['Level', 'Skor (total 200)']} rows={TOPIK_SPEAKING.map((s) => [s.level, s.score])} dense />
          <p className="mt-2 text-[12.5px] text-ink-faint">
            6 tugas / 30 menit. Pendaftaran &amp; jadwal sendiri — tidak otomatis termasuk TOPIK I/II.
          </p>
        </Card>

        <Card>
          <SectionTitle eyebrow="쓰기 — pembeda Level 5–6" title="Empat soal menulis" />
          <DataTable
            head={['Soal', 'Jenis', 'Skor', 'Strategi']}
            rows={TOPIK_WRITING_TASKS.map((t) => [t.no, t.type, String(t.score), t.strategy])}
            dense
          />
        </Card>
      </div>

      <Callout kind="warning" title="Ambang umum yang diminta institusi">
        Universitas Korea umumnya minta <strong className="text-ink">Level 3–4</strong> untuk masuk,{' '}
        <strong className="text-ink">Level 4–6</strong> untuk lulus; visa kerja E-7 sering minta Level 3+.
        Sertifikat berlaku <strong className="text-ink">2 tahun</strong> sejak tanggal pengumuman.
      </Callout>
    </div>
  )
}

function Inggris() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle eyebrow="Memilih" title="IELTS atau TOEFL?" />
        <DataTable
          head={['Aspek', 'IELTS Academic', 'TOEFL iBT']}
          rows={IELTS_VS_TOEFL.map((r) => [<strong key="a" className="text-ink">{r.aspect}</strong>, r.ielts, r.toefl])}
          dense
        />
        <div className="mt-4">
          <DataTable head={['Profil Anda', 'Rekomendasi']} rows={CHOOSE_EXAM.map((c) => [c.profile, c.pick])} dense />
        </div>
        <Callout kind="tip" title="Langkah pertama yang wajib">
          Cek persyaratan resmi institusi tujuan Anda sebelum memilih. Banyak universitas menerima keduanya
          tetapi dengan ambang yang <strong className="text-ink">tidak setara</strong>.
        </Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="0–9" title="Deskripsi resmi setiap band IELTS" />
        <div className="space-y-2">
          {IELTS_BANDS.map((b) => (
            <div key={b.band} className="flex gap-3 rounded-2xl border-2 border-sand bg-white p-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-teal-200 bg-teal-50 font-display text-xl font-extrabold text-teal-700">
                {b.band}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15px] font-extrabold text-ink">{b.name}</span>
                  <Chip size="sm" color="ink">{b.cefr}</Chip>
                </div>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          eyebrow="Konversi silang"
          title="IELTS ↔ TOEFL ↔ CEFR"
          sub="Tabel konversi antar-ujian selalu perkiraan — keduanya mengukur hal yang tidak sepenuhnya sama."
        />
        <DataTable
          head={['CEFR', 'IELTS', 'TOEFL baru (1–6)', 'TOEFL lama (0–120)', 'Kemampuan']}
          rows={CROSS_CONVERSION.map((c) => [
            <strong key="c" className="text-ink">{c.cefr}</strong>,
            c.ielts, c.toeflNew, c.toeflOld, c.ability,
          ])}
          dense
        />
        <Callout kind="warning" title="Jangan pakai tabel ini sebagai pengganti persyaratan resmi">
          IELTS punya lebih banyak jenis soal; TOEFL lebih akademik-Amerika. Selalu periksa apa yang diminta
          institusi tujuan Anda.
        </Callout>
      </Card>
    </div>
  )
}

function Jalur() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          eyebrow="Jika belajar lebih dari satu"
          title="Peta jalur multi-bahasa 5 tahun"
        />
        <DataTable
          head={['Tahun', 'Bahasa utama', 'Bahasa pendamping', 'Target akhir tahun']}
          rows={MULTILANG_PATH.map((m) => [
            <strong key="y" className="text-ink">Tahun {m.year}</strong>,
            m.main, m.side, m.target,
          ])}
          dense
        />
        <Callout kind="warning" title="Aturan emas multi-bahasa">{MULTILANG_RULE}</Callout>
      </Card>

      <Card>
        <SectionTitle
          eyebrow="Bonus lintas bahasa"
          title="Kenapa urutan belajar itu penting"
          sub="±60–70% kosakata Korea berakar hanja — porsi yang setara kata Latin/Yunani dalam bahasa Inggris."
        />
        <DataTable
          head={['Hanja', 'Korea', 'Jepang', 'Mandarin', 'Arti']}
          cjkCols={[0, 1, 2, 3]}
          rows={[
            ['學校 / 学校', '학교 hakgyo', 'がっこう gakkō', 'xuéxiào', 'sekolah'],
            ['時間', '시간 sigan', 'じかん jikan', 'shíjiān', 'waktu'],
            ['圖書館', '도서관 doseogwan', 'としょかん toshokan', 'túshūguǎn', 'perpustakaan'],
            ['家族', '가족 gajok', 'かぞく kazoku', 'jiāzú', 'keluarga'],
            ['準備', '준비 junbi', 'じゅんび junbi', 'zhǔnbèi', 'persiapan'],
            ['無理', '무리 muri', 'むり muri', 'wúlǐ', 'mustahil/paksa'],
            ['記憶', '기억 gieok', 'きおく kioku', 'jìyì', 'ingatan'],
            ['運動', '운동 undong', 'うんどう undō', 'yùndòng', 'olahraga'],
          ]}
          dense
        />
        <Callout kind="tip" title="Alasan strategis urutan belajar WAWAさん">
          Belajar Jepang atau Mandarin <strong className="text-ink">lebih dulu</strong> memberi diskon besar
          saat masuk ke Korea — ribuan kosakata terasa familiar. Sebaliknya juga berlaku.
        </Callout>
      </Card>
    </div>
  )
}
