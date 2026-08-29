import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react'
import { Icon, type IconName } from './icons'

export * from './icons'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/* ============================== Button ============================== */
/**
 * The signature control: a flat block with a hard offset shadow that
 * collapses on press. No gradients — depth is purely the offset + outline.
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  icon?: IconName
  iconRight?: IconName
}

const BTN_VARIANT: Record<string, string> = {
  primary: 'bg-teal-500 text-white border-teal-700 [--sh:var(--color-teal-700)] hover:bg-teal-400',
  success: 'bg-leaf-400 text-white border-leaf-600 [--sh:var(--color-leaf-600)] hover:bg-leaf-300',
  danger: 'bg-coral-400 text-white border-coral-600 [--sh:var(--color-coral-600)] hover:bg-coral-300',
  amber: 'bg-amber-300 text-[#17313c] border-amber-500 [--sh:var(--color-amber-500)] hover:bg-amber-200',
  secondary: 'bg-paper text-ink border-sand [--sh:var(--color-drop)] hover:bg-cream',
  ghost: 'bg-transparent text-ink-soft border-transparent [--sh:transparent] shadow-none hover:bg-ink/5',
}

const BTN_SIZE: Record<string, string> = {
  sm: 'text-[13px] px-3.5 py-2 rounded-xl gap-1.5',
  md: 'text-[15px] px-5 py-2.5 rounded-2xl gap-2',
  lg: 'text-[17px] px-7 py-3.5 rounded-2xl gap-2',
}

const BTN_ICON: Record<string, number> = { sm: 15, md: 17, lg: 19 }

export function Button({
  variant = 'primary', size = 'md', full, icon, iconRight, className, children, ...rest
}: ButtonProps) {
  const isGhost = variant === 'ghost'
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center font-display font-extrabold uppercase tracking-wide',
        'border-2 transition-[transform,background-color,box-shadow] duration-100 select-none',
        'active:translate-y-[3px] disabled:opacity-45 disabled:pointer-events-none',
        !isGhost && 'shadow-[0_4px_0_0_var(--sh)] active:shadow-[0_1px_0_0_var(--sh)]',
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        full && 'w-full',
        className,
      )}
    >
      {icon ? <Icon name={icon} size={BTN_ICON[size]} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={BTN_ICON[size]} /> : null}
    </button>
  )
}

/* =============================== Card =============================== */
export function Card({
  className, children, tone = 'paper', ...rest
}: HTMLAttributes<HTMLDivElement> & { tone?: 'paper' | 'cream' | 'shell' }) {
  const tones = { paper: 'bg-paper', cream: 'bg-cream', shell: 'bg-shell' }
  return (
    <div
      {...rest}
      className={cx(
        'rounded-3xl border-2 border-sand p-5 shadow-[0_4px_0_0_var(--color-drop)]',
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}

/* =============================== Chip =============================== */
export type ChipColor = 'teal' | 'amber' | 'coral' | 'leaf' | 'grape' | 'sky' | 'ink'

export function Chip({
  children, color = 'teal', size = 'md', icon, className,
}: {
  children: ReactNode
  color?: ChipColor
  size?: 'sm' | 'md'
  icon?: IconName
  className?: string
}) {
  const map: Record<ChipColor, string> = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    coral: 'bg-coral-50 text-coral-600 border-coral-200',
    leaf: 'bg-leaf-50 text-leaf-600 border-leaf-200',
    grape: 'bg-grape-50 text-grape-600 border-grape-200',
    sky: 'bg-sky-50 text-sky-600 border-sky-200',
    ink: 'bg-shell text-ink-soft border-sand',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border-2 font-bold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        map[color], className,
      )}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 11 : 13} /> : null}
      {children}
    </span>
  )
}

