/**
 * WAWA — the mascot of WAWAさん.
 *
 * Species: Tarsius (tarsier) — a tiny primate endemic to Sulawesi, Indonesia.
 * Chosen because: (1) enormous eyes = the platform's core act, *observing* a
 * character before memorising it; (2) unmistakably Indonesian, so the mascot
 * carries the "diajarkan dari Bahasa Indonesia" promise; (3) visually distinct
 * from every owl-shaped language mascot out there.
 *
 * Drawing rules — the whole art system depends on these:
 *   · flat fills only, never a gradient
 *   · one ink colour for every outline (#17313c)
 *   · shapes stay closed and rounded; nothing thin enough to break at 24px
 */
import { useId } from 'react'

export type WawaExpression =
  | 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrate'
  | 'sleep' | 'wave' | 'teach' | 'wow' | 'love'

export type WawaProps = {
  expression?: WawaExpression
  /** rendered pixel size (square) */
  size?: number
  /** accent colour of the scarf — usually the active language colour */
  accent?: string
  className?: string
  /** hide the tail, e.g. inside tight avatar frames */
  cropped?: boolean
  title?: string
}

const INK = '#17313c'
const FUR = '#f6d9a8'
const FUR_DARK = '#e9bf83'
const BELLY = '#fff6e2'
const EAR = '#ffb3a3'
const EYE = '#ffcd3c'
const EYE_RING = '#f5b81d'
const NOSE = '#e08a76'

export function Wawa({
  expression = 'happy',
  size = 160,
  accent = '#00a191',
  className = '',
  cropped = false,
  title,
}: WawaProps) {
  const uid = useId().replace(/:/g, '')
  const armsUp = expression === 'celebrate' || expression === 'excited'
  const oneArmUp = expression === 'wave' || expression === 'teach'

  return (
    <svg
      viewBox="0 0 220 210"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* Clip keeps the belly patch inside the body silhouette */}
        <clipPath id={'body-' + uid}>
          <path d="M64 128 C56 178 76 200 110 200 C144 200 164 178 156 128 Z" />
        </clipPath>
      </defs>

      {/* ---------- TAIL ---------- */}
      {!cropped ? (
        <g>
          <path
            d="M148 172 C186 178 202 148 196 118"
            fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round"
          />
          <path
            d="M148 172 C186 178 202 148 196 118"
            fill="none" stroke={FUR_DARK} strokeWidth="7" strokeLinecap="round"
          />
          <circle cx="196" cy="114" r="15" fill={FUR} stroke={INK} strokeWidth="5.5" />
        </g>
      ) : null}

      {/* ---------- EARS (behind head) ---------- */}
      <g>
        <ellipse cx="48" cy="56" rx="27" ry="30" fill={FUR} stroke={INK} strokeWidth="5.5" transform="rotate(-16 48 56)" />
        <ellipse cx="48" cy="58" rx="14" ry="17" fill={EAR} transform="rotate(-16 48 58)" />
        <ellipse cx="172" cy="56" rx="27" ry="30" fill={FUR} stroke={INK} strokeWidth="5.5" transform="rotate(16 172 56)" />
        <ellipse cx="172" cy="58" rx="14" ry="17" fill={EAR} transform="rotate(16 172 58)" />
      </g>

      {/* ---------- BODY ---------- */}
      <g>
        <path
          d="M64 128 C56 178 76 200 110 200 C144 200 164 178 156 128 Z"
          fill={FUR} stroke={INK} strokeWidth="5.5" strokeLinejoin="round"
        />
        <g clipPath={'url(#body-' + uid + ')'}>
          <ellipse cx="110" cy="182" rx="34" ry="34" fill={BELLY} />
        </g>
        <ellipse cx="88" cy="197" rx="17" ry="9" fill={FUR_DARK} stroke={INK} strokeWidth="5" />
        <ellipse cx="132" cy="197" rx="17" ry="9" fill={FUR_DARK} stroke={INK} strokeWidth="5" />
      </g>

      {/* ---------- ARMS ---------- */}
      {armsUp ? (
        <g>
          <g transform="rotate(-38 68 148)">
            <rect x="46" y="136" width="30" height="21" rx="10.5" fill={FUR} stroke={INK} strokeWidth="5" />
          </g>
          <g transform="rotate(38 152 148)">
            <rect x="144" y="136" width="30" height="21" rx="10.5" fill={FUR} stroke={INK} strokeWidth="5" />
          </g>
        </g>
      ) : oneArmUp ? (
        <g>
          <ellipse cx="62" cy="158" rx="14" ry="16" fill={FUR} stroke={INK} strokeWidth="5" />
          <g transform="rotate(34 158 150)">
            <rect x="148" y="138" width="30" height="21" rx="10.5" fill={FUR} stroke={INK} strokeWidth="5" />
          </g>
        </g>
      ) : (
        <g>
          <ellipse cx="62" cy="158" rx="14" ry="16" fill={FUR} stroke={INK} strokeWidth="5" />
          <ellipse cx="158" cy="158" rx="14" ry="16" fill={FUR} stroke={INK} strokeWidth="5" />
        </g>
      )}

      {/* ---------- SCARF (carries the active language colour) ----------
          Sits below the head silhouette (head bottom ≈ y151) so the accent
          colour actually reads instead of hiding behind the muzzle. */}
      <path
        d="M76 146 C90 160 130 160 144 146 L149 160 C130 176 90 176 71 160 Z"
        fill={accent} stroke={INK} strokeWidth="5" strokeLinejoin="round"
      />

      {/* ---------- HEAD ---------- */}
      <g>
        <path d="M92 34 L110 12 L128 34 Z" fill={FUR} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
        <ellipse cx="110" cy="88" rx="68" ry="63" fill={FUR} stroke={INK} strokeWidth="5.5" />
        <ellipse cx="110" cy="118" rx="30" ry="22" fill={BELLY} />
        <circle cx="54" cy="112" r="10" fill={EAR} opacity="0.75" />
        <circle cx="166" cy="112" r="10" fill={EAR} opacity="0.75" />
        <Eyes expression={expression} />
        <path d="M110 108 L117 117 Q110 123 103 117 Z" fill={NOSE} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <Mouth expression={expression} />
      </g>

      <Decor expression={expression} accent={accent} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */

type EyeCfg = { r: number; pr: number; dx: number; dy: number; squintL?: boolean }

const EYE_CFG: Record<WawaExpression, EyeCfg> = {
  happy: { r: 30, pr: 16, dx: 0, dy: 0 },
  excited: { r: 32, pr: 19, dx: 0, dy: -2 },
  celebrate: { r: 32, pr: 19, dx: 0, dy: -2 },
  wow: { r: 33, pr: 21, dx: 0, dy: 0 },
  wave: { r: 30, pr: 16, dx: 2, dy: 0 },
  teach: { r: 30, pr: 16, dx: -3, dy: 1 },
  thinking: { r: 30, pr: 15, dx: 5, dy: -4, squintL: true },
  sad: { r: 29, pr: 14, dx: 0, dy: 4 },
  love: { r: 30, pr: 16, dx: 0, dy: 0 },
  sleep: { r: 30, pr: 16, dx: 0, dy: 0 },
}

function Eyes({ expression }: { expression: WawaExpression }) {
  if (expression === 'sleep') {
    return (
      <g fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round">
        <path d="M56 86 Q78 104 100 86" />
        <path d="M120 86 Q142 104 164 86" />
      </g>
    )
  }

  if (expression === 'love') {
    return (
      <g>
        {[78, 142].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="86" r="30" fill={EYE} stroke={INK} strokeWidth="5.5" />
            <path
              d={`M${cx} 98 C${cx - 18} 82 ${cx - 10} 68 ${cx} 78 C${cx + 10} 68 ${cx + 18} 82 ${cx} 98 Z`}
              fill="#e04227"
            />
          </g>
        ))}
      </g>
    )
  }

  const c = EYE_CFG[expression]

  return (
    <g>
      {[78, 142].map((cx, i) => {
        const squint = c.squintL && i === 0
        return (
          <g key={cx}>
            <circle cx={cx} cy="86" r={c.r} fill={EYE} stroke={INK} strokeWidth="5.5" />
            <circle cx={cx} cy="86" r={c.r - 6} fill={EYE_RING} opacity="0.45" />
            {squint ? (
              <path d={`M${cx - 22} 86 Q${cx} 70 ${cx + 22} 86`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
            ) : (
              <g>
                <circle cx={cx + c.dx} cy={86 + c.dy} r={c.pr} fill={INK} />
                <circle cx={cx + c.dx - 6} cy={86 + c.dy - 7} r={c.pr / 2.6} fill="#fff" />
                <circle cx={cx + c.dx + 7} cy={86 + c.dy + 6} r={c.pr / 5} fill="#fff" opacity="0.85" />
              </g>
            )}
          </g>
        )
      })}
      {expression === 'sad' ? (
        <g fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round">
          <path d="M54 52 L92 62" />
          <path d="M166 52 L128 62" />
        </g>
      ) : null}
    </g>
  )
}

