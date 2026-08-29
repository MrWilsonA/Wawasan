import { useAudio, getCurrentTrack } from '@/store/useAudio'

export type SoundName = 'tap' | 'correct' | 'wrong' | 'levelComplete'

const sfxSounds: Record<SoundName, { src: string; baseVolume: number }> = {
  tap: { src: '/audio/sfx/tap.mp3', baseVolume: 0.35 },
  correct: { src: '/audio/sfx/correct.mp3', baseVolume: 0.5 },
  wrong: { src: '/audio/sfx/wrong.mp3', baseVolume: 0.4 },
  levelComplete: { src: '/audio/sfx/level-complete.mp3', baseVolume: 0.55 },
}

const sfxCache = new Map<SoundName, HTMLAudioElement>()

function getSfx(name: SoundName) {
  if (typeof Audio === 'undefined') return null
  const existing = sfxCache.get(name)
  if (existing) return existing

  const audio = new Audio(sfxSounds[name].src)
  audio.preload = 'auto'
  sfxCache.set(name, audio)
  return audio
}

export function preloadSounds() {
  if (typeof Audio === 'undefined') return
  for (const name of Object.keys(sfxSounds) as SoundName[]) {
    getSfx(name)?.load()
  }
}

/** Plays a short, non-blocking UI sound effect if SFX is enabled. */
export function playSound(name: SoundName) {
  if (typeof Audio === 'undefined') return
  const { sfxEnabled, sfxVolume } = useAudio.getState()
  if (!sfxEnabled || sfxVolume <= 0) return

  const source = getSfx(name)
  if (!source) return

  try {
    const audio = source.cloneNode(true) as HTMLAudioElement
    audio.volume = Math.max(0, Math.min(1, sfxSounds[name].baseVolume * sfxVolume))
    void audio.play().catch(() => undefined)
  } catch {
    // Harmless browser audio restriction ignore
  }
}

/* ============================================================
   BGM Engine (Background Music)
   ============================================================ */

class BgmEngine {
  private audio: HTMLAudioElement | null = null
  private currentSrc: string = ''
  private initialized: boolean = false
  private pendingAutoplay: boolean = false

  init() {
    if (this.initialized || typeof window === 'undefined' || typeof Audio === 'undefined') return
    this.initialized = true

    this.audio = new Audio()
    this.audio.loop = true
    this.audio.preload = 'metadata'

    this.audio.addEventListener('play', () => {
      useAudio.getState().setIsPlaying(true)
    })

    this.audio.addEventListener('pause', () => {
      // only mark not playing if we are not actively in pending playback state
      if (!this.pendingAutoplay) {
        useAudio.getState().setIsPlaying(false)
      }
    })

    // Listen to store updates
    useAudio.subscribe((state) => {
      this.syncWithState(state)
    })

    // Listen for first user interaction to unlock audio context if autoplay was blocked
    const unlockAudio = () => {
      if (this.audio) {
        const state = useAudio.getState()
        if (state.bgmEnabled && state.isPlaying) {
          if (this.audio.paused) {
            this.play()
          }
          this.pendingAutoplay = false
        }
      }
    }

    window.addEventListener('click', unlockAudio, { passive: true })
    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio, { passive: true })
    window.addEventListener('touchstart', unlockAudio, { passive: true })

    // Sync initial state and attempt start immediately
    const initialState = useAudio.getState()
    this.syncWithState(initialState)
    if (initialState.bgmEnabled && initialState.isPlaying) {
      this.play()
    }
  }

  private syncWithState(state: ReturnType<typeof useAudio.getState>) {
    if (!this.audio) return

    const track = getCurrentTrack(state.currentTrackId)
    const effectiveVolume = state.bgmEnabled ? state.bgmVolume : 0

    this.audio.volume = Math.max(0, Math.min(1, effectiveVolume))

    // Update track source if changed
    if (this.currentSrc !== track.src) {
      this.currentSrc = track.src
      const wasPlaying = !this.audio.paused
      this.audio.src = track.src
      this.audio.load()
      if (wasPlaying || state.isPlaying) {
        this.play()
      }
    }

    // Handle play / pause transition
    if (state.isPlaying && state.bgmEnabled) {
      if (this.audio.paused) {
        this.play()
      }
    } else {
      if (!this.audio.paused) {
        this.audio.pause()
      }
      this.pendingAutoplay = false
    }
  }

  private play() {
    if (!this.audio) return
    const state = useAudio.getState()
    const track = getCurrentTrack(state.currentTrackId)

    if (!this.audio.src || this.currentSrc !== track.src) {
      this.audio.src = track.src
      this.currentSrc = track.src
    }

    this.audio.volume = Math.max(0, Math.min(1, state.bgmEnabled ? state.bgmVolume : 0))

    const promise = this.audio.play()
    if (promise !== undefined) {
      promise.catch((err) => {
        // Autoplay policy prevented immediate playback until user interacts
        if (err?.name === 'NotAllowedError') {
          this.pendingAutoplay = true
        }
      })
    }
  }

  forcePlay() {
    this.play()
  }
}

export const bgmEngine = new BgmEngine()

/** Starts background music immediately and unlocks audio context */
export function startBgm() {
  const state = useAudio.getState()
  state.setBgmEnabled(true)
  state.setIsPlaying(true)
  bgmEngine.forcePlay()
}

/** Initialize audio subsystem and subscribe to audio state */
export function initAudioSystem() {
  preloadSounds()
  bgmEngine.init()
}
