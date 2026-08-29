import { Link, useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Card, Chip, Icon, FlagIcon, ProgressBar, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { tint } from '@/lib/tint'
import type { LangId, Lesson, Unit, Gate } from '@/data/types'
import { gatesFor, gateStatus, GATE_PASS_PCT } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'
import { playSound } from '@/lib/sound'

const isLang = (v: string | undefined): v is LangId => !!v && ['jp', 'cn', 'kr', 'en'].includes(v)

type ViewMode = 'island' | 'road' | 'list'

// Island Map Coordinates for 6 Gate Nodes (x%, y%) following the winding road on the 3D island
const ISLAND_NODE_COORDS = [
  { left: '46%', top: '78%' }, // Gate 1: Entrance / Harbor / Base torii
  { left: '26%', top: '64%' }, // Gate 2: Schoolhouse / Lower-left path
  { left: '46%', top: '48%' }, // Gate 3: Mid-center plateau
  { left: '68%', top: '56%' }, // Gate 4: Tokyo Tower / Big Ben landmark on the right
  { left: '34%', top: '30%' }, // Gate 5: Pagoda / Castle / Train station on upper-left
  { left: '58%', top: '16%' }, // Gate 6: Mountain Summit / Great Wall / Final Peak
]

export default function Path() {
  const { lang: param } = useParams()
  const setActiveLang = useProgress((s) => s.setActiveLang)
  const completed = useProgress((s) => s.completed)

  const [viewMode, setViewMode] = useState<ViewMode>('island')
  const [selectedGateIndex, setSelectedGateIndex] = useState<number>(0)
  const [selectedUnitModal, setSelectedUnitModal] = useState<Unit | null>(null)

  useEffect(() => {
    if (isLang(param)) setActiveLang(param)
  }, [param, setActiveLang])

  if (!isLang(param)) return <Navigate to="/belajar/jp" replace />

  const lang = LANGUAGES[param]
  const gates = gatesFor(param)
  const statuses = gateStatus(param, completed)
  const unitOffsets = gates.map((_, gateIndex) =>
    gates.slice(0, gateIndex).reduce((total, gate) => total + gate.units.length, 0),
  )
  const currentLevelIndex = Math.max(0, statuses.findIndex((status) => status.unlocked && status.done < status.total))

  const selectedGate = gates[selectedGateIndex] || gates[0]
  const selectedStatus = statuses[selectedGateIndex] || statuses[0]

  const handleOpenLevelRoad = (gateIndex: number) => {
    playSound('tap')
    setSelectedGateIndex(gateIndex)
    setViewMode('road')
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="!p-0 overflow-hidden border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)]">
        <div className="flex flex-wrap items-center gap-4 p-5" style={{ backgroundColor: tint(lang.color) }}>
          <FlagIcon lang={param} size={42} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black leading-tight text-ink">
                {lang.name} <span className="font-cjk text-ink-soft">{lang.nativeName}</span>
              </h1>
              <Chip size="sm" color="teal">
                {lang.exam}
              </Chip>
            </div>
            <p className="text-[13.5px] font-medium text-ink-soft">{lang.examFull}</p>
          </div>

          {/* Level Badges */}
          <div className="flex flex-wrap gap-1.5">
            {lang.levels.map((lv) => (
              <span
                key={lv}
                className="rounded-full border-2 bg-paper px-3 py-1 text-[11.5px] font-black shadow-[0_2px_0_0_var(--color-drop)]"
                style={{ borderColor: lang.color, color: lang.color }}
              >
                {lv}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-sand bg-paper p-4 text-[13.5px] leading-relaxed text-ink-soft">
          <strong className="text-ink">Kunci untuk Pelajar Indonesia:</strong> {lang.hookForIndonesians}
        </div>
      </Card>

      {/* Mode View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border-2 border-sand bg-shell p-1 shadow-[0_2px_0_0_var(--color-drop)]">
          <button
            type="button"
            onClick={() => {
              playSound('tap')
              setViewMode('island')
            }}
            className={cx(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
              viewMode === 'island'
                ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)] -translate-y-0.5'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <span>🏝️ Peta Pulau Landmark</span>
            <Chip size="sm" color="leaf">Visual 3D</Chip>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('tap')
              setViewMode('road')
            }}
            className={cx(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
              viewMode === 'road'
                ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)] -translate-y-0.5'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <span>🛣️ Jalan Unit Berkelok</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('tap')
              setViewMode('list')
            }}
            className={cx(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
              viewMode === 'list'
                ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)] -translate-y-0.5'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <span>📋 Daftar Kurikulum</span>
          </button>
        </div>

        {/* Ongoing Cycle Banner (Image 2 & 3 style) */}
        <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50/90 px-3.5 py-1.5 text-[12px] font-bold text-amber-900 shadow-[0_2px_0_0_var(--color-drop)]">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
          <span>Siklus Berjalan: <strong>Periode 4 (32 hari tersisa)</strong></span>
        </div>
      </div>

      {/* VIEW MODE 1: ISLAND WORLD MAP (IMAGE 2 INSPIRATION) */}
      {viewMode === 'island' && (
        <IslandWorldMapView
          lang={param}
          gates={gates}
          statuses={statuses}
          currentLevelIndex={currentLevelIndex}
          onSelectGate={handleOpenLevelRoad}
        />
      )}

      {/* VIEW MODE 2: UNIT ROAD MAP (IMAGE 3 INSPIRATION) */}
      {viewMode === 'road' && (
        <UnitRoadMapView
          lang={param}
          gate={selectedGate}
          status={selectedStatus}
          gateIndex={selectedGateIndex}
          gatesCount={gates.length}
          unitOffset={unitOffsets[selectedGateIndex]}
          onBackToIsland={() => {
            playSound('tap')
            setViewMode('island')
          }}
          onChangeGate={(newIdx) => {
            playSound('tap')
            setSelectedGateIndex(newIdx)
          }}
          onOpenUnitModal={(u) => {
            playSound('tap')
            setSelectedUnitModal(u)
          }}
        />
      )}

      {/* VIEW MODE 3: CLASSIC DETAILED LIST VIEW */}
      {viewMode === 'list' && (
        <ClassicListView
          lang={param}
          gates={gates}
          statuses={statuses}
          unitOffsets={unitOffsets}
        />
      )}

      {/* Unit Detail Modal */}
      {selectedUnitModal && (
        <UnitDetailModal
          unit={selectedUnitModal}
          lang={param}
          onClose={() => setSelectedUnitModal(null)}
        />
      )}
    </div>
  )
}

/* =====================================================================
   VIEW 1: ISLAND WORLD MAP (Image 2 style with accurately positioned nodes)
   ===================================================================== */
function IslandWorldMapView({
  lang,
  gates,
  statuses,
  currentLevelIndex,
  onSelectGate,
}: {
  lang: LangId
  gates: Gate[]
  statuses: ReturnType<typeof gateStatus>
  currentLevelIndex: number
  onSelectGate: (idx: number) => void
}) {
  const l = LANGUAGES[lang]
  const mapImageSrc = `/images/maps/world-${lang}.jpg`
  const [hoveredGate, setHoveredGate] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {/* Map Canvas Card */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-sand bg-paper shadow-[0_8px_0_0_var(--color-drop)]">
        {/* Visual Map Canvas Container */}
        <div className="relative aspect-[16/9] min-h-[480px] sm:min-h-[580px] w-full overflow-hidden bg-sky-100 select-none">
          <img
            src={mapImageSrc}
            alt={`Peta Dunia Pembelajaran ${l.name}`}
            className="h-full w-full object-cover object-center transition-transform duration-700"
          />

          {/* Floating Quest / Bonus Pill (Image 2 top right) */}
          <div className="absolute right-4 top-4 z-20 max-w-[280px] rounded-2xl border-2 border-amber-300 bg-paper/95 p-3.5 text-[12px] shadow-[0_4px_0_0_var(--color-drop)] backdrop-blur-md hidden sm:block">
            <div className="flex items-center gap-2 font-display text-[13px] font-black text-amber-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">★</span>
              <span>Bonus Tantangan Siklus</span>
            </div>
            <p className="mt-1.5 font-medium text-ink-soft leading-snug">
              Selesaikan 2 materi level dalam siklus ini untuk mendapatkan bonus <strong>+100 XP</strong>.
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-teal-700 border-t border-sand/60 pt-1.5">
              <span>Status: Sedang Berjalan</span>
              <span className="text-amber-600 font-extrabold">+50 XP Bonus</span>
            </div>
          </div>

          {/* Floating World Label (Top Left) */}
          <div className="absolute left-4 top-4 z-20 rounded-2xl border-2 border-teal-300 bg-paper/95 px-4 py-2.5 shadow-[0_4px_0_0_var(--color-drop)] backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-wider text-teal-600">
              Pulau Eksplorasi {l.name}
            </div>
            <div className="font-display text-[16px] font-black text-ink">
              Tingkat 1 → Tingkat {gates.length} ({l.exam})
            </div>
          </div>

          {/* SVG Road Trace Lines Connecting the Nodes */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 46 78 Q 36 71 26 64 T 46 48 T 68 56 T 34 30 T 58 16"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="1.2"
              strokeDasharray="2 1.5"
              className="drop-shadow-sm"
            />
          </svg>

          {/* Overlay Nodes Placed Exactly on the Winding Road (Image 2 style) */}
          {gates.map((gate, idx) => {
            const coords = ISLAND_NODE_COORDS[idx] || { left: '50%', top: '50%' }
            const st = statuses[idx]
            const isFinished = st.total > 0 && st.done === st.total
            const isCurrent = idx === currentLevelIndex && st.unlocked && !isFinished
            const isLocked = !st.unlocked
            const isHovered = hoveredGate === idx

            return (
              <div
                key={gate.index}
                style={{ left: coords.left, top: coords.top }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                onMouseEnter={() => setHoveredGate(idx)}
                onMouseLeave={() => setHoveredGate(null)}
              >
                {/* Pedestal Base on Ground (Image 2 style) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-3 h-5 w-12 rounded-[50%] bg-cyan-950/25 blur-[1px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2.5 h-4 w-10 rounded-[50%] border-2 border-white/90 bg-white/60 shadow-sm" />

                {/* Floating Hexagonal Node Button */}
                <button
                  type="button"
                  onClick={() => onSelectGate(idx)}
                  className={cx(
                    'relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none group',
                    'hover:scale-115 active:scale-95',
                  )}
                >
                  {/* Hexagon Shape Container */}
                  <div
                    className={cx(
                      'relative flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] transition-all shadow-[0_5px_0_0_rgba(0,0,0,0.3)]',
                      isFinished
                        ? 'border-white bg-gradient-to-b from-teal-400 to-teal-500 text-white ring-4 ring-teal-300/80 shadow-[0_6px_0_0_#0f766e]'
                        : isCurrent
                          ? 'border-white bg-gradient-to-b from-amber-300 to-amber-400 text-ink ring-4 ring-amber-300 animate-bounce shadow-[0_6px_0_0_#b45309]'
                          : st.unlocked
                            ? 'border-white bg-gradient-to-b from-cyan-400 to-cyan-500 text-white ring-2 ring-cyan-200 shadow-[0_5px_0_0_#0e7490]'
                            : 'border-sand bg-slate-700/85 text-slate-300 opacity-80 shadow-[0_4px_0_0_#334155]',
                    )}
                  >
                    {isFinished ? (
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-display text-[13px] font-black">L{idx + 1}</span>
                        <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-teal-700">✓</span>
                      </div>
                    ) : isLocked ? (
                      <Icon name="lock" size={18} />
                    ) : (
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-display text-[14px] font-black">L{idx + 1}</span>
                        <span className="text-[9px] font-extrabold opacity-90">{gate.index}</span>
                      </div>
                    )}
                  </div>

                  {/* Node Label Tooltip Pill (Always visible or on hover) */}
                  <div
                    className={cx(
                      'mt-1.5 rounded-xl border-2 border-sand/80 px-2.5 py-1 text-center backdrop-blur-md transition-all shadow-md',
                      isCurrent || isHovered
                        ? 'bg-paper text-ink ring-2 ring-teal-400 scale-105 z-30'
                        : 'bg-paper/90 text-ink-soft',
                    )}
                  >
                    <div className="font-display text-[11.5px] font-black truncate max-w-[100px]">
                      {gate.title}
                    </div>
                    <div className="text-[9.5px] font-bold text-ink-faint">
                      {st.done}/{st.total} Unit
                    </div>
                  </div>
                </button>

                {/* Expanded Hover/Click Card on Active Node */}
                {isHovered && (
                  <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 z-50 w-[220px] rounded-2xl border-3 border-teal-500 bg-paper p-3 text-left shadow-[0_8px_0_0_var(--color-drop)] animate-[wawa-rise_0.2s_ease-out]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-teal-700">
                        Tingkat {idx + 1} · Gerbang {gate.index}
                      </span>
                      <Chip size="sm" color={isFinished ? 'leaf' : st.unlocked ? 'amber' : 'ink'}>
                        {isFinished ? 'Selesai' : st.unlocked ? 'Buka' : 'Terkunci'}
                      </Chip>
                    </div>
                    <div className="mt-1 font-display text-[14px] font-black text-ink">
                      {gate.title}
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-ink-soft leading-snug">
                      {gate.subtitle}
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-ink-faint">
                      ⏱ Estimasi: {gate.duration} · {st.done}/{st.total} Unit
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectGate(idx)}
                      className="mt-2.5 w-full rounded-xl bg-teal-600 py-1.5 text-center font-display text-[12px] font-black text-white shadow-sm hover:bg-teal-700 cursor-pointer"
                    >
                      Buka Jalur Unit Ini →
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Level List Cards Below Map */}
        <div className="border-t-2 border-sand bg-paper p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-[15px] font-black text-ink">
              🗺️ Tingkat Gerbang Pembelajaran:
            </span>
            <span className="text-[12px] font-bold text-ink-faint">
              Klik tingkat mana pun untuk masuk ke jalan unit materi
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gates.map((g, i) => {
              const st = statuses[i]
              const isFinished = st.total > 0 && st.done === st.total
              return (
                <button
                  key={g.index}
                  type="button"
                  onClick={() => onSelectGate(i)}
                  className={cx(
                    'flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all cursor-pointer',
                    isFinished
                      ? 'border-leaf-300 bg-leaf-50/70 hover:bg-leaf-100/80 shadow-[0_3px_0_0_var(--color-leaf-600)]'
                      : st.unlocked
                        ? 'border-sand bg-paper hover:border-teal-400 hover:bg-cream shadow-[0_3px_0_0_var(--color-drop)]'
                        : 'border-sand/60 bg-shell opacity-60',
                  )}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 text-xl font-black shadow-sm"
                    style={{
                      backgroundColor: st.unlocked ? tint(l.color) : 'var(--color-shell)',
                      borderColor: st.unlocked ? l.color : 'var(--color-sand)',
                      color: st.unlocked ? l.color : 'var(--color-ink-faint)',
                    }}
                  >
                    <Icon name={st.unlocked ? g.icon : 'lock'} size={20} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase text-teal-700">
                      Tingkat {i + 1} · Gerbang {g.index}
                    </div>
                    <div className="font-display text-[14px] font-black text-ink truncate">
                      {g.title}
                    </div>
                    <div className="text-[11.5px] text-ink-soft">
                      {st.done}/{st.total} Unit Selesai
                    </div>
                  </div>

                  <span className="font-extrabold text-teal-600">➔</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   VIEW 2: UNIT ROAD MAP (Image 3 style with winding street milestones)
   ===================================================================== */
function UnitRoadMapView({
  lang,
  gate,
  status,
  gateIndex,
  gatesCount,
  unitOffset,
  onBackToIsland,
  onChangeGate,
  onOpenUnitModal,
}: {
  lang: LangId
  gate: Gate
  status: ReturnType<typeof gateStatus>[0]
  gateIndex: number
  gatesCount: number
  unitOffset: number
  onBackToIsland: () => void
  onChangeGate: (idx: number) => void
  onOpenUnitModal: (u: Unit) => void
}) {
  const l = LANGUAGES[lang]
  const units = gate.units
  const allUnitsDone = status.done === status.total && status.total > 0

  return (
    <div className="space-y-6">
      {/* Top Banner (Image 3 Top Bar) */}
      <div className="rounded-2xl border-2 border-sand bg-paper p-3.5 shadow-[0_4px_0_0_var(--color-drop)] space-y-3">
        {/* Cycle & Remaining days bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-2.5 text-[12px] font-bold">
          <div className="flex items-center gap-2 text-ink">
            <span className="rounded-lg bg-amber-400 px-2 py-0.5 text-xs font-black text-ink">Periode 4</span>
            <span>01 Agu 2026 – 30 Sep 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-ink-soft">32 hari tersisa di siklus ini</span>
            <div className="w-28">
              <ProgressBar value={status.done} max={Math.max(1, status.total)} height={8} color="teal" />
            </div>
          </div>
        </div>

        {/* Navigation row (Image 3: Back to course, Level code, Pill stats) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToIsland}
            className="flex items-center gap-2 rounded-xl border-2 border-teal-500 bg-teal-50 px-4 py-2 font-display text-[13px] font-black text-teal-900 transition-all hover:bg-teal-100 active:scale-95 shadow-sm cursor-pointer"
          >
            <span>← Kembali ke Peta Pulau</span>
          </button>

          {/* Level Switcher (Image 3: < ENG-C1.1 >) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={gateIndex <= 0}
              onClick={() => onChangeGate(gateIndex - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-sand bg-cream text-ink font-black disabled:opacity-30 hover:bg-paper cursor-pointer"
            >
              ‹
            </button>
            <span className="rounded-xl border-2 border-teal-300 bg-teal-50/80 px-3.5 py-1 font-display text-[13.5px] font-black text-teal-950">
              {lang.toUpperCase()} · Gerbang {gate.index} ({gateIndex + 1}/{gatesCount})
            </span>
            <button
              type="button"
              disabled={gateIndex >= gatesCount - 1}
              onClick={() => onChangeGate(gateIndex + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-sand bg-cream text-ink font-black disabled:opacity-30 hover:bg-paper cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Stats Pills (Image 3: Unit 8/8, CP 3/3, FT 1/1) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-1 text-[12px] font-black text-amber-900 shadow-sm">
              <span>Unit:</span>
              <span className="rounded-md bg-amber-400 px-1.5 py-0.2 text-[10.5px] font-black text-white">{status.done}/{status.total}</span>
            </span>
            <span className="flex items-center gap-1 rounded-xl border-2 border-sky-300 bg-sky-50 px-3 py-1 text-[12px] font-black text-sky-900 shadow-sm">
              <span>CP:</span>
              <span className="rounded-md bg-sky-400 px-1.5 py-0.2 text-[10.5px] font-black text-white">{Math.floor(status.done / 2)}/{Math.ceil(status.total / 2)}</span>
            </span>
            <span className={cx(
              'flex items-center gap-1 rounded-xl border-2 px-3 py-1 text-[12px] font-black shadow-sm',
              allUnitsDone ? 'border-leaf-400 bg-leaf-50 text-leaf-900' : 'border-sand bg-shell text-ink-faint',
            )}>
              <span>Ujian Akhir:</span>
              <span className={cx('rounded-md px-1.5 py-0.2 text-[10.5px] font-black text-white', allUnitsDone ? 'bg-leaf-500' : 'bg-slate-400')}>
                {allUnitsDone ? '1/1' : '0/1'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Suburban Unit Road Card */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-sand bg-paper shadow-[0_8px_0_0_var(--color-drop)]">
        {/* Visual Winding Street Header Canvas */}
        <div className="relative aspect-[21/9] min-h-[220px] w-full overflow-hidden bg-sand/30 select-none">
          <img
            src="/images/maps/unit-road.jpg"
            alt="Jalan Pembelajaran Unit"
            className="h-full w-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />

          {/* Level Title Overlay */}
          <div className="absolute bottom-4 left-6 z-10">
            <span className="rounded-md bg-teal-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
              Jalur Berkelok Tingkat {gateIndex + 1}
            </span>
            <h2 className="mt-1 text-2xl font-black text-ink drop-shadow-sm">
              Gerbang {gate.index}: {gate.title}
            </h2>
            <p className="text-[13px] font-bold text-ink-soft">{gate.subtitle}</p>
          </div>
        </div>

        {/* Milestone Winding Road Nodes & Units */}
        <div className="p-6 space-y-6">
          {!status.unlocked ? (
            <Card tone="shell" className="border-dashed text-center p-8">
              <div className="mb-3 flex justify-center opacity-60">
                <Wawa expression="sleep" size={120} accent={l.color} />
              </div>
              <h3 className="font-display text-lg font-black text-ink">Gerbang Ini Masih Terkunci</h3>
              <p className="mx-auto max-w-md mt-1 text-[14px] text-ink-soft">
                Selesaikan dan lulus kuis pada Gerbang {gate.index - 1} dengan minimal{' '}
                <strong className="text-ink">{GATE_PASS_PCT}%</strong> untuk membuka jalan ke gerbang ini.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Unit Cards List */}
              {units.map((unit, ui) => {
                const order = unitOffset + ui + 1
                return (
                  <UnitRow
                    key={unit.id}
                    unit={unit}
                    lang={lang}
                    order={order}
                    onOpenModal={() => onOpenUnitModal(unit)}
                  />
                )
              })}

              {/* Final Gate Exam Checkpoint Card (Image 3 Final Test trophy milestone) */}
              {(() => {
                const gateLesson = units.flatMap((u) => u.lessons).find((l) => l.kind === 'gate') || units[units.length - 1]?.lessons[units[units.length - 1]?.lessons.length - 1]
                const targetQuizUrl = gateLesson ? `/pelajaran/${lang}/${gateLesson.id}` : `/pelajaran/${lang}/${units[0]?.lessons[0]?.id}`

                return (
                  <div className="rounded-3xl border-3 border-amber-400 bg-amber-400/20 dark:bg-amber-950/80 p-5 shadow-[0_6px_0_0_var(--color-amber-600)]">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-3 border-amber-500 bg-amber-300 text-3xl shadow-md animate-bounce">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <h3 className="font-display text-lg font-black text-ink">
                            Final Test — Ujian Kelulusan Gerbang {gate.index}
                          </h3>
                          <Chip size="sm" color="amber">Standar Lulus {GATE_PASS_PCT}%</Chip>
                        </div>
                        <p className="mt-1 text-[13px] font-medium text-ink-soft">
                          Uji seluruh materi dari {units.length} unit di gerbang ini untuk membuka sertifikasi level berikutnya!
                        </p>
                      </div>
                      <Link to={targetQuizUrl}>
                        <button
                          type="button"
                          className="rounded-2xl border-2 border-amber-600 bg-amber-400 hover:bg-amber-300 px-6 py-3 font-display text-[14px] font-black text-ink shadow-[0_4px_0_0_var(--color-amber-700)] transition-all active:translate-y-1 cursor-pointer"
                        >
                          Ikuti Ujian Akhir →
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   VIEW 3: CLASSIC LIST VIEW
   ===================================================================== */
function ClassicListView({
  lang,
  gates,
  statuses,
  unitOffsets,
}: {
  lang: LangId
  gates: Gate[]
  statuses: ReturnType<typeof gateStatus>
  unitOffsets: number[]
}) {
  const l = LANGUAGES[lang]

  return (
    <div className="space-y-8">
      {gates.map((gate, gi) => {
        const st = statuses[gi]
        return (
          <section key={gate.index} id={`level-${gi + 1}`} className="scroll-mt-36">
            <div
              className={cx(
                'sticky top-[70px] z-20 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 px-4 py-3 lg:top-2 shadow-[0_3px_0_0_var(--color-drop)]',
                st.unlocked ? 'border-sand bg-paper' : 'border-sand/60 bg-shell',
              )}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 text-xl"
                style={{
                  backgroundColor: st.unlocked ? tint(l.color) : 'var(--color-shell)',
                  borderColor: st.unlocked ? l.color : 'var(--color-sand)',
                  color: st.unlocked ? l.color : 'var(--color-ink-faint)',
                }}
                aria-hidden
              >
                <Icon name={st.unlocked ? gate.icon : 'lock'} size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[17px] font-extrabold text-ink">
                  Level {gi + 1} <span className="text-ink-faint">· Gerbang {gate.index}</span> — {gate.title}
                </div>
                <div className="text-[13px] text-ink-soft">{gate.subtitle}</div>
              </div>
              <div className="flex items-center gap-2">
                <Chip color="ink" size="sm">⏱ {gate.duration}</Chip>
                <Chip color={st.done === st.total && st.total ? 'leaf' : 'teal'} size="sm">
                  {st.done}/{st.total}
                </Chip>
              </div>
            </div>

            {!st.unlocked ? (
              <Card tone="shell" className="border-dashed text-center">
                <div className="mb-2 flex justify-center opacity-50">
                  <Wawa expression="sleep" size={110} accent={l.color} />
                </div>
                <p className="mx-auto max-w-md text-[14px] text-ink-soft">
                  Gerbang ini terkunci. Lulus kuis Gerbang {gate.index - 1} dengan minimal{' '}
                  <strong className="text-ink">{GATE_PASS_PCT}%</strong> untuk membukanya.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {gate.units.map((unit, ui) => (
                  <UnitRow key={unit.id} unit={unit} lang={lang} order={unitOffsets[gi] + ui + 1} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------
   UNIT ROW & LESSON NODE (Used in Road and List views)
   ------------------------------------------------------------------ */
function UnitRow({
  unit,
  lang,
  order,
  onOpenModal,
}: {
  unit: Unit
  lang: LangId
  order: number
  onOpenModal?: () => void
}) {
  const completed = useProgress((s) => s.completed)
  const l = LANGUAGES[lang]
  const done = unit.lessons.filter((x) => completed[x.id]).length
  const allDone = done === unit.lessons.length && unit.lessons.length > 0

  return (
    <Card className={cx('relative overflow-hidden border-2 shadow-[0_4px_0_0_var(--color-drop)]', allDone && 'border-leaf-300 bg-leaf-50/30')}>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* unit summary */}
        <div className="md:w-[300px] md:shrink-0">
          <div className="flex items-start gap-3">
            <span
              className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border-2 font-display font-extrabold shadow-[0_3px_0_0_var(--color-drop)]"
              style={{ backgroundColor: tint(l.color), borderColor: l.color, color: l.color }}
            >
              <span className="text-[9px] uppercase tracking-wide">Unit</span>
              <span className="text-xl leading-none">{order}</span>
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip size="sm" color="ink">{unit.level}</Chip>
                <Chip size="sm" color="teal">{unit.badge.slice(0, 8)}</Chip>
                {allDone ? <Chip size="sm" color="leaf" icon="check">selesai</Chip> : null}
              </div>
              <h3 className="mt-1 text-[17px] font-black leading-tight text-ink">{unit.title}</h3>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{unit.subtitle}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={done} max={unit.lessons.length} height={10} color={allDone ? 'leaf' : 'teal'} />
            <span className="shrink-0 text-[11px] font-bold text-ink-faint">
              {done}/{unit.lessons.length}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {unit.notes?.length ? (
              <Link
                to={`/materi/${lang}/${unit.id}`}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-teal-700 underline underline-offset-4"
              >
                <Icon name="words" size={15} />Materi ({unit.notes.length})
              </Link>
            ) : null}

            {onOpenModal ? (
              <button
                type="button"
                onClick={onOpenModal}
                className="inline-flex items-center gap-1 text-[12.5px] font-extrabold text-amber-700 hover:underline cursor-pointer"
              >
                🔍 Detail Unit
              </button>
            ) : null}
          </div>
        </div>

        {/* lesson nodes */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {unit.lessons.map((lesson, i) => (
            <LessonNode key={lesson.id} lesson={lesson} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </Card>
  )
}

function LessonNode({ lesson, lang, index }: { lesson: Lesson; lang: LangId; index: number }) {
  const completed = useProgress((s) => s.completed)
  const l = LANGUAGES[lang]
  const result = completed[lesson.id]
  const isGate = lesson.kind === 'gate'
  const passed = result && (!isGate || result.pct >= GATE_PASS_PCT)

  return (
    <Link
      to={`/pelajaran/${lang}/${lesson.id}`}
      className="group flex w-[124px] flex-col items-center gap-2 text-center"
    >
      <span
        className={cx(
          'relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] text-2xl transition-transform',
          'shadow-[0_5px_0_0_var(--color-drop)] group-hover:-translate-y-0.5 group-active:translate-y-[3px] group-active:shadow-[0_2px_0_0_var(--color-drop)]',
        )}
        style={{
          backgroundColor: passed ? '#79d162' : result ? '#ffcd3c' : isGate ? tint(l.color) : 'var(--color-paper)',
          borderColor: passed ? '#2c7a1c' : result ? '#ad7a05' : isGate ? l.color : 'var(--color-sand)',
          color: passed || result ? '#17313c' : isGate ? l.color : 'var(--color-ink)',
        }}
        aria-hidden
      >
        {passed ? <Icon name="star" size={26} /> : isGate ? <Icon name="strategy" size={24} /> : index + 1}
        {isGate ? (
          <span className="absolute -bottom-1 rounded-full border-2 border-ink bg-paper px-1.5 text-[9px] font-extrabold uppercase text-ink">
            gerbang
          </span>
        ) : null}
      </span>
      <span className="text-[12.5px] font-bold leading-tight text-ink-soft group-hover:text-ink">
        {lesson.title}
      </span>
      <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-ink-faint">
        {result ? `${result.pct}%` : `+${lesson.xp} XP`}
      </span>
    </Link>
  )
}

/* ------------------------------------------------------------------
   UNIT DETAIL MODAL
   ------------------------------------------------------------------ */
function UnitDetailModal({
  unit,
  lang,
  onClose,
}: {
  unit: Unit
  lang: LangId
  onClose: () => void
}) {
  const completed = useProgress((s) => s.completed)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="anim-rise w-full max-w-lg rounded-3xl border-2 border-sand bg-paper p-6 shadow-[0_8px_0_0_var(--color-drop)] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Chip size="sm" color="teal">{unit.level}</Chip>
              <Chip size="sm" color="amber">{unit.badge}</Chip>
            </div>
            <h3 className="mt-1 font-display text-xl font-black text-ink">{unit.title}</h3>
            <p className="text-[13px] text-ink-soft">{unit.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1.5 text-ink-faint hover:text-ink cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Lessons in Unit */}
        <div className="space-y-2">
          <div className="text-[12px] font-extrabold uppercase text-ink-faint">
            Daftar Pelajaran ({unit.lessons.length}):
          </div>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {unit.lessons.map((lesson, idx) => {
              const res = completed[lesson.id]
              const isPassed = res && res.pct >= GATE_PASS_PCT
              return (
                <Link
                  key={lesson.id}
                  to={`/pelajaran/${lang}/${lesson.id}`}
                  className="flex items-center justify-between rounded-xl border border-sand bg-cream/60 p-3 transition-colors hover:bg-cream"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper font-display text-[12px] font-black text-ink border border-sand">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-display text-[13.5px] font-black text-ink">
                        {lesson.title}
                      </div>
                      <div className="text-[11.5px] text-ink-soft">
                        {lesson.kind === 'gate' ? 'Ujian Gerbang 85%' : `${lesson.exercises.length} Soal Latihan`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {res ? (
                      <Chip size="sm" color={isPassed ? 'leaf' : 'amber'}>
                        {res.pct}%
                      </Chip>
                    ) : (
                      <span className="text-[11.5px] font-extrabold text-teal-700">+{lesson.xp} XP</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {unit.notes?.length ? (
          <div className="border-t border-sand pt-3">
            <Link
              to={`/materi/${lang}/${unit.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-teal-400 bg-teal-50 py-3 font-display text-[14px] font-black text-teal-900 hover:bg-teal-100"
            >
              <Icon name="words" size={18} />
              <span>Buka Materi Ringkasan Unit ({unit.notes.length})</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
