import { useEffect, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Petals } from '@/components/decor/Scenery'
import { LANGUAGES, LANG_ORDER } from '@/data/languages'
import { FlagIcon, Icon, cx } from '@/components/ui'
import { useProgress } from '@/store/useProgress'
import type { LangId } from '@/data/types'
import { tint } from '@/lib/tint'
import { useNavigate } from 'react-router-dom'
import { playSound, startBgm } from '@/lib/sound'

export function useSplash() {
  // Always open Splash on initial page load / entry
  const [visible, setVisible] = useState(true)

  const close = () => {
    setVisible(false)
  }

  const show = () => setVisible(true)

  return { visible, close, show }
}

export function Splash({ onClose }: { onClose: () => void }) {
  const { activeLang, setActiveLang, onboarded, name } = useProgress()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<LangId>(activeLang)
  const [ready, setReady] = useState(false)
  const lang = LANGUAGES[selected]

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 100)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onboarded) {
        startBgm()
        onClose()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, onboarded])

  const enterDashboard = () => {
    playSound('tap')
    startBgm()
    setActiveLang(selected)
    onClose()
    navigate('/')
  }

  const enterPath = () => {
    playSound('tap')
    startBgm()
    setActiveLang(selected)
    onClose()
    navigate(`/belajar/${selected}`)
  }

  const handleClose = () => {
    playSound('tap')
    startBgm()
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilih bahasa belajar"
      className={cx(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-shell/95 backdrop-blur-md px-4 py-8',
        'transition-opacity duration-300',
        ready ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-25">
        <Petals count={24} />
      </div>

      {onboarded ? (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup menu pembuka"
          className="absolute right-5 top-5 z-10 rounded-2xl border-2 border-sand bg-paper p-3 text-ink-soft shadow-[0_3px_0_0_var(--color-drop)] hover:text-ink active:translate-y-[2px] active:shadow-none cursor-pointer"
        >
          <Icon name="close" size={20} />
        </button>
      ) : null}

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[32px] border-3 border-sand bg-paper shadow-[0_12px_0_0_var(--color-drop)] md:grid-cols-[0.85fr_1.15fr] animate-[wawa-rise_0.3s_ease-out]">
        {/* Mascot Left Panel */}
        <div
          className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden p-6 text-center transition-colors duration-300"
          style={{ backgroundColor: tint(lang.color) }}
        >
          <span className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20" style={{ backgroundColor: lang.color }} />
          <span className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full opacity-15" style={{ backgroundColor: lang.color }} />
          <Wawa expression="wave" size={210} accent={lang.color} className="relative anim-bob" />
          <div className="relative mt-2 rounded-2xl border-2 border-sand bg-paper/95 px-4 py-2 text-[13.5px] font-extrabold text-ink-soft shadow-sm">
            {name ? `Halo, ${name}!` : 'Halo, Sahabat WAWA!'} Mau belajar bahasa apa hari ini?
          </div>
        </div>

        {/* Language Selection Right Panel */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-teal-600 px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                WAWA さん
              </span>
              <span className="text-[12px] font-bold text-ink-faint">Platform Belajar 4 Bahasa</span>
            </div>
            <h1 className="mt-1 font-display text-[28px] font-black leading-tight sm:text-[34px] text-ink">
              Pilih Ruang Belajarmu
            </h1>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              Setiap bahasa memiliki kurikulum bertahap, materi komprehensif, latihan audio, dan progres terpisah.
            </p>
          </div>

          {/* 4 Language Buttons */}
          <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Bahasa belajar">
            {LANG_ORDER.map((id) => {
              const l = LANGUAGES[id]
              const active = id === selected
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    playSound('tap')
                    setSelected(id)
                  }}
                  className={cx(
                    'flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer',
                    active
                      ? '-translate-y-0.5 shadow-[0_4px_0_0_var(--color-drop)] ring-2 ring-current'
                      : 'border-sand bg-shell hover:bg-cream',
                  )}
                  style={active ? { borderColor: l.color, backgroundColor: tint(l.color), color: l.color } : undefined}
                >
                  <FlagIcon lang={id} size={32} />
                  <span className="min-w-0">
                    <span className="block font-display text-[14.5px] font-black text-ink">{l.name}</span>
                    <span className="block font-cjk text-[11px] font-bold text-ink-faint">{l.nativeName} · {l.exam}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={enterDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3.5 font-display text-[15px] font-black text-white shadow-[0_4px_0_0_var(--color-drop)] transition-transform hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none cursor-pointer"
              style={{ backgroundColor: lang.color, borderColor: lang.color }}
            >
              <span>Masuk ke Dashboard & Nyalakan Musik</span>
              <Icon name="next" size={16} />
            </button>

            <button
              type="button"
              onClick={enterPath}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-sand bg-paper hover:bg-cream px-5 py-2.5 font-display text-[13.5px] font-extrabold text-ink transition-colors cursor-pointer"
            >
              <span>Langsung Buka Jalur Belajar {lang.name}</span>
              <Icon name="path" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
