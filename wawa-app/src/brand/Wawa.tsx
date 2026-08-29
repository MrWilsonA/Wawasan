/**
 * Wawa is an original Sulawesi tarsier drawn as a compact desktop-pet mascot.
 * The artwork uses only closed, flat shapes: no outlines, gradients, filters,
 * textures, or hair details. It stays readable at small avatar sizes.
 */
export type WawaExpression =
  | 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrate'
  | 'sleep' | 'wave' | 'teach' | 'wow' | 'love'

export type WawaProps = {
  expression?: WawaExpression
  size?: number
  accent?: string
  className?: string
  cropped?: boolean
  title?: string
}

const FUR = '#c98246'
const FUR_DARK = '#9b5d32'
const CREAM = '#fff0c9'
const EAR = '#f5a27e'
const AMBER = '#f7b928'
const PUPIL = '#39251f'
const NOSE = '#a9563c'

export function Wawa({
  expression = 'happy',
  size = 160,
  accent = '#00a191',
  className = '',
  cropped = false,
  title,
}: WawaProps) {
  const celebrating = expression === 'celebrate' || expression === 'excited'
  const waving = expression === 'wave' || expression === 'teach'

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {!cropped ? (
        <path d="M57 158C25 170 15 144 25 124c8-15 27-13 31-1 4 13-12 21-20 12 4 16 23 10 28-2l8 16c-4 4-9 7-15 9z" fill={FUR_DARK} />
      ) : null}
      <ellipse cx="101" cy="151" rx="47" ry="43" fill={FUR} />
      <ellipse cx="101" cy="158" rx="27" ry="29" fill={CREAM} />
      <ellipse cx="76" cy="184" rx="17" ry="8" fill={FUR_DARK} />
      <ellipse cx="126" cy="184" rx="17" ry="8" fill={FUR_DARK} />

      {celebrating ? (
        <>
          <path d="M66 144c-12 2-23-7-26-19l10-5c5 9 12 13 22 12z" fill={FUR} />
          <path d="M136 144c12 2 23-7 26-19l-10-5c-5 9-12 13-22 12z" fill={FUR} />
        </>
      ) : waving ? (
        <>
          <ellipse cx="66" cy="153" rx="11" ry="14" fill={FUR} />
          <path d="M136 151c12-5 19-16 18-29l-11-1c-2 9-7 16-15 20z" fill={FUR} />
          <circle cx="155" cy="118" r="7" fill={EAR} />
        </>
      ) : (
        <>
          <ellipse cx="66" cy="153" rx="11" ry="14" fill={FUR_DARK} />
          <ellipse cx="136" cy="153" rx="11" ry="14" fill={FUR_DARK} />
        </>
      )}

      <ellipse cx="48" cy="67" rx="30" ry="34" fill={FUR} />
      <ellipse cx="154" cy="67" rx="30" ry="34" fill={FUR} />
      <ellipse cx="48" cy="68" rx="18" ry="22" fill={EAR} />
      <ellipse cx="154" cy="68" rx="18" ry="22" fill={EAR} />

      <ellipse cx="101" cy="91" rx="63" ry="58" fill={FUR} />
      <path d="M101 123c-16 0-33-10-40-27-8-20 0-42 18-47 10-3 18 1 22 10 4-9 12-13 22-10 18 5 26 27 18 47-7 17-24 27-40 27z" fill={CREAM} />
      <Eyes expression={expression} />
      <ellipse cx="101" cy="101" rx="6" ry="5" fill={NOSE} />
      <Mouth expression={expression} />

      <path d="M70 125c17 9 45 9 62 0l-5 19-26 14-26-14z" fill={accent} />
      <circle cx="101" cy="137" r="7" fill={FUR_DARK} />
      <Decor expression={expression} accent={accent} />
    </svg>
  )
}

function Eyes({ expression }: { expression: WawaExpression }) {
  if (expression === 'sleep') {
    return (
      <>
        <path d="M63 82c7 8 16 8 23 0-3 13-20 13-23 0z" fill={PUPIL} />
        <path d="M116 82c7 8 16 8 23 0-3 13-20 13-23 0z" fill={PUPIL} />
      </>
    )
  }

  if (expression === 'love') {
    return (
      <>
        <path d="M75 96C55 81 63 66 75 76c12-10 20 5 0 20z" fill="#e8564f" />
        <path d="M127 96c-20-15-12-30 0-20 12-10 20 5 0 20z" fill="#e8564f" />
      </>
    )
  }

  const wide = expression === 'wow' || expression === 'excited' || expression === 'celebrate'
  const sad = expression === 'sad'
  const look = expression === 'thinking' ? 4 : expression === 'teach' ? -3 : 0
  const r = wide ? 25 : 23
  const pr = wide ? 13 : 12

  return (
    <>
      {[75, 127].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={82} r={r} fill={AMBER} />
          <circle cx={cx + look} cy={82 + (sad ? 3 : 0)} r={pr} fill={PUPIL} />
          <circle cx={cx + look - 4} cy={77 + (sad ? 3 : 0)} r="3.5" fill="#fff" />
        </g>
      ))}
      {sad ? (
        <>
          <path d="M57 63c9-6 19-7 29-3l-2 5c-9-2-17-1-25 3z" fill={FUR_DARK} />
          <path d="M145 63c-9-6-19-7-29-3l2 5c9-2 17-1 25 3z" fill={FUR_DARK} />
        </>
      ) : null}
    </>
  )
}

function Mouth({ expression }: { expression: WawaExpression }) {
  if (expression === 'wow') return <ellipse cx="101" cy="112" rx="7" ry="9" fill={PUPIL} />
  if (expression === 'sad') return <path d="M90 118c6-8 16-8 22 0-7-4-15-4-22 0z" fill={PUPIL} />
  if (expression === 'thinking') return <rect x="91" y="111" width="20" height="4" rx="2" fill={PUPIL} />
  if (expression === 'sleep') return <ellipse cx="101" cy="112" rx="4" ry="5" fill={PUPIL} />
  if (expression === 'excited' || expression === 'celebrate') {
    return <path d="M88 109c8 4 18 4 26 0-1 13-25 13-26 0z" fill={PUPIL} />
  }
  return <path d="M88 109c7 8 19 8 26 0-2 13-24 13-26 0z" fill={PUPIL} />
}

function Decor({ expression, accent }: { expression: WawaExpression; accent: string }) {
  if (expression === 'celebrate') {
    return (
      <>
        <circle cx="25" cy="43" r="5" fill={accent} />
        <circle cx="177" cy="50" r="4" fill="#f7b928" />
        <rect x="29" y="27" width="7" height="7" rx="2" fill="#e8564f" />
        <rect x="165" y="30" width="7" height="7" rx="2" fill={accent} />
      </>
    )
  }
  if (expression === 'sleep') {
    return (
      <g fill={PUPIL} fontFamily="sans-serif" fontWeight="800">
        <text x="163" y="62" fontSize="17">z</text>
        <text x="177" y="45" fontSize="12">z</text>
      </g>
    )
  }
  if (expression === 'thinking') {
    return (
      <>
        <circle cx="166" cy="55" r="5" fill="#fff" />
        <circle cx="180" cy="40" r="8" fill="#fff" />
      </>
    )
  }
  return null
}
