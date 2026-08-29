import { useEffect, useRef, useState } from 'react'
import { Icon, Spinner, cx } from '@/components/ui'
import { strokeDataUrls } from '@/data/charBank'
import type { LangId } from '@/data/types'

type StrokeData = { strokes: string[]; medians?: number[][][] }

const cache = new Map<string, StrokeData | 'missing'>()

/**
 * Animated stroke-order diagram.
 *
 * Stroke outlines come from Hanzi Writer's data packages (MIT / Arphic PL) —
 * fetched per character and cached in memory, because 20 000+ glyph files are
 * far too much to bundle. Falls back to a plain glyph when a character has no
 * data, which is the honest thing to show rather than a broken box.
 *
 * Hanzi Writer's coordinate system is 1024×1024 with the origin at the
 * bottom-left, hence the flip transform.
 */
export function StrokeOrder({
  char, lang, size = 120, autoPlay = true,
}: { char: string; lang: LangId; size?: number; autoPlay?: boolean }) {
  const [data, setData] = useState<StrokeData | 'missing' | null>(null)
  const [shown, setShown] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    let alive = true
    const key = `${lang}:${char}`
    const hit = cache.get(key)
    if (hit) { setData(hit); return }

    setData(null)
    // try each package in turn; first hit wins
    ;(async () => {
      for (const url of strokeDataUrls(char, lang)) {
        try {
          const r = await fetch(url)
          if (!r.ok) continue
          const d = (await r.json()) as StrokeData
          if (!d?.strokes?.length) continue
          if (!alive) return
          cache.set(key, d)
          setData(d)
          return
        } catch {
          /* try the next package */
        }
      }
      if (!alive) return
      cache.set(key, 'missing')
      setData('missing')
    })()
    return () => { alive = false }
  }, [char, lang])

  // Play through the strokes once loaded.
  useEffect(() => {
    if (!data || data === 'missing') return
    setShown(autoPlay ? 0 : data.strokes.length)
    if (!autoPlay) return

    const tick = () => {
      setShown((s) => {
        if (s >= data.strokes.length) return s
        return s + 1
      })
    }
    timer.current = window.setInterval(tick, 380)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [data, autoPlay])

  useEffect(() => {
    if (data && data !== 'missing' && shown >= data.strokes.length && timer.current) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }, [shown, data])

  const replay = () => {
    if (!data || data === 'missing') return
    setShown(0)
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => setShown((s) => s + 1), 380)
  }

  return (
    <div className="shrink-0">
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-sand bg-cream"
        style={{ width: size, height: size }}
      >
        {/* 田字格 guides */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
          <g stroke="var(--color-sand)" strokeWidth="0.7" strokeDasharray="4 5">
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
          </g>
        </svg>

        {data === null ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size={20} className="text-teal-500" />
          </div>
        ) : data === 'missing' ? (
          <div className="absolute inset-0 flex items-center justify-center font-cjk text-ink" style={{ fontSize: size * 0.62 }}>
            {char}
          </div>
        ) : (
          <svg viewBox="0 0 1024 1024" className="absolute inset-0 h-full w-full" aria-label={`Urutan guratan ${char}`}>
            <g transform="scale(1, -1) translate(0, -900)">
              {data.strokes.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill={i < shown ? 'var(--color-ink)' : 'var(--color-sand)'}
                  opacity={i < shown ? 1 : 0.35}
                  style={{ transition: 'fill .18s ease, opacity .18s ease' }}
                />
              ))}
            </g>
          </svg>
        )}
      </div>

      {data && data !== 'missing' ? (
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span className="text-[10.5px] font-extrabold uppercase text-ink-faint">
            {Math.min(shown, data.strokes.length)}/{data.strokes.length} guratan
          </span>
          <button
            onClick={replay}
            aria-label="Putar ulang urutan guratan"
            className="rounded-lg border-2 border-sand bg-paper p-1 text-ink-faint hover:bg-cream"
          >
            <Icon name="reset" size={13} />
          </button>
        </div>
      ) : data === 'missing' ? (
        <div className={cx('mt-1.5 text-center text-[10px] font-bold text-ink-faint')}>
          urutan guratan tidak tersedia
        </div>
      ) : null}
    </div>
  )
}
