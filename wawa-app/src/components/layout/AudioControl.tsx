import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAudio, getCurrentTrack } from '@/store/useAudio'
import { playSound } from '@/lib/sound'
import { Icon, cx } from '@/components/ui'

export function AudioControl({ compact }: { compact?: boolean }) {
  const {
    bgmEnabled,
    bgmVolume,
    sfxEnabled,
    sfxVolume,
    isPlaying,
    currentTrackId,
    toggleBgm,
    setBgmEnabled,
    setBgmVolume,
    setSfxEnabled,
    setSfxVolume,
  } = useAudio()

  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const track = getCurrentTrack(currentTrackId)

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleTestSfx = (e: React.MouseEvent) => {
    e.stopPropagation()
    playSound('tap')
  }

  const bgmPct = Math.round(bgmVolume * 100)
  const sfxPct = Math.round(sfxVolume * 100)

  return (
    <div className="relative" ref={popoverRef}>
      {/* ---------- Main Trigger Button ---------- */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            playSound('tap')
            setOpen((prev) => !prev)
          }}
          aria-expanded={open}
          aria-label="Pengaturan suara dan musik"
          title={`Musik: ${isPlaying ? 'Memutar' : 'Jeda'} (${bgmPct}%) · SFX: ${sfxEnabled ? `${sfxPct}%` : 'Mati'}`}
          className={cx(
            'flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-[13px] font-display font-extrabold transition-all select-none',
            open
              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-[0_2px_0_0_var(--color-teal-700)]'
              : isPlaying
              ? 'border-teal-300 bg-teal-50/70 text-teal-700 hover:bg-teal-100/80 shadow-[0_2px_0_0_var(--color-drop)]'
              : 'border-sand bg-paper text-ink-soft hover:bg-cream shadow-[0_2px_0_0_var(--color-drop)] active:translate-y-[1px]',
            compact ? 'w-full justify-between' : '',
          )}
        >
          <div className="flex items-center gap-2">
            <span className={cx('relative flex items-center justify-center', isPlaying ? 'text-teal-600' : 'text-ink-faint')}>
              <Icon name={isPlaying ? 'music' : !bgmEnabled || bgmVolume === 0 ? 'volumeX' : 'volume'} size={17} />
              {isPlaying ? (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </span>
              ) : null}
            </span>
            <span className="truncate max-w-[95px]">{isPlaying ? 'Musik Aktif' : 'Musik & Suara'}</span>
          </div>

          <div className="flex items-center gap-1">
            {isPlaying ? (
              <span className="flex items-end gap-[2px] h-3.5 px-1 py-[1px] rounded bg-teal-100/90 text-teal-700" title="Memutar musik">
                <span className="w-[3px] bg-teal-600 rounded-full animate-[wawa-eq-1_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
                <span className="w-[3px] bg-teal-600 rounded-full animate-[wawa-eq-2_0.6s_ease-in-out_infinite]" style={{ height: '100%' }} />
                <span className="w-[3px] bg-teal-600 rounded-full animate-[wawa-eq-3_0.9s_ease-in-out_infinite]" style={{ height: '40%' }} />
              </span>
            ) : (
              <span className="text-[11px] font-bold text-ink-faint">{bgmPct}%</span>
            )}
            <Icon name="sliders" size={13} className="text-ink-faint" />
          </div>
        </button>

        {/* Quick play/pause button alongside */}
        {!compact ? (
          <button
            type="button"
            onClick={() => {
              playSound('tap')
              toggleBgm()
            }}
            aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
            title={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
            className={cx(
              'flex h-9 w-9 items-center justify-center rounded-2xl border-2 transition-all select-none',
              isPlaying
                ? 'border-teal-500 bg-teal-500 text-white shadow-[0_2px_0_0_var(--color-teal-700)] active:translate-y-[1px]'
                : 'border-sand bg-paper text-ink-soft hover:bg-cream shadow-[0_2px_0_0_var(--color-drop)] active:translate-y-[1px]',
            )}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={15} />
          </button>
        ) : null}
      </div>

      {/* ---------- Popover Menu ---------- */}
      {open ? (
        <div
          className={cx(
            'absolute z-50 w-72 rounded-3xl border-2 border-sand bg-paper p-4 shadow-[0_8px_0_0_var(--color-drop)]',
            compact
              ? 'bottom-full left-0 mb-2'
              : 'bottom-full left-0 mb-2 lg:bottom-auto lg:top-full lg:mt-2 lg:right-0 lg:left-auto',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-sand pb-2.5">
            <div className="flex items-center gap-2">
              <div className={cx('flex h-8 w-8 items-center justify-center rounded-xl border-2', isPlaying ? 'border-teal-300 bg-teal-50 text-teal-600' : 'border-sand bg-shell text-ink-soft')}>
                <Icon name="disc" size={16} className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} />
              </div>
              <div>
                <div className="font-display text-[14px] font-extrabold text-ink leading-tight">{track.title}</div>
                <div className="text-[11px] text-ink-faint truncate max-w-[150px]">{track.subtitle}</div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('tap')
                toggleBgm()
              }}
              className={cx(
                'flex items-center gap-1.5 rounded-xl border-2 px-2.5 py-1 text-[12px] font-extrabold transition-all',
                isPlaying
                  ? 'border-teal-500 bg-teal-500 text-white shadow-[0_2px_0_0_var(--color-teal-700)]'
                  : 'border-sand bg-shell text-ink-soft hover:bg-cream shadow-[0_2px_0_0_var(--color-drop)]',
              )}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size={13} />
              <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
            </button>
          </div>

          {/* Controls Body */}
          <div className="mt-3.5 space-y-3.5 text-[13px]">
            {/* BGM Volume */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-ink">
                  <Icon name="music" size={14} className="text-teal-600" />
                  <span>Musik Latar (BGM)</span>
                </span>
                <span className="font-mono text-[12px] font-bold text-ink-soft">
                  {!bgmEnabled ? 'Mati' : `${bgmPct}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBgmEnabled(!bgmEnabled)}
                  className="rounded-lg p-1 text-ink-faint hover:bg-shell"
                  title={bgmEnabled ? 'Matikan musik' : 'Nyalakan musik'}
                >
                  <Icon name={!bgmEnabled || bgmVolume === 0 ? 'volumeX' : 'volume1'} size={16} />
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bgmEnabled ? bgmPct : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100
                    setBgmVolume(val)
                    if (!bgmEnabled && val > 0) setBgmEnabled(true)
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-shell accent-teal-500 border border-sand"
                />
              </div>
            </div>

            {/* SFX Volume */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-ink">
                  <Icon name="sound" size={14} className="text-amber-600" />
                  <span>Efek Suara (SFX)</span>
                </span>
                <span className="font-mono text-[12px] font-bold text-ink-soft">
                  {!sfxEnabled ? 'Mati' : `${sfxPct}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSfxEnabled(!sfxEnabled)}
                  className="rounded-lg p-1 text-ink-faint hover:bg-shell"
                  title={sfxEnabled ? 'Matikan efek suara' : 'Nyalakan efek suara'}
                >
                  <Icon name={!sfxEnabled || sfxVolume === 0 ? 'volumeX' : 'volume1'} size={16} />
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sfxEnabled ? sfxPct : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100
                    setSfxVolume(val)
                    if (!sfxEnabled && val > 0) setSfxEnabled(true)
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-shell accent-amber-500 border border-sand"
                />
              </div>
            </div>
          </div>

          {/* Quick Footer Action */}
          <div className="mt-4 flex items-center justify-between border-t-2 border-sand pt-2.5 text-[12px]">
            <button
              type="button"
              onClick={handleTestSfx}
              className="flex items-center gap-1 font-bold text-ink-soft hover:text-teal-600"
            >
              <Icon name="sparkle" size={13} />
              <span>Tes Suara</span>
            </button>

            <Link
              to="/profil"
              onClick={() => setOpen(false)}
              className="font-extrabold text-teal-600 hover:underline"
            >
              Pengaturan Lengkap →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Top bar mini indicator for music playback */
export function TopBarAudioPill() {
  const { isPlaying, toggleBgm, bgmVolume } = useAudio()
  const bgmPct = Math.round(bgmVolume * 100)

  return (
    <button
      type="button"
      onClick={() => {
        playSound('tap')
        toggleBgm()
      }}
      title={isPlaying ? `Musik Berjalan (${bgmPct}%). Klik untuk jeda.` : 'Klik untuk putar musik fokus.'}
      className={cx(
        'hidden sm:flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 transition-all select-none',
        isPlaying
          ? 'border-teal-300 bg-teal-50 text-teal-700 shadow-[0_2px_0_0_var(--color-teal-700)]'
          : 'border-sand bg-shell text-ink-faint hover:bg-cream',
      )}
    >
      <Icon name={isPlaying ? 'music' : 'volume'} size={15} className={isPlaying ? 'text-teal-600' : 'text-ink-faint'} />
      <span className="font-display text-[13px] font-extrabold text-ink">
        {isPlaying ? 'Focus BGM' : 'Musik'}
      </span>
      {isPlaying ? (
        <span className="flex items-end gap-[2px] h-3 px-1 rounded bg-teal-200/80 text-teal-800">
          <span className="w-[2px] h-2 bg-teal-700 rounded-full animate-[wawa-eq-1_0.7s_ease-in-out_infinite]" />
          <span className="w-[2px] h-3 bg-teal-700 rounded-full animate-[wawa-eq-2_0.5s_ease-in-out_infinite]" />
          <span className="w-[2px] h-1.5 bg-teal-700 rounded-full animate-[wawa-eq-3_0.8s_ease-in-out_infinite]" />
        </span>
      ) : (
        <span className="text-[11px] font-bold text-ink-faint">Off</span>
      )}
    </button>
  )
}
