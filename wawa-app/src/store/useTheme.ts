import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeState = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode })
        applyTheme(mode)
      },
    }),
    {
      name: 'wawa-theme',
      onRehydrateStorage: () => (state) => applyTheme(state?.mode ?? 'system'),
    },
  ),
)

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const dark = resolveTheme(mode) === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#101c21' : '#00a191')
}

/** Keep "system" live when the OS flips while the app is open. */
export function watchSystemTheme() {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (useTheme.getState().mode === 'system') applyTheme('system')
  }
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/** Applied before React mounts so there is no light-mode flash. */
export function initThemeEarly() {
  try {
    const raw = localStorage.getItem('wawa-theme')
    const mode: ThemeMode = raw ? (JSON.parse(raw).state?.mode ?? 'system') : 'system'
    applyTheme(mode)
  } catch {
    applyTheme('system')
  }
}
