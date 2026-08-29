import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Track = {
  id: string
  title: string
  subtitle: string
  src: string
  format: string
}

export const TRACKS: Track[] = [
  {
    id: 'curious-focus',
    title: 'Curious Focus',
    subtitle: 'Musik Latar Relaksasi & Fokus Belajar WAWA',
    src: '/audio/bgm/curious-focus.wav',
    format: 'WAV 44.1kHz',
  },
]

type AudioState = {
  /* ---- settings ---- */
  bgmEnabled: boolean
  bgmVolume: number // 0.0 - 1.0
  sfxEnabled: boolean
  sfxVolume: number // 0.0 - 1.0

  /* ---- player state ---- */
  currentTrackId: string
  isPlaying: boolean

  /* ---- actions ---- */
  setBgmEnabled: (enabled: boolean) => void
  setBgmVolume: (volume: number) => void
  setSfxEnabled: (enabled: boolean) => void
  setSfxVolume: (volume: number) => void
  setIsPlaying: (playing: boolean) => void
  toggleBgm: () => void
  playBgm: () => void
  pauseBgm: () => void
  setTrack: (trackId: string) => void
}

export const useAudio = create<AudioState>()(
  persist(
    (set, get) => ({
      bgmEnabled: true,
      bgmVolume: 0.35,
      sfxEnabled: true,
      sfxVolume: 0.65,
      currentTrackId: 'curious-focus',
      isPlaying: true,

      setBgmEnabled: (enabled) => {
        set({ bgmEnabled: enabled })
        if (!enabled && get().isPlaying) {
          get().pauseBgm()
        } else if (enabled && !get().isPlaying) {
          get().playBgm()
        }
      },

      setBgmVolume: (volume) => {
        const clamped = Math.max(0, Math.min(1, volume))
        set({ bgmVolume: clamped })
      },

      setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),

      setSfxVolume: (volume) => {
        const clamped = Math.max(0, Math.min(1, volume))
        set({ sfxVolume: clamped })
      },

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      toggleBgm: () => {
        const { isPlaying, playBgm, pauseBgm } = get()
        if (isPlaying) {
          pauseBgm()
        } else {
          playBgm()
        }
      },

      playBgm: () => {
        set({ isPlaying: true, bgmEnabled: true })
      },

      pauseBgm: () => {
        set({ isPlaying: false })
      },

      setTrack: (trackId) => {
        set({ currentTrackId: trackId })
      },
    }),
    {
      name: 'wawa-audio-settings-v2',
      partialize: (state) => ({
        bgmEnabled: state.bgmEnabled,
        bgmVolume: state.bgmVolume,
        sfxEnabled: state.sfxEnabled,
        sfxVolume: state.sfxVolume,
        currentTrackId: state.currentTrackId,
        isPlaying: state.isPlaying,
      }),
    },
  ),
)

export function getCurrentTrack(trackId: string): Track {
  return TRACKS.find((t) => t.id === trackId) || TRACKS[0]
}
