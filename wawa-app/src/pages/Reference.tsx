import { useEffect, useState } from 'react'
import { Callout, Card, Chip, DataTable, Icon, SectionTitle, Tabs, cx } from '@/components/ui'
import {
  CEFR_MASTER, CEFR_CAVEAT, JLPT_LEVELS, HSK_20, HSK_30, HSK_DELTA, HSK_TIMELINE,
  TOPIK_LEVELS, TOPIK_SPEAKING, TOPIK_WRITING_TASKS, IELTS_BANDS, CROSS_CONVERSION,
  IELTS_VS_TOEFL, CHOOSE_EXAM, MULTILANG_PATH, MULTILANG_RULE, ENTRY_POINTS,
  OFFICIAL_SOURCES, ACCURACY_NOTES, DOC_VERSION,
} from '@/data/reference'
import { LANGUAGE_HANDBOOKS, type CountryHandbook, type HandbookChapter } from '@/data/handbooks'
import { useProgress } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import type { LangId } from '@/data/types'
import { playSound } from '@/lib/sound'

type Tab = 'buku' | 'induk' | 'jlpt' | 'hsk' | 'topik' | 'inggris' | 'jalur'
const DEFAULT_REFERENCE: Record<LangId, Tab> = { jp: 'jlpt', cn: 'hsk', kr: 'topik', en: 'inggris' }