/* ============================ ProgressBar ============================ */
export function ProgressBar({
  value, max = 100, color = 'leaf', height = 14, label,
}: { value: number; max?: number; color?: string; height?: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const bg: Record<string, string> = {
    leaf: 'bg-leaf-400', teal: 'bg-teal-400', amber: 'bg-amber-300',
    coral: 'bg-coral-400', grape: 'bg-grape-400', sky: 'bg-sky-400',
  }
  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-full border-2 border-sand bg-shell"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cx('h-full rounded-full transition-[width] duration-500 ease-out', bg[color] ?? bg.leaf)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ============================== Ring ============================== */
/** Flat progress ring — a stroked circle, no gradient, no glow. */
export function Ring({
  value, max = 100, size = 84, stroke = 11, color = 'var(--color-teal-500)', children,
}: {
  value: number; max?: number; size?: number; stroke?: number
  color?: string; children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / max))
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-sand)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset .6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/* ============================= Callout ============================= */
export type CalloutKind = 'tip' | 'warning' | 'concept' | 'contrast' | 'story' | 'formula'

export function Callout({
  kind = 'tip', title, children,
}: { kind?: CalloutKind; title?: string; children: ReactNode }) {
  const map: Record<CalloutKind, { border: string; bg: string; icon: IconName; text: string }> = {
    tip: { border: 'border-teal-200', bg: 'bg-teal-50', icon: 'tip', text: 'text-teal-700' },
    warning: { border: 'border-coral-200', bg: 'bg-coral-50', icon: 'warning', text: 'text-coral-600' },
    concept: { border: 'border-sky-200', bg: 'bg-sky-50', icon: 'concept', text: 'text-sky-600' },
    contrast: { border: 'border-grape-200', bg: 'bg-grape-50', icon: 'contrast', text: 'text-grape-600' },
    story: { border: 'border-amber-200', bg: 'bg-amber-50', icon: 'story', text: 'text-amber-600' },
    formula: { border: 'border-sand', bg: 'bg-cream', icon: 'formula', text: 'text-ink-soft' },
  }
  const s = map[kind]
  return (
    <div className={cx('rounded-2xl border-2 p-4', s.border, s.bg)}>
      {title ? (
        <div className={cx('mb-1.5 flex items-center gap-2 font-display text-[15px] font-extrabold', s.text)}>
          <Icon name={s.icon} size={17} />
          {title}
        </div>
      ) : null}
      <div className="text-[14.5px] leading-relaxed text-ink-soft">{children}</div>
    </div>
  )
}

/* ============================== Table ============================== */
export function DataTable({
  head, rows, dense, cjkCols,
}: { head: string[]; rows: (string | ReactNode)[][]; dense?: boolean; cjkCols?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-sand bg-paper">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="bg-shell">
            {head.map((h, i) => (
              <th key={i} className={cx('border-b-2 border-sand font-display font-extrabold text-ink', dense ? 'px-3 py-2' : 'px-4 py-3')}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-cream/60' : 'bg-paper'}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={cx(
                    'border-b border-sand/70 align-top text-ink-soft',
                    dense ? 'px-3 py-2' : 'px-4 py-3',
                    cjkCols?.includes(j) && 'font-cjk text-[16px] text-ink',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* =============================== Tabs =============================== */
export function Tabs<T extends string>({
  tabs, value, onChange, size = 'md',
}: {
  tabs: { id: T; label: string; count?: number; icon?: IconName }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-full border-2 font-display font-extrabold transition-colors',
              size === 'sm' ? 'px-3.5 py-1.5 text-[13px]' : 'px-4 py-2 text-sm',
              active
                ? 'border-teal-600 bg-teal-500 text-white shadow-[0_3px_0_0_var(--color-teal-700)]'
                : 'border-sand bg-paper text-ink-soft hover:bg-cream',
            )}
          >
            {t.icon ? <Icon name={t.icon} size={15} /> : null}
            {t.label}
            {t.count !== undefined ? (
              <span className={cx('ml-0.5 rounded-full px-1.5 py-0.5 text-[11px]', active ? 'bg-teal-700' : 'bg-shell')}>
                {t.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

/* ============================ SectionTitle ============================ */
export function SectionTitle({
  eyebrow, title, sub, right,
}: { eyebrow?: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">{eyebrow}</div>
        ) : null}
        <h2 className="text-2xl text-ink">{title}</h2>
        {sub ? <p className="mt-1 max-w-2xl text-[14.5px] text-ink-soft">{sub}</p> : null}
      </div>
      {right}
    </div>
  )
}

/* ============================== Pre block ============================== */
export function Mono({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border-2 border-sand bg-cream p-4 font-mono text-[13px] leading-relaxed whitespace-pre text-ink-soft">
      {children}
    </pre>
  )
}

/* ============================== Stat ============================== */
export function Stat({
  icon, value, label, color = 'teal',
}: { icon: IconName; value: ReactNode; label: string; color?: ChipColor }) {
  const map: Record<ChipColor, string> = {
    teal: 'bg-teal-50 border-teal-200 text-teal-600', amber: 'bg-amber-50 border-amber-200 text-amber-600',
    coral: 'bg-coral-50 border-coral-200 text-coral-600', leaf: 'bg-leaf-50 border-leaf-200 text-leaf-600',
    grape: 'bg-grape-50 border-grape-200 text-grape-600', sky: 'bg-sky-50 border-sky-200 text-sky-600',
    ink: 'bg-shell border-sand text-ink-soft',
  }
  return (
    <div className={cx('flex items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5', map[color])}>
      <Icon name={icon} size={22} />
      <span className="min-w-0 leading-tight">
        <span className="block font-display text-xl font-extrabold text-ink">{value}</span>
        <span className="block truncate text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</span>
      </span>
    </div>
  )
}

/* ============================== Empty ============================== */
export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-sand bg-paper/60 px-6 py-12 text-center">
      <h3 className="text-lg text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-[14.5px] text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

/* ============================== Spinner ============================== */
export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return <Icon name="loader" size={size} className={cx('anim-spin', className)} />
}

/* ============================== Input ============================== */
export function SearchInput({
  value, onChange, placeholder, autoFocus,
}: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">
        <Icon name="search" size={18} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border-2 border-sand bg-paper py-3 pl-11 pr-10 text-[15px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          aria-label="Kosongkan pencarian"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-faint hover:bg-shell"
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  )
}
