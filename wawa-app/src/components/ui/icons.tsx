/**
 * Icon layer.
 *
 * Every pictogram in the app comes from lucide-react — no emoji anywhere, so
 * glyphs render identically on Windows, Android and iOS, inherit `currentColor`
 * in dark mode, and can be sized on a consistent grid.
 *
 * Flags are the one thing lucide has no equivalent for, so they are drawn here
 * as flat vector marks (no outline) in the same style as the rest of the art.
 */
import {
  Home, Map, RefreshCw, Languages, PenLine, Target, BarChart3, Compass, User,
  Volume2, Volume1, VolumeX, Music, SlidersHorizontal, Disc, BookOpen, Bone, Mic, Flag, ScrollText, Brain, Scale, KeyRound,
  Lightbulb, AlertTriangle, Sparkles, Flame, Zap, Heart, Trophy, GraduationCap,
  Clock, Check, X, ChevronRight, ChevronLeft, ChevronDown, Search, Play, Pause,
  RotateCcw, Trash2, Plus, Minus, Settings, Sun, Moon, Monitor, Menu, Send,
  MessageCircle, Bot, Sprout, Leaf, TreePine, Book, NotebookPen, Eraser,
  Grid3x3, Type, ListChecks, Shuffle, Link2, ArrowUpDown, CircleCheck,
  CircleX, Lock, Star, Calendar, TrendingUp, Headphones, Eye, Hand, Users,
  FileText, ExternalLink, Copy, Loader2, PartyPopper, Coffee, Moon as MoonIcon,
  Info, CircleHelp, Wand2, Layers, Filter, ArrowRight, ArrowLeft, Download,
  type LucideIcon,
} from 'lucide-react'

export type { LucideIcon }

export const Icons = {
  // nav
  home: Home,
  path: Map,
  review: RefreshCw,
  script: Languages,
  writing: PenLine,
  exam: Target,
  reference: BarChart3,
  method: Compass,
  profile: User,
  chat: MessageCircle,
  dictionary: Book,
  characters: Type,

  // gates & audio
  sound: Volume2,
  volume: Volume2,
  volume1: Volume1,
  volumeX: VolumeX,
  music: Music,
  disc: Disc,
  sliders: SlidersHorizontal,
  letters: BookOpen,
  words: BookOpen,
  grammar: Bone,
  production: Mic,
  strategy: Flag,

  // teaching-note kinds
  story: ScrollText,
  concept: Brain,
  contrast: Scale,
  formula: KeyRound,
  tip: Lightbulb,
  warning: AlertTriangle,

  // stats
  sparkle: Sparkles,
  streak: Flame,
  xp: Zap,
  heart: Heart,
  trophy: Trophy,
  grad: GraduationCap,
  clock: Clock,
  calendar: Calendar,
  trend: TrendingUp,
  star: Star,
  lock: Lock,

  // exercise types
  choice: ListChecks,
  judge: CircleCheck,
  fill: Type,
  type: NotebookPen,
  match: Link2,
  order: ArrowUpDown,
  sort: Shuffle,

  // skills
  listen: Headphones,
  read: Eye,
  write: Hand,
  speak: Users,

  // actions
  check: Check,
  close: X,
  next: ChevronRight,
  prev: ChevronLeft,
  down: ChevronDown,
  search: Search,
  play: Play,
  pause: Pause,
  reset: RotateCcw,
  trash: Trash2,
  plus: Plus,
  minus: Minus,
  settings: Settings,
  menu: Menu,
  send: Send,
  copy: Copy,
  external: ExternalLink,
  download: Download,
  filter: Filter,
  layers: Layers,
  right: ArrowRight,
  left: ArrowLeft,
  info: Info,
  help: CircleHelp,
  wand: Wand2,
  bot: Bot,
  loader: Loader2,
  wrong: CircleX,
  doc: FileText,
  grid: Grid3x3,
  eraser: Eraser,

  // theme
  sun: Sun,
  moon: Moon,
  system: Monitor,

  // misc flavour
  seedling: Sprout,
  leaf: Leaf,
  tree: TreePine,
  party: PartyPopper,
  coffee: Coffee,
  rest: MoonIcon,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof Icons

/** Render an icon by name; falls back to nothing rather than throwing. */
export function Icon({
  name, size = 18, className = '', strokeWidth = 2.5,
}: { name: IconName; size?: number; className?: string; strokeWidth?: number }) {
  const C = Icons[name]
  if (!C) return null
  return <C size={size} className={className} strokeWidth={strokeWidth} aria-hidden />
}

/* ===================== Flags — flat vector, no outline ===================== */

const FLAGS = {
  jp: (
    <>
      <rect width="24" height="16" rx="3" fill="#fff" />
      <circle cx="12" cy="8" r="4.4" fill="#e8564f" />
    </>
  ),
  cn: (
    <>
      <rect width="24" height="16" rx="3" fill="#e0453c" />
      <path d="M6 3.4l.85 2.1 2.25.16-1.73 1.45.55 2.19L6 8.13 4.08 9.3l.55-2.19L2.9 5.66l2.25-.16z" fill="#ffd94a" />
      <circle cx="11.4" cy="2.9" r=".85" fill="#ffd94a" />
      <circle cx="13.3" cy="5" r=".85" fill="#ffd94a" />
      <circle cx="13.3" cy="7.7" r=".85" fill="#ffd94a" />
      <circle cx="11.4" cy="9.7" r=".85" fill="#ffd94a" />
    </>
  ),
  kr: (
    <>
      <rect width="24" height="16" rx="3" fill="#fff" />
      <path d="M12 4.2a3.8 3.8 0 010 7.6 3.8 3.8 0 010-7.6z" fill="#4a7fe0" />
      <path d="M12 4.2a1.9 1.9 0 010 3.8 1.9 1.9 0 000 3.8 3.8 3.8 0 000-7.6z" fill="#e0453c" />
      <g fill="#17313c">
        <rect x="3.4" y="3.1" width="3.4" height=".7" rx=".35" transform="rotate(33 5.1 3.45)" />
        <rect x="3.4" y="4.3" width="3.4" height=".7" rx=".35" transform="rotate(33 5.1 4.65)" />
        <rect x="17.2" y="11.2" width="3.4" height=".7" rx=".35" transform="rotate(33 18.9 11.55)" />
        <rect x="17.2" y="12.4" width="3.4" height=".7" rx=".35" transform="rotate(33 18.9 12.75)" />
      </g>
    </>
  ),
  en: (
    <>
      <rect width="24" height="16" rx="3" fill="#2b4b9b" />
      <path d="M0 1.6l24 12.8M24 1.6L0 14.4" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 1.6l24 12.8M24 1.6L0 14.4" stroke="#e0453c" strokeWidth="1.2" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="4.4" />
      <path d="M12 0v16M0 8h24" stroke="#e0453c" strokeWidth="2.4" />
    </>
  ),
} as const

export function FlagIcon({
  lang, size = 22, className = '',
}: { lang: keyof typeof FLAGS; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      width={size}
      height={(size / 24) * 16}
      className={'shrink-0 rounded-[3px] ' + className}
      aria-hidden
    >
      <defs>
        <clipPath id={`fc-${lang}`}>
          <rect width="24" height="16" rx="3" />
        </clipPath>
      </defs>
      <g clipPath={`url(#fc-${lang})`}>{FLAGS[lang]}</g>
    </svg>
  )
}
