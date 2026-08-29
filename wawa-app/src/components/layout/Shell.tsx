import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Logo, WawaMark } from '@/brand/Logo'
import { useProgress, useDueCards, MAX_HEARTS_CONST } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import { cx } from '@/components/ui'

type NavItem = { to: string; label: string; icon: string; badge?: number }

export function Shell({ children }: { children: React.ReactNode }) {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const due = useDueCards()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location.pathname])

  const nav: NavItem[] = [
    { to: '/', label: 'Beranda', icon: '🏠' },
    { to: `/belajar/${activeLang}`, label: 'Jalur Belajar', icon: '🗺️' },
    { to: '/ulang', label: 'Kartu Ulang', icon: '🔁', badge: due.length },
    { to: '/aksara', label: 'Aksara', icon: '文' },
    { to: '/menulis', label: 'Latihan Menulis', icon: '✍️' },
    { to: '/ujian', label: 'Kalkulator Ujian', icon: '🎯' },
    { to: '/referensi', label: 'Referensi', icon: '📊' },
    { to: '/metode', label: 'Metode', icon: '🧭' },
    { to: '/profil', label: 'Profil', icon: '🦊' },
  ]

  return (
    <div className="min-h-screen bg-shell">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r-2 border-sand bg-white lg:flex">
        <div className="px-5 py-5">
          <NavLink to="/" aria-label="WAWAさん — beranda">
            <Logo size={42} badgeColor={lang.color} />
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {nav.map((n) => (
            <SideLink key={n.to} item={n} />
          ))}
        </nav>

        <LangSwitcher />
      </aside>

      {/* ---------- Mobile header ---------- */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-sand bg-white px-4 py-3 lg:hidden">
        <NavLink to="/" aria-label="WAWAさん — beranda">
          <Logo size={34} badgeColor={lang.color} />
        </NavLink>
        <div className="flex items-center gap-2">
          <MiniStats />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            className="rounded-xl border-2 border-sand bg-white px-3 py-2 text-lg leading-none shadow-[0_3px_0_0_#e8e1d0] active:translate-y-[2px] active:shadow-none"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[62px] z-40 border-b-2 border-sand bg-white p-3 shadow-[0_6px_0_0_rgba(23,49,60,0.06)] lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {nav.map((n) => (
              <SideLink key={n.to} item={n} compact />
            ))}
          </nav>
          <div className="mt-3 border-t-2 border-sand pt-3">
            <LangSwitcher inline />
          </div>
        </div>
      ) : null}

      {/* ---------- Main ---------- */}
      <div className="lg:pl-[248px]">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 lg:pb-16">{children}</main>
      </div>
    </div>
  )
}

function SideLink({ item, compact }: { item: NavItem; compact?: boolean }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cx(
          'flex items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 font-display text-[14.5px] font-extrabold transition-colors',
          compact && 'px-3 py-2 text-[13.5px]',
          isActive
            ? 'border-teal-200 bg-teal-50 text-teal-700'
            : 'border-transparent text-ink-soft hover:bg-shell',
        )
      }
    >
      <span className="w-6 text-center text-lg leading-none" aria-hidden>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-coral-400 px-2 py-0.5 text-[11px] font-extrabold text-white">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      ) : null}
    </NavLink>
  )
}

function LangSwitcher({ inline }: { inline?: boolean }) {
  const { languages, activeLang, setActiveLang } = useProgress()
  const list = languages.length ? languages : (['jp'] as const)
  return (
    <div className={cx(!inline && 'border-t-2 border-sand p-3')}>
      <div className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
        Bahasa aktif
      </div>
      <div className={cx('grid gap-1.5', inline ? 'grid-cols-4' : 'grid-cols-2')}>
        {list.map((id) => {
          const l = LANGUAGES[id]
          const active = id === activeLang
          return (
            <button
              key={id}
              onClick={() => setActiveLang(id)}
              className={cx(
                'flex flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-2 transition-colors',
                active ? 'bg-white' : 'border-transparent hover:bg-shell',
              )}
              style={active ? { borderColor: l.color } : undefined}
              aria-pressed={active}
            >
              <span className="text-lg leading-none" aria-hidden>{l.flag}</span>
              <span className="font-cjk text-[11px] font-bold text-ink-soft">{l.nativeName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MiniStats() {
  const streak = useProgress((s) => s.streak)
  const hearts = useProgress((s) => s.hearts)
  return (
    <div className="flex items-center gap-1.5 text-[13px] font-extrabold">
      <span className="flex items-center gap-1 rounded-full border-2 border-amber-200 bg-amber-50 px-2 py-1">
        <span aria-hidden>🔥</span>{streak}
      </span>
      <span className="flex items-center gap-1 rounded-full border-2 border-coral-200 bg-coral-50 px-2 py-1">
        <span aria-hidden>❤️</span>{hearts}
      </span>
    </div>
  )
}

function TopBar() {
  const { streak, xp, hearts, name, activeLang } = useProgress()
  const lang = LANGUAGES[activeLang]
  const due = useDueCards()

  return (
    <div className="hidden items-center justify-between border-b-2 border-sand bg-white px-6 py-3 lg:flex">
      <div className="flex items-center gap-2.5">
        <WawaMark size={30} badgeColor={lang.color} />
        <div className="leading-tight">
          <div className="font-display text-[15px] font-extrabold text-ink">
            {name ? `Halo, ${name}!` : 'Selamat datang!'}
          </div>
          <div className="text-[12px] text-ink-faint">
            Belajar {lang.name} {lang.nativeName} · {lang.exam}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Pill icon="🔥" value={streak} label="hari" color="amber" />
        <Pill icon="⚡" value={xp} label="XP" color="teal" />
        <Pill icon="❤️" value={`${hearts}/${MAX_HEARTS_CONST}`} label="nyawa" color="coral" />
        {due.length > 0 ? <Pill icon="🔁" value={due.length} label="jatuh tempo" color="grape" /> : null}
      </div>
    </div>
  )
}

function Pill({
  icon, value, label, color,
}: { icon: string; value: React.ReactNode; label: string; color: 'amber' | 'teal' | 'coral' | 'grape' }) {
  const map = {
    amber: 'border-amber-200 bg-amber-50', teal: 'border-teal-200 bg-teal-50',
    coral: 'border-coral-200 bg-coral-50', grape: 'border-grape-200 bg-grape-50',
  }
  return (
    <span className={cx('flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5', map[color])}>
      <span className="text-base leading-none" aria-hidden>{icon}</span>
      <span className="font-display text-[15px] font-extrabold text-ink">{value}</span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</span>
    </span>
  )
}