export default function Reference() {
  const activeLang = useProgress((s) => s.activeLang)
  const [tab, setTab] = useState<Tab>('buku')

  const current = DEFAULT_REFERENCE[activeLang]

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow={`Versi Dokumen ${DOC_VERSION.version} · Diverifikasi ${DOC_VERSION.verified}`}
        title="Buku Panduan & Referensi Bahasa"
        sub="Ensiklopedia lengkap perbandingan bahasa, sejarah fonetik, tabel sertifikasi, dan skor internasional."
      />

      <Tabs
        tabs={[
          { id: 'buku' as const, label: '📖 Buku Panduan 4 Negara (Ensiklopedia)', icon: 'words' as const },
          { id: current, label: current === 'inggris' ? 'Sertifikasi IELTS & TOEFL' : `Sertifikasi ${current.toUpperCase()}` },
          { id: 'induk' as const, label: 'Tabel Induk CEFR' },
          { id: 'jalur' as const, label: 'Jalur & Sumber' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'buku' ? <HandbookReader initialLang={activeLang} /> : null}
      {tab === 'induk' ? <Induk /> : null}
      {tab === 'jlpt' ? <Jlpt /> : null}
      {tab === 'hsk' ? <Hsk /> : null}
      {tab === 'topik' ? <Topik /> : null}
      {tab === 'inggris' ? <Inggris /> : null}
      {tab === 'jalur' ? <Jalur /> : null}

      <Card tone="cream">
        <SectionTitle eyebrow="Catatan Akurasi" title="Tiga Hal yang Berubah Cepat" />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {ACCURACY_NOTES.map((n) => (
            <div key={n.title} className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3.5">
              <div className="font-display text-[14px] font-extrabold text-amber-900">{n.title}</div>
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
              className="rounded-full border-2 border-sand bg-paper px-3 py-1 text-[12px] font-extrabold text-teal-600 underline-offset-2 hover:underline"
            >
              {s.name} ↗
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* =====================================================================
   HANDBOOK READER (Buku Ensiklopedia 4 Negara)
   ===================================================================== */
function HandbookReader({ initialLang }: { initialLang: LangId }) {
  const [selectedLang, setSelectedLang] = useState<LangId>(initialLang)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)

  const handbook: CountryHandbook = LANGUAGE_HANDBOOKS[selectedLang] || LANGUAGE_HANDBOOKS.jp
  const chapters = handbook.chapters || []
  const chapter: HandbookChapter | undefined = chapters[activeChapterIndex] || chapters[0]

  useEffect(() => {
    setActiveChapterIndex(0)
  }, [selectedLang])

  return (
    <div className="space-y-6">
      {/* Country Selector Header */}
      <Card className="!p-4 bg-paper border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="words" size={20} className="text-teal-600" />
            <span className="font-display text-[15px] font-black text-ink">
              Pilih Buku Ensiklopedia Negara:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['jp', 'cn', 'kr', 'en'] as const).map((lId) => {
              const l = LANGUAGES[lId]
              const isSelected = lId === selectedLang
              return (
                <button
                  key={lId}
                  type="button"
                  onClick={() => {
                    playSound('tap')
                    setSelectedLang(lId)
                  }}
                  className={cx(
                    'rounded-xl border-2 px-3.5 py-1.5 font-display text-[13px] font-black transition-all cursor-pointer',
                    isSelected
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-[0_2px_0_0_var(--color-teal-700)] -translate-y-0.5'
                      : 'border-sand bg-cream text-ink-soft hover:bg-paper hover:text-ink',
                  )}
                >
                  {l.name} ({l.nativeName})
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Book Cover Header Card */}
      <div className="rounded-3xl border-3 border-teal-400 bg-gradient-to-br from-teal-50 via-paper to-sand/20 p-6 shadow-[0_6px_0_0_var(--color-teal-700)] space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm" color="teal" icon="words">{handbook.badge}</Chip>
          <span className="text-[12px] font-bold text-ink-faint">{chapters.length} Bab Komprehensif</span>
        </div>
        <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
          {handbook.title}
        </h2>
        <p className="text-[14px] font-medium leading-relaxed text-ink-soft max-w-3xl">
          {handbook.subtitle}
        </p>
        <div className="mt-2 text-[12px] italic text-ink-faint border-t border-sand pt-2">
          Catatan Kuratorial: {handbook.authorNote}
        </div>
      </div>

      {/* Main Reader Grid: Chapter Index on Left, Deep Content on Right */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Column: Chapters Navigation */}
        <div className="space-y-2">
          <div className="text-[12px] font-extrabold uppercase tracking-wider text-ink-faint px-1">
            Daftar Isi Bab:
          </div>

          <div className="space-y-2">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeChapterIndex
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    playSound('tap')
                    setActiveChapterIndex(idx)
                  }}
                  className={cx(
                    'w-full text-left rounded-2xl border-2 p-3.5 transition-all cursor-pointer',
                    isActive
                      ? 'border-teal-500 bg-paper text-ink shadow-[0_4px_0_0_var(--color-teal-700)] -translate-y-0.5 ring-2 ring-teal-300'
                      : 'border-sand bg-cream/70 text-ink-soft hover:bg-paper hover:text-ink',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-800 text-[11px] font-black">
                      {idx + 1}
                    </span>
                    <span className="font-display text-[13.5px] font-black truncate text-ink">
                      {ch.title}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-ink-soft leading-snug line-clamp-2 pl-8">
                    {ch.subtitle}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Chapter Content */}
        {chapter ? (
          <Card className="border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)] space-y-6">
            <div className="border-b-2 border-sand pb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-700">
                Bab {activeChapterIndex + 1} dari {chapters.length}
              </span>
              <h3 className="mt-1 font-display text-2xl font-black text-ink">
                {chapter.title}
              </h3>
              <p className="text-[14px] font-bold text-ink-soft">{chapter.subtitle}</p>
            </div>

            {/* Summary Box */}
            <div className="rounded-2xl border-2 border-sand bg-shell p-4 text-[13.5px] font-medium leading-relaxed text-ink">
              <strong className="text-teal-900 block font-display text-[14px] font-bold mb-1">
                Ringkasan Bab Ini:
              </strong>
              {chapter.content.summary}
            </div>

            {/* Sub-sections */}
            <div className="space-y-6">
              {chapter.content.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h4 className="font-display text-[17px] font-black text-ink">
                    {sec.heading}
                  </h4>
                  <p className="text-[14px] leading-relaxed text-ink-soft font-normal whitespace-pre-line">
                    {sec.body}
                  </p>

                  {/* Optional Table */}
                  {sec.table ? (
                    <div className="overflow-x-auto rounded-2xl border border-sand bg-paper mt-3 shadow-sm">
                      <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-sand bg-cream font-display font-black text-ink">
                          <tr>
                            {sec.table.head.map((h, hi) => (
                              <th key={hi} className="p-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sand/70">
                          {sec.table.rows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-cream/40 transition-colors">
                              {row.map((cell, ci) => (
                                <td key={ci} className="p-3 font-medium text-ink-soft">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {/* Optional Callout */}
                  {sec.callout ? (
                    <Callout kind={sec.callout.kind === 'warning' ? 'warning' : 'tip'} title={sec.callout.title}>
                      {sec.callout.text}
                    </Callout>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Bottom Chapter Pagination Bar */}
            <div className="flex items-center justify-between border-t border-sand pt-4">
              <button
                type="button"
                disabled={activeChapterIndex <= 0}
                onClick={() => {
                  playSound('tap')
                  setActiveChapterIndex((i) => Math.max(0, i - 1))
                }}
                className="flex items-center gap-1.5 rounded-xl border-2 border-sand bg-paper px-4 py-2 text-[13px] font-black text-ink disabled:opacity-30 hover:bg-cream cursor-pointer"
              >
                <Icon name="left" size={14} />
                <span>Bab Sebelumnya</span>
              </button>

              <span className="text-[12px] font-extrabold text-ink-faint">
                Bab {activeChapterIndex + 1} / {chapters.length}
              </span>

              <button
                type="button"
                disabled={activeChapterIndex >= chapters.length - 1}
                onClick={() => {
                  playSound('tap')
                  setActiveChapterIndex((i) => Math.min(chapters.length - 1, i + 1))
                }}
                className="flex items-center gap-1.5 rounded-xl border-2 border-teal-500 bg-teal-50 px-4 py-2 text-[13px] font-black text-teal-900 disabled:opacity-30 hover:bg-teal-100 cursor-pointer"
              >
                <span>Bab Berikutnya</span>
                <Icon name="next" size={14} />
              </button>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   ORIGINAL REFERENCE TABS (Induk, JLPT, HSK, TOPIK, Inggris, Jalur)
   ------------------------------------------------------------------ */
function Induk() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          eyebrow="CEFR"
          title="Tabel Induk — Perbandingan Semua Ujian"
          sub="Menyelaraskan seluruh sistem sertifikasi terhadap CEFR, standar acuan internasional."
        />
        <DataTable
          head={['CEFR', 'Deskripsi', 'JLPT', 'HSK 2.0', 'HSK 3.0', 'TOPIK', 'IELTS', 'TOEFL baru', 'TOEFL lama']}
          rows={CEFR_MASTER.map((r) => [
            <strong key="c" className="text-ink">{r.cefr}</strong>,
            r.desc,
            r.jlpt,
            r.hsk2,
            r.hsk3,
            r.topik,
            r.ielts,
            r.toeflNew,
            r.toeflOld,
          ])}
          dense
        />
      </Card>
      <Callout kind="warning" title="Peringatan penting">{CEFR_CAVEAT}</Callout>
    </div>
  )
}

function Jlpt() {
  return (
    <Card>
      <SectionTitle eyebrow="Jepang" title="JLPT — Standar Kelulusan" sub="Minimal total 50–53% + minimal tiap bagian (biasanya 19/60)." />
      <DataTable
        head={['Level', 'Kanji', 'Kosakata', 'Jam belajar', 'Lulus / Total', 'Ambang per bagian', 'Waktu']}
        rows={JLPT_LEVELS.map((j) => [
          <strong key="l" className="text-ink">{j.level}</strong>,
          j.kanji,
          j.vocab,
          j.hours,
          `${j.pass} / ${j.total}`,
          j.sections,
          j.time,
        ])}
        dense
      />
    </Card>
  )
}

function Hsk() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Mandarin — standar lama (masih dipakai 2026)" title="HSK 2.0 — 6 Level" />
          <DataTable
            head={['Level', 'Kosakata', 'Karakter', 'Lulus / Total', 'Struktur']}
            rows={HSK_20.map((h) => [
              <strong key="l" className="text-ink">{h.level}</strong>,
              h.vocab,
              h.chars,
              `${h.pass}/${h.total}`,
              h.structure,
            ])}
            dense
          />
        </Card>

        <Card>
          <SectionTitle eyebrow="Mandarin — standar baru (mulai Juli 2026)" title="HSK 3.0 — 9 Level" />
          <DataTable
            head={['Level', 'Tahap', 'Kosakata', 'Karakter', 'Tulis tangan']}
            rows={HSK_30.map((h) => [
              <strong key="l" className="text-ink">{h.level}</strong>,
              h.stage,
              h.vocab,
              h.chars,
              h.hand,
            ])}
            dense
          />
        </Card>
      </div>

      <Card>
        <SectionTitle
          eyebrow="Lonjakan beban"
          title="Perbandingan Kosakata: HSK 2.0 vs 3.0"
          sub="HSK 3.0 menuntut lompatan jauh lebih besar di level menengah ke atas."
        />
        <DataTable
          head={['Lompatan', 'HSK 2.0', 'HSK 3.0']}
          rows={HSK_DELTA.map((d) => [<strong key="s" className="text-ink">{d.step}</strong>, d.v20, d.v30])}
          dense
        />
      </Card>

      <Card>
        <SectionTitle eyebrow="Garis waktu resmi" title="Kronologi Transisi HSK 2.0 → 3.0" />
        <DataTable
          head={['Tahun / Periode', 'Peristiwa']}
          rows={HSK_TIMELINE.map((t) => [<strong key="y" className="text-ink">{t.year}</strong>, t.event])}
          dense
        />
      </Card>
    </div>
  )
}

function Topik() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle eyebrow="Korea" title="TOPIK I & II — Sistem Skor Berjenjang" sub="Ujian sama; level ditentukan oleh skor yang diraih." />
        <DataTable
          head={['Ujian', 'Level', 'Skor PBT', 'Skor IBT', 'CEFR (indikatif)']}
          rows={TOPIK_LEVELS.map((t) => [
            t.exam,
            <strong key="l" className="text-ink">{t.level}</strong>,
            t.pbt,
            t.ibt,
            t.cefr,
          ])}
          dense
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Ujian terpisah" title="TOPIK 말하기 (Speaking)" />
          <DataTable head={['Level', 'Skor (total 200)']} rows={TOPIK_SPEAKING.map((s) => [s.level, s.score])} dense />
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
      </Card>

      <Card>
        <SectionTitle eyebrow="0–9" title="Deskripsi resmi setiap band IELTS" />
        <div className="space-y-2">
          {IELTS_BANDS.map((b) => (
            <div key={b.band} className="flex gap-3 rounded-2xl border-2 border-sand bg-paper p-3.5">
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
            c.ielts,
            c.toeflNew,
            c.toeflOld,
            c.ability,
          ])}
          dense
        />
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
            m.main,
            m.side,
            m.target,
          ])}
          dense
        />
        <Callout kind="warning" title="Aturan emas multi-bahasa">{MULTILANG_RULE}</Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="Titik Masuk" title="Rekomendasi Titik Masuk Belajar" />
        <DataTable
          head={['Profil Pelajar', 'Titik Masuk yang Dianjurkan']}
          rows={ENTRY_POINTS.map((e) => [
            <strong key="p" className="text-ink">{e.profile}</strong>,
            e.entry,
          ])}
          dense
        />
      </Card>
    </div>
  )
}