function Mouth({ expression }: { expression: WawaExpression }) {
  switch (expression) {
    case 'excited':
    case 'celebrate':
      return <ellipse cx="110" cy="132" rx="15" ry="12" fill="#b6301a" stroke={INK} strokeWidth="4.5" />
    case 'wow':
      return <ellipse cx="110" cy="133" rx="10" ry="13" fill="#b6301a" stroke={INK} strokeWidth="4.5" />
    case 'sad':
      return <path d="M96 136 Q110 126 124 136" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    case 'thinking':
      return <path d="M98 132 L122 129" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    case 'sleep':
      return <ellipse cx="110" cy="132" rx="8" ry="9" fill="#b6301a" stroke={INK} strokeWidth="4" />
    default:
      return (
        <g fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
          <path d="M110 124 Q101 135 92 128" />
          <path d="M110 124 Q119 135 128 128" />
        </g>
      )
  }
}

const SPARKS: Array<[number, number, number]> = [
  [26, 30, 9], [196, 44, 7], [40, 148, 6], [186, 168, 8],
]

/** Floating extras: sparkles, zzz, a thought bubble. */
function Decor({ expression, accent }: { expression: WawaExpression; accent: string }) {
  if (expression === 'celebrate') {
    return (
      <g>
        {SPARKS.map(([x, y, r], i) => (
          <path
            key={i}
            d={`M${x} ${y - r} L${x + r / 2.6} ${y - r / 2.6} L${x + r} ${y} L${x + r / 2.6} ${y + r / 2.6} L${x} ${y + r} L${x - r / 2.6} ${y + r / 2.6} L${x - r} ${y} L${x - r / 2.6} ${y - r / 2.6} Z`}
            fill={i % 2 ? '#ffcd3c' : accent}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ))}
      </g>
    )
  }
  if (expression === 'sleep') {
    return (
      <g fill={INK} fontWeight="800">
        <text x="176" y="40" fontSize="20">z</text>
        <text x="192" y="24" fontSize="15">z</text>
        <text x="204" y="12" fontSize="11">z</text>
      </g>
    )
  }
  if (expression === 'thinking') {
    return (
      <g>
        <circle cx="184" cy="46" r="7" fill="#fff" stroke={INK} strokeWidth="3.5" />
        <circle cx="198" cy="30" r="10" fill="#fff" stroke={INK} strokeWidth="3.5" />
      </g>
    )
  }
  return null
}
