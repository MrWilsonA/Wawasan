/**
 * Compact brand system based on the same outline-free pet tarsier used by
 * the full Wawa mascot. The mark stays readable in the 28–42px UI range.
 */
const FUR = '#c98246'
const CREAM = '#fff0c9'
const EAR = '#f5a27e'
const AMBER = '#f7b928'
const PUPIL = '#39251f'
const NOSE = '#a9563c'

export function WawaMark({
  size = 40,
  badge = true,
  badgeColor = '#00a191',
  className = '',
}: {
  size?: number
  badge?: boolean
  badgeColor?: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {badge ? <rect x="3" y="3" width="94" height="94" rx="29" fill={badgeColor} /> : null}
      {badge ? <circle cx="50" cy="51" r="40" fill={CREAM} opacity="0.96" /> : null}

      <circle cx="25" cy="34" r="16" fill={FUR} />
      <circle cx="75" cy="34" r="16" fill={FUR} />
      <circle cx="25" cy="35" r="9" fill={EAR} />
      <circle cx="75" cy="35" r="9" fill={EAR} />
      <ellipse cx="50" cy="55" rx="34" ry="32" fill={FUR} />

      <path d="M50 78c-15 0-28-11-29-27-1-12 6-21 16-21 6 0 11 4 13 10 2-6 7-10 13-10 10 0 17 9 16 21-1 16-14 27-29 27z" fill={CREAM} />
      <circle cx="36" cy="52" r="13" fill={AMBER} />
      <circle cx="64" cy="52" r="13" fill={AMBER} />
      <circle cx="36" cy="53" r="7" fill={PUPIL} />
      <circle cx="64" cy="53" r="7" fill={PUPIL} />
      <circle cx="33" cy="49" r="2.4" fill="#fff" />
      <circle cx="61" cy="49" r="2.4" fill="#fff" />
      <ellipse cx="50" cy="65" rx="4.5" ry="3.8" fill={NOSE} />
      <path d="M41 70c6 7 12 7 18 0-2 10-16 10-18 0z" fill={PUPIL} />
      <path d="M46 20l4-10 5 10z" fill={FUR} />
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
            className="flex items-baseline font-display font-extrabold tracking-[-0.035em] text-ink"
            style={{ fontSize: size * 0.56 }}
          >
            WAWA
            <span
              className="ml-1 rounded-md bg-teal-50 px-1 py-0.5 font-cjk text-teal-600"
              style={{ fontSize: size * 0.38 }}
            >
              さん
            </span>
          </span>
          <span
            className="mt-1 block font-extrabold uppercase tracking-[0.2em] text-ink-faint"
            style={{ fontSize: size * 0.18 }}
          >
            Bahasa jadi dekat
          </span>
        </span>
      ) : null}
    </span>
  )
}
