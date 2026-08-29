/**
 * The WAWAさん logo system.
 *
 * `WawaMark` is Wawa's head reduced until it still reads at 20px — that
 * reduction *is* the logo. Same ink weight, same flat fills, no gradients,
 * so the mark and the full mascot are obviously the same character.
 */

const INK = '#17313c'
const FUR = '#f6d9a8'
const EAR = '#ffb3a3'
const EYE = '#ffcd3c'
const NOSE = '#e08a76'

export function WawaMark({
  size = 40,
  badge = true,
  badgeColor = '#00a191',
  className = '',
}: {
  size?: number
  /** draw the rounded-square brand tile behind the head */
  badge?: boolean
  badgeColor?: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {badge ? (
        <rect x="2" y="2" width="96" height="96" rx="28" fill={badgeColor} stroke={INK} strokeWidth="5" />
      ) : null}

      {/* ears */}
      <ellipse cx="22" cy="34" rx="13" ry="15" fill={FUR} stroke={INK} strokeWidth="4.5" transform="rotate(-16 22 34)" />
      <ellipse cx="22" cy="35" rx="6" ry="7.5" fill={EAR} transform="rotate(-16 22 35)" />
      <ellipse cx="78" cy="34" rx="13" ry="15" fill={FUR} stroke={INK} strokeWidth="4.5" transform="rotate(16 78 34)" />
      <ellipse cx="78" cy="35" rx="6" ry="7.5" fill={EAR} transform="rotate(16 78 35)" />

      {/* tuft + head */}
      <path d="M41 24 L50 12 L59 24 Z" fill={FUR} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
      <ellipse cx="50" cy="54" rx="33" ry="31" fill={FUR} stroke={INK} strokeWidth="4.5" />
      <ellipse cx="50" cy="69" rx="15" ry="11" fill="#fff6e2" />

      {/* eyes — the defining feature */}
      <circle cx="34" cy="52" r="15" fill={EYE} stroke={INK} strokeWidth="4.5" />
      <circle cx="34" cy="52" r="8" fill={INK} />
      <circle cx="31" cy="49" r="3.2" fill="#fff" />
      <circle cx="66" cy="52" r="15" fill={EYE} stroke={INK} strokeWidth="4.5" />
      <circle cx="66" cy="52" r="8" fill={INK} />
      <circle cx="63" cy="49" r="3.2" fill="#fff" />

      {/* nose + smile */}
      <path d="M50 63 L54 68 Q50 71 46 68 Z" fill={NOSE} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M50 72 Q45 78 40 74" />
        <path d="M50 72 Q55 78 60 74" />
      </g>
    </svg>
  )
}

export function Logo({
  size = 40,
  showWordmark = true,
  badgeColor = '#00a191',
  className = '',
}: {
  size?: number
  showWordmark?: boolean
  badgeColor?: string
  className?: string
}) {
  return (
    <span className={'inline-flex items-center gap-2.5 ' + className}>
      <WawaMark size={size} badgeColor={badgeColor} />
      {showWordmark ? (
        <span className="leading-none">
          <span
            className="block font-display font-extrabold tracking-tight text-ink"
            style={{ fontSize: size * 0.56 }}
          >
            WAWA<span className="font-cjk text-teal-500">さん</span>
          </span>
          <span
            className="block font-bold uppercase tracking-[0.18em] text-ink-faint"
            style={{ fontSize: size * 0.2, marginTop: size * 0.06 }}
          >
            Belajar Bahasa
          </span>
        </span>
      ) : null}
    </span>
  )
}
