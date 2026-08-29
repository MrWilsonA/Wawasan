import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Logo, WawaMark } from '@/brand/Logo'
import { useProgress, useDueCards } from '@/store/useProgress'
import { LANGUAGES, LANG_ORDER } from '@/data/languages'
import { cx, Icon, FlagIcon, type IconName } from '@/components/ui'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { AudioControl, TopBarAudioPill } from '@/components/layout/AudioControl'
import { Scenery } from '@/components/decor/Scenery'
import { playSound, preloadSounds } from '@/lib/sound'

type NavItem = { to: string; label: string; icon: IconName; badge?: number }

export function Shell({ children, onOpenSplash }: { children: React.ReactNode; onOpenSplash: () => void }) {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const due = useDueCards()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => preloadSounds(), [])

  const openSplash = () => {
    playSound('tap')
    onOpenSplash()
  }

  const nav: NavItem[] = [
    { to: '/', label: 'Beranda', icon: 'home' },
    { to: `/belajar/${activeLang}`, label: 'Jalur Belajar', icon: 'path' },
    { to: '/ulang', label: 'Kartu Ulang', icon: 'review', badge: due.length },
    { to: '/menyimak', label: `Menyimak ${lang.name}`, icon: 'listen' },
    { to: '/aksara', label: activeLang === 'en' ? 'Bunyi & Ejaan' : `Aksara ${lang.name}`, icon: 'script' },
    ...(activeLang === 'jp' || activeLang === 'cn'
      ? [{ to: '/karakter', label: activeLang === 'jp' ? 'Bank Kanji' : 'Bank Hanzi', icon: 'characters' as const }]
      : []),
    ...(activeLang === 'en'
      ? [{ to: '/kamus', label: 'Kamus Inggris', icon: 'dictionary' as const }]
      : []),
    { to: '/tanya', label: 'Latihan AI', icon: 'bot' },
    { to: '/menulis', label: 'Latihan Menulis', icon: 'writing' },
    { to: '/ujian', label: 'Kalkulator Ujian', icon: 'exam' },
    { to: '/referensi', label: 'Referensi', icon: 'reference' },
    { to: '/metode', label: 'Metode', icon: 'method' },
    { to: '/profil', label: 'Profil', icon: 'profile' },
  ]

  return (
    <div className="relative min-h-screen">
      <Scenery lang={activeLang} />
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r-2 border-sand bg-paper lg:flex">
        <div className="px-5 py-5">
          <button type="button" onClick={openSplash} aria-label="Buka menu bahasa WAWA">
            <Logo size={42} badgeColor={lang.color} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {nav.map((n) => (
            <SideLink key={n.to} item={n} />
          ))}
        </nav>

        <div className="space-y-2 border-t-2 border-sand p-3">
          <AudioControl compact />
          <ThemeToggle />
        </div>
      </aside>

      {/* ---------- Mobile header ---------- */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-sand bg-paper px-4 py-3 lg:hidden">
        <button type="button" onClick={openSplash} aria-label="Buka menu bahasa WAWA">
          <Logo size={34} badgeColor={lang.color} />
        </button>
        <div className="flex items-center gap-2">
          <MiniStats />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            className="rounded-xl border-2 border-sand bg-paper px-3 py-2 text-lg leading-none shadow-[0_3px_0_0_var(--color-drop)] active:translate-y-[2px] active:shadow-none"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[62px] z-40 border-b-2 border-sand bg-paper p-3 shadow-[0_6px_0_0_var(--color-drop)] lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {nav.map((n) => (
              <SideLink key={n.to} item={n} compact />
            ))}
          </nav>
          <div className="mt-3 space-y-2 border-t-2 border-sand pt-3">
            <AudioControl compact />
            <ThemeToggle />
          </div>
        </div>
      ) : null}

      {/* ---------- Main ---------- */}
      <div className="relative z-10 lg:pl-[248px]">
        <TopBar />
        <LanguageTabs />
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
      <span className="flex w-6 justify-center"><Icon name={item.icon} size={19} /></span>
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-coral-400 px-2 py-0.5 text-[11px] font-extrabold text-white">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      ) : null}
    </NavLink>
  )
}

function LanguageTabs() {
  const { activeLang, setActiveLang } = useProgress()
  const navigate = useNavigate()
  const location = useLocation()

  const selectLanguage = (id: (typeof LANG_ORDER)[number]) => {
    playSound('tap')
    setActiveLang(id)
    if (/^\/(belajar|pelajaran|materi)\//.test(location.pathname)) {
      navigate(`/belajar/${id}`)
    } else if (location.pathname === '/karakter' && id !== 'jp' && id !== 'cn') {
      navigate('/aksara')
    } else if (location.pathname === '/kamus' && id !== 'en') {
      navigate('/')
    }
  }
  return (
    <div className="border-b-2 border-sand bg-paper/95 px-3 sm:px-6" role="tablist" aria-label="Pilih bahasa belajar">
      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto py-2">
        {LANG_ORDER.map((id) => {
          const l = LANGUAGES[id]
          const active = id === activeLang
          return (
            <button
              key={id}
              onClick={() => selectLanguage(id)}
              role="tab"
              aria-selected={active}
              className={cx(
                'flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 transition-all sm:px-4',
                active ? 'bg-paper shadow-[0_3px_0_0_var(--color-drop)]' : 'border-transparent text-ink-faint hover:bg-shell',
              )}
              style={active ? { borderColor: l.color } : undefined}
            >
              <FlagIcon lang={id} size={20} />
              <span className="font-display text-[12.5px] font-extrabold text-ink sm:text-[13.5px]">{l.name}</span>
              <span className="hidden font-cjk text-[10.5px] font-bold text-ink-faint md:inline">{l.nativeName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MiniStats() {
  const streak = useProgress((s) => s.streak)
  return (
    <div className="flex items-center gap-1.5 text-[13px] font-extrabold">
      <span className="flex items-center gap-1 rounded-full border-2 border-amber-200 bg-amber-50 px-2 py-1">
        <Icon name="streak" size={14} />{streak}
      </span>
    </div>
  )
}

function TopBar() {
  const { streak, xp, name, activeLang } = useProgress()
  const lang = LANGUAGES[activeLang]
  const due = useDueCards()

  return (
    <div className="hidden items-center justify-between border-b-2 border-sand bg-paper px-6 py-3 lg:flex">
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
        <TopBarAudioPill />
        <Pill icon="streak" value={streak} label="hari" color="amber" />
        <Pill icon="xp" value={xp} label="XP" color="teal" />
        {due.length > 0 ? <Pill icon="review" value={due.length} label="jatuh tempo" color="grape" /> : null}
      </div>
    </div>
  )
}

function Pill({
  icon, value, label, color,
}: { icon: IconName; value: React.ReactNode; label: string; color: 'amber' | 'teal' | 'coral' | 'grape' }) {
  const map = {
    amber: 'border-amber-200 bg-amber-50', teal: 'border-teal-200 bg-teal-50',
    coral: 'border-coral-200 bg-coral-50', grape: 'border-grape-200 bg-grape-50',
  }
  return (
    <span className={cx('flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5', map[color])}>
      <Icon name={icon} size={16} />
      <span className="font-display text-[15px] font-extrabold text-ink">{value}</span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</span>
    </span>
  )
}
