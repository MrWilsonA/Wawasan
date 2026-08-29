import { useTheme, type ThemeMode } from '@/store/useTheme'
import { cx, Icon, type IconName } from '@/components/ui'

const MODES: Array<{ id: ThemeMode; label: string; icon: IconName }> = [
  { id: 'light', label: 'Terang', icon: 'sun' },
  { id: 'dark', label: 'Gelap', icon: 'moon' },
  { id: 'system', label: 'Sistem', icon: 'system' },
]

export function ThemeToggle({ compact }: { compact?: boolean }) {
  const mode = useTheme((s) => s.mode)
  const setMode = useTheme((s) => s.setMode)

  return (
    <div>
      {!compact ? (
        <div className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
          Tampilan
        </div>
      ) : null}
      <div
        className="grid grid-cols-3 gap-1 rounded-2xl border-2 border-sand bg-shell p-1"
        role="radiogroup"
        aria-label="Mode tampilan"
      >
        {MODES.map((m) => {
          const active = mode === m.id
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={active}
              title={m.label}
              onClick={() => setMode(m.id)}
              className={cx(
                'flex flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors',
                active ? 'bg-paper text-teal-600 shadow-[0_2px_0_0_var(--color-drop)]' : 'text-ink-faint hover:text-ink-soft',
              )}
            >
              <Icon name={m.icon} size={16} />
              {!compact ? <span className="text-[9.5px] font-extrabold uppercase">{m.label}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
