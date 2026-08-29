import { useEffect, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Petals } from '@/components/decor/Scenery'
import { LANGUAGES, LANG_ORDER } from '@/data/languages'
import { FlagIcon, Icon, cx } from '@/components/ui'
import { useProgress } from '@/store/useProgress'
import type { LangId } from '@/data/types'
import { tint } from '@/lib/tint'
import { useNavigate } from 'react-router-dom'
import { playSound } from '@/lib/sound'

/**
 * Boot splash. Shown once per session (sessionStorage) so a page refresh
 * during study doesn't force the animation again.
 */
const SEEN_KEY = 'wawa-splash-seen'

export function useSplash() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) !== '1'
    } catch {
      return true
    }
  })

  const close = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    setVisible(false)
  }

  const show = () => setVisible(true)

  return { visible, close, show }
}

export function Splash({ onClose }: { onClose: () => void }) {
  const activeLang = useProgress((s) => s.activeLang)
  const setActiveLang = useProgress((s) => s.setActiveLang)
  const onboarded = useProgress((s) => s.onboarded)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<LangId>(activeLang)
  const [ready, setReady] = useState(false)
  const lang = LANGUAGES[selected]

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onboarded) onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, onboarded])

  const enter = () => {
    playSound('tap')
    setActiveLang(selected)
    onClose()
    if (onboarded) navigate(`/belajar/${selected}`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilih bahasa belajar"
      className={[
        'fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-shell px-4 py-8',
        'transition-opacity duration-300',
        ready ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-25">
        <Petals count={18} />
      </div>

      {onboarded ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu bahasa"
          className="absolute right-4 top-4 z-10 rounded-2xl border-2 border-sand bg-paper p-2.5 text-ink-soft shadow-[0_3px_0_0_var(--color-drop)] hover:text-ink active:translate-y-[2px] active:shadow-none"
        >
          <Icon name="close" size={20} />
        </button>
      ) : null}

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[32px] border-2 border-sand bg-paper shadow-[0_10px_0_0_var(--color-drop)] md:grid-cols-[0.78fr_1.22fr]">
        <div
          className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden p-6 text-center"
          style={{ backgroundColor: tint(lang.color) }}
        >
          <span className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20" style={{ backgroundColor: lang.color }} />
          <span className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full opacity-15" style={{ backgroundColor: lang.color }} />
          <Wawa expression="wave" size={205} accent={lang.color} className="relative anim-bob" />
          <div className="relative mt-1 rounded-2xl border-2 border-sand bg-paper/95 px-4 py-2 text-[13px] font-bold text-ink-soft">
            Halo! Mau belajar bahasa apa hari ini?
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-600">WAWA さん</div>
            <h1 className="mt-1 text-[30px] leading-tight sm:text-[36px]">Pilih ruang belajarmu</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Setiap bahasa memiliki jalur, aksara, latihan, dan progres yang terpisah.
            </p>
          </div>

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
                  onClick={() => { playSound('tap'); setSelected(id) }}
                  className={cx(
                    'flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all',
                    active ? '-translate-y-0.5 shadow-[0_4px_0_0_var(--color-drop)]' : 'border-sand bg-shell hover:bg-cream',
                  )}
                  style={active ? { borderColor: l.color, backgroundColor: tint(l.color) } : undefined}
                >
                  <FlagIcon lang={id} size={30} />
                  <span className="min-w-0">
                    <span className="block font-display text-[14px] font-extrabold text-ink">{l.name}</span>
                    <span className="block font-cjk text-[11px] font-bold text-ink-faint">{l.nativeName} · {l.exam}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={enter}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3.5 font-display text-[16px] font-extrabold text-white shadow-[0_5px_0_0_var(--color-drop)] transition-transform hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
            style={{ backgroundColor: lang.color, borderColor: lang.color }}
          >
            Masuk ke jalur {lang.name} <Icon name="play" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
