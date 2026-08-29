/**
 * Ambient themed scenery, one set per language.
 *
 * Deliberately a different art language from the mascot: these are **outline-free
 * vector shapes** — flat fills only, no strokes anywhere — so they read as soft
 * background texture and never compete with the inked UI in the foreground.
 *
 * Rendered into a fixed, pointer-events-none layer behind everything.
 */
import { useMemo } from 'react'
import type { LangId } from '@/data/types'

/* =============================== JEPANG =============================== */
/* Sakura: branch in the top-right, drifting petals, Fuji silhouette. */

function SakuraBlossom({ x, y, s, c }: { x: number; y: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-7" rx="4.6" ry="6.6" fill={c} transform={`rotate(${a})`} />
      ))}
      <circle r="2.4" fill="#ffe9a8" />
    </g>
  )
}

function SakuraBranch() {
  return (
    <g>
      <path
        d="M300 0c-14 26-40 44-72 54-30 9-52 24-66 46 18-14 40-22 66-24 34-3 60-20 72-46z"
        fill="#8a6b52"
      />
      <path d="M232 56c-6 20-20 34-40 42 22-2 40-14 50-32z" fill="#8a6b52" />
      <path d="M186 88c-14 8-24 20-30 36 14-10 26-22 34-30z" fill="#8a6b52" />
      <SakuraBlossom x={268} y={22} s={1.5} c="#ffc2d4" />
      <SakuraBlossom x={236} y={52} s={1.15} c="#ffd7e3" />
      <SakuraBlossom x={210} y={44} s={1.35} c="#ffb3c9" />
      <SakuraBlossom x={196} y={82} s={1} c="#ffd7e3" />
      <SakuraBlossom x={166} y={104} s={1.25} c="#ffc2d4" />
      <SakuraBlossom x={252} y={88} s={0.9} c="#ffb3c9" />
      <SakuraBlossom x={140} y={130} s={0.8} c="#ffd7e3" />
    </g>
  )
}

function Fuji() {
  return (
    <g>
      <path d="M0 200 L120 62 L240 200 Z" fill="#b9cddb" />
      <path d="M120 62 L156 103 l-14 -6 -16 12 -14 -10 -13 8 -11 -6z" fill="#ffffff" />
    </g>
  )
}

/** Petals that drift down the whole viewport. */
function Petals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        delay: -(i * 1.9) % 26,
        dur: 20 + ((i * 7) % 14),
        size: 9 + ((i * 5) % 8),
        drift: ((i % 5) - 2) * 60,
        rot: 200 + ((i * 53) % 320),
        tone: ['#ffc2d4', '#ffd7e3', '#ffb3c9'][i % 3],
      })),
    [count],
  )
  return (
    <>
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `drift-fall ${p.dur}s linear ${p.delay}s infinite`,
            ['--drift-x' as string]: `${p.drift}px`,
            ['--drift-r' as string]: `${p.rot}deg`,
          }}
        >
          <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden>
            <path d="M10 1c4 4 6 8 5 12-1 4-4 6-5 6s-4-2-5-6c-1-4 1-8 5-12z" fill={p.tone} />
          </svg>
        </span>
      ))}
    </>
  )
}

/* =============================== MANDARIN =============================== */
/* Bamboo grove + a panda sitting at the base + paper lanterns. */

function BambooStalk({ x, h, w, tone, leafTone }: { x: number; h: number; w: number; tone: string; leafTone: string }) {
  const segs = Math.floor(h / 46)
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={0} width={w} height={h} rx={w / 2} fill={tone} />
      {Array.from({ length: segs }, (_, i) => (
        <rect key={i} x={-1.5} y={(i + 1) * 46} width={w + 3} height={5} rx={2.5} fill={leafTone} />
      ))}
      {[0.22, 0.45, 0.7].map((f, i) => (
        <g key={i} transform={`translate(${i % 2 ? w : 0} ${h * f})`}>
          <path
            d={i % 2 ? 'M0 0c22 -6 38 -2 50 10-16 6-34 4-50-10z' : 'M0 0c-22 -6 -38 -2 -50 10 16 6 34 4 50-10z'}
            fill={leafTone}
          />
          <path
            d={i % 2 ? 'M0 6c18 4 30 12 38 24-14-2-28-10-38-24z' : 'M0 6c-18 4 -30 12 -38 24 14-2 28-10 38-24z'}
            fill={tone}
          />
        </g>
      ))}
    </g>
  )
}

function Panda() {
  return (
    <g>
      {/* ears */}
      <circle cx="28" cy="24" r="15" fill="#2b2b33" />
      <circle cx="92" cy="24" r="15" fill="#2b2b33" />
      {/* body */}
      <ellipse cx="60" cy="108" rx="44" ry="38" fill="#f7f4ee" />
      <path d="M22 92c-12 6-18 20-14 34 8-2 16-10 20-22z" fill="#2b2b33" />
      <path d="M98 92c12 6 18 20 14 34-8-2-16-10-20-22z" fill="#2b2b33" />
      <ellipse cx="36" cy="140" rx="16" ry="10" fill="#2b2b33" />
      <ellipse cx="84" cy="140" rx="16" ry="10" fill="#2b2b33" />
      {/* head */}
      <ellipse cx="60" cy="52" rx="40" ry="36" fill="#f7f4ee" />
      <ellipse cx="43" cy="48" rx="12" ry="14" fill="#2b2b33" transform="rotate(-14 43 48)" />
      <ellipse cx="77" cy="48" rx="12" ry="14" fill="#2b2b33" transform="rotate(14 77 48)" />
      <circle cx="44" cy="49" r="4.5" fill="#f7f4ee" />
      <circle cx="76" cy="49" r="4.5" fill="#f7f4ee" />
      <ellipse cx="60" cy="66" rx="6" ry="4.4" fill="#2b2b33" />
      <path d="M60 70c-4 6-10 6-13 2 4 5 10 6 13 1 3 5 9 4 13-1-3 4-9 4-13-2z" fill="#2b2b33" />
    </g>
  )
}

function Lantern({ x, y, s, tone }: { x: number; y: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.5" y="-40" width="3" height="18" fill="#c9a227" />
      <rect x="-11" y="-24" width="22" height="6" rx="2" fill="#c9a227" />
      <ellipse cx="0" cy="4" rx="20" ry="24" fill={tone} />
      <rect x="-11" y="26" width="22" height="6" rx="2" fill="#c9a227" />
      <rect x="-2" y="32" width="4" height="16" rx="2" fill="#ffd94a" />
    </g>
  )
}

/* =============================== KOREA =============================== */
/* Ginseng root, mugunghwa (hibiscus, the national flower), hanok eaves. */

function Ginseng() {
  return (
    <g>
      <path d="M60 34c8 0 13 6 13 15 0 12-5 18-5 26 0 6 4 9 4 16 0 10-5 17-12 17s-12-7-12-17c0-7 4-10 4-16 0-8-5-14-5-26 0-9 5-15 13-15z" fill="#f0e2c4" />
      <path d="M56 106c-4 12-12 20-22 26 8 2 18-2 24-12z" fill="#e8d5ae" />
      <path d="M64 106c4 12 12 20 22 26-8 2-18-2-24-12z" fill="#e8d5ae" />
      <path d="M60 128c-2 14-8 24-16 32 10 0 18-10 20-24z" fill="#e8d5ae" />
      <path d="M60 34c-2-10 2-18 10-24-2 10-4 18-4 24z" fill="#5aa04a" />
      <path d="M60 34c2-10-2-18-10-24 2 10 4 18 4 24z" fill="#5aa04a" />
      <path d="M60 30c10-8 22-10 32-6-10 6-20 10-30 10z" fill="#6bbd58" />
      <path d="M60 30c-10-8-22-10-32-6 10 6 20 10 30 10z" fill="#6bbd58" />
      <circle cx="52" cy="4" r="5" fill="#e0453c" />
      <circle cx="64" cy="2" r="5" fill="#e0453c" />
      <circle cx="58" cy="12" r="5" fill="#e0453c" />
    </g>
  )
}

function Mugunghwa({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 -6c9 -3 17 3 17 13 0 8-7 14-17 14z"
          fill="#f2c8e0"
          transform={`rotate(${a})`}
        />
      ))}
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={`i${a}`} d="M0 -3c5 -1 9 2 9 8" fill="#d4568f" transform={`rotate(${a})`} />
      ))}
      <circle r="5" fill="#d4568f" />
      <circle r="2" fill="#ffe9a8" />
    </g>
  )
}

function HanokEave() {
  return (
    <g>
      <path d="M0 40C60 4 180 -8 300 6c-40 20-96 34-160 40C90 50 40 46 0 40z" fill="#3f5d73" />
      <path d="M14 44c56 8 118 8 176 0-52 20-124 22-176 0z" fill="#2c4356" />
      <rect x="60" y="52" width="14" height="60" fill="#8a5a3c" />
      <rect x="220" y="46" width="14" height="60" fill="#8a5a3c" />
    </g>
  )
}

/* =============================== INGGRIS =============================== */
/* Soft clouds, an open book, a quill — the "academic English" register. */

function Cloud({ x, y, s, tone }: { x: number; y: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="34" ry="22" fill={tone} />
      <ellipse cx="-30" cy="8" rx="24" ry="16" fill={tone} />
      <ellipse cx="30" cy="8" rx="26" ry="17" fill={tone} />
      <rect x="-54" y="4" width="108" height="18" rx="9" fill={tone} />
    </g>
  )
}

function OpenBook() {
  return (
    <g>
      <path d="M6 20c34-14 66-14 94 0v76c-28-14-60-14-94 0z" fill="#dfe9f5" />
      <path d="M194 20c-34-14-66-14-94 0v76c28-14 60-14 94 0z" fill="#eef4fb" />
      <rect x="96" y="16" width="8" height="82" rx="4" fill="#9fb4cc" />
      <g fill="#c3d3e6">
        <rect x="22" y="36" width="60" height="5" rx="2.5" />
        <rect x="22" y="50" width="52" height="5" rx="2.5" />
        <rect x="22" y="64" width="58" height="5" rx="2.5" />
        <rect x="118" y="36" width="60" height="5" rx="2.5" />
        <rect x="118" y="50" width="48" height="5" rx="2.5" />
        <rect x="118" y="64" width="56" height="5" rx="2.5" />
      </g>
    </g>
  )
}

/* ============================== COMPOSER ============================== */

function CountryPanorama({ lang }: { lang: LangId }) {
  if (lang === 'jp') {
    return (
      <svg className="absolute inset-x-0 bottom-0 h-[46vh] w-full" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <g className="dark:hidden">
          <circle cx="1030" cy="74" r="42" fill="#ffd76a" />
          <path d="M0 255L250 168l120 87 168-162 174 162 190-82 298 82v105H0z" fill="#c8dde5" />
          <path d="M538 93l54 51-21-8-18 14-18-13-20 9z" fill="#fff" />
          <g fill="#9eb8c2"><rect x="40" y="235" width="76" height="125" rx="4" /><rect x="124" y="270" width="58" height="90" rx="4" /><rect x="900" y="225" width="96" height="135" rx="4" /><rect x="1006" y="252" width="62" height="108" rx="4" /></g>
          <g fill="#df665d"><rect x="748" y="211" width="18" height="149" /><rect x="840" y="211" width="18" height="149" /><rect x="720" y="205" width="166" height="18" rx="5" /><rect x="739" y="235" width="128" height="13" rx="4" /><path d="M708 205l28-18 35 18zm148 0l28-18 35 18z" /></g>
        </g>
        <g className="hidden dark:block">
          <circle cx="1030" cy="74" r="34" fill="#f5e8bd" />
          <circle cx="1044" cy="62" r="34" fill="#12232d" />
          <circle cx="890" cy="54" r="3" fill="#fff4bf" /><circle cx="950" cy="110" r="2" fill="#fff4bf" /><circle cx="1120" cy="126" r="3" fill="#fff4bf" />
          <path d="M0 255L250 168l120 87 168-162 174 162 190-82 298 82v105H0z" fill="#294653" />
          <path d="M538 93l54 51-21-8-18 14-18-13-20 9z" fill="#dfe9ec" />
          <g fill="#213843"><rect x="40" y="235" width="76" height="125" rx="4" /><rect x="124" y="270" width="58" height="90" rx="4" /><rect x="900" y="225" width="96" height="135" rx="4" /><rect x="1006" y="252" width="62" height="108" rx="4" /></g>
          <g fill="#c4504a"><rect x="748" y="211" width="18" height="149" /><rect x="840" y="211" width="18" height="149" /><rect x="720" y="205" width="166" height="18" rx="5" /><rect x="739" y="235" width="128" height="13" rx="4" /></g>
        </g>
      </svg>
    )
  }

  if (lang === 'cn') {
    return (
      <svg className="absolute inset-x-0 bottom-0 h-[44vh] w-full" viewBox="0 0 1200 350" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <g className="dark:hidden">
          <circle cx="180" cy="72" r="40" fill="#ffd45f" />
          <path d="M0 245c160-118 276-81 390 0 134-128 254-115 390-8 120-80 254-84 420 8v105H0z" fill="#b8d3be" />
          <path d="M160 271c180-88 354-64 482-6 144 65 278 50 418-9l12 23c-154 67-308 82-460 14-126-57-278-73-438 2z" fill="#d7c49d" />
          <g fill="#c34f43"><rect x="510" y="168" width="76" height="112" /><path d="M485 168h126l-22-19h-82z" /><rect x="528" y="132" width="40" height="28" /><path d="M514 132h68l-14-15h-40z" /></g>
        </g>
        <g className="hidden dark:block">
          <circle cx="180" cy="72" r="32" fill="#f6e9c4" /><circle cx="193" cy="61" r="32" fill="#12232d" />
          <circle cx="280" cy="62" r="3" fill="#fff1b5" /><circle cx="360" cy="104" r="2" fill="#fff1b5" />
          <path d="M0 245c160-118 276-81 390 0 134-128 254-115 390-8 120-80 254-84 420 8v105H0z" fill="#29493e" />
          <path d="M160 271c180-88 354-64 482-6 144 65 278 50 418-9l12 23c-154 67-308 82-460 14-126-57-278-73-438 2z" fill="#6e6656" />
          <g fill="#a84038"><rect x="510" y="168" width="76" height="112" /><path d="M485 168h126l-22-19h-82z" /><rect x="528" y="132" width="40" height="28" /><path d="M514 132h68l-14-15h-40z" /></g>
        </g>
      </svg>
    )
  }

  if (lang === 'kr') {
    return (
      <svg className="absolute inset-x-0 bottom-0 h-[43vh] w-full" viewBox="0 0 1200 350" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <g className="dark:hidden">
          <circle cx="1030" cy="68" r="40" fill="#ffd766" />
          <path d="M0 238c170-115 322-88 478 12 169-111 330-103 492-11 71-47 147-55 230-32v143H0z" fill="#b9d6c0" />
          <g fill="#9fb5c2"><rect x="80" y="242" width="72" height="108" /><rect x="165" y="275" width="58" height="75" /><rect x="935" y="255" width="88" height="95" /><rect x="1034" y="225" width="62" height="125" /></g>
          <g fill="#7d8790"><rect x="590" y="123" width="13" height="227" /><path d="M596 55l14 68h-28z" /><ellipse cx="596" cy="142" rx="45" ry="14" /><ellipse cx="596" cy="177" rx="28" ry="8" /></g>
          <g fill="#cf5a54"><path d="M260 267h190l-31-28H292z" /><path d="M284 236h142l-27-22h-88z" /></g>
        </g>
        <g className="hidden dark:block">
          <circle cx="1030" cy="68" r="32" fill="#f4e8c5" /><circle cx="1043" cy="56" r="32" fill="#12232d" />
          <circle cx="900" cy="76" r="3" fill="#fff2bd" /><circle cx="1120" cy="110" r="2" fill="#fff2bd" />
          <path d="M0 238c170-115 322-88 478 12 169-111 330-103 492-11 71-47 147-55 230-32v143H0z" fill="#29473e" />
          <g fill="#203945"><rect x="80" y="242" width="72" height="108" /><rect x="165" y="275" width="58" height="75" /><rect x="935" y="255" width="88" height="95" /><rect x="1034" y="225" width="62" height="125" /></g>
          <g fill="#8895a0"><rect x="590" y="123" width="13" height="227" /><path d="M596 55l14 68h-28z" /><ellipse cx="596" cy="142" rx="45" ry="14" /><ellipse cx="596" cy="177" rx="28" ry="8" /></g>
          <g fill="#a74443"><path d="M260 267h190l-31-28H292z" /><path d="M284 236h142l-27-22h-88z" /></g>
        </g>
      </svg>
    )
  }

  return (
    <svg className="absolute inset-x-0 bottom-0 h-[44vh] w-full" viewBox="0 0 1200 350" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <g className="dark:hidden">
        <circle cx="170" cy="66" r="40" fill="#ffd66a" />
        <path d="M0 255c210-84 380-49 550 5 209 66 423 42 650-23v113H0z" fill="#b9d5bd" />
        <g fill="#a98a69"><rect x="520" y="142" width="70" height="208" /><path d="M555 70l42 72h-84z" /><circle cx="555" cy="176" r="22" fill="#f5ecd4" /><rect x="538" y="230" width="34" height="120" fill="#8d7158" /></g>
        <g fill="#879fab"><rect x="70" y="252" width="90" height="98" /><rect x="176" y="275" width="68" height="75" /><rect x="930" y="245" width="98" height="105" /><rect x="1042" y="266" width="72" height="84" /></g>
        <path d="M675 267h295v18H675zM700 228h18v122h-18zm225 0h18v122h-18zm-207 0h207l-32-28H750z" fill="#6788a0" />
      </g>
      <g className="hidden dark:block">
        <circle cx="170" cy="66" r="32" fill="#f4e8c5" /><circle cx="183" cy="55" r="32" fill="#12232d" />
        <circle cx="270" cy="78" r="3" fill="#fff2bd" /><circle cx="330" cy="42" r="2" fill="#fff2bd" />
        <path d="M0 255c210-84 380-49 550 5 209 66 423 42 650-23v113H0z" fill="#29483c" />
        <g fill="#6f5a4a"><rect x="520" y="142" width="70" height="208" /><path d="M555 70l42 72h-84z" /><circle cx="555" cy="176" r="22" fill="#d8d0b9" /><rect x="538" y="230" width="34" height="120" fill="#59483c" /></g>
        <g fill="#223b47"><rect x="70" y="252" width="90" height="98" /><rect x="176" y="275" width="68" height="75" /><rect x="930" y="245" width="98" height="105" /><rect x="1042" y="266" width="72" height="84" /></g>
        <path d="M675 267h295v18H675zM700 228h18v122h-18zm225 0h18v122h-18zm-207 0h207l-32-28H750z" fill="#49687d" />
      </g>
    </svg>
  )
}

const OPACITY = 'opacity-[0.68] dark:opacity-[0.52]'

function JapanScene() {
  return (
    <>
      <CountryPanorama lang="jp" />
      <svg className="absolute -top-6 right-0 w-[340px] max-w-[52vw]" viewBox="0 0 300 190" aria-hidden>
        <SakuraBranch />
      </svg>
      <svg className="absolute bottom-0 left-0 w-[300px] max-w-[46vw]" viewBox="0 0 240 200" aria-hidden>
        <Fuji />
      </svg>
      <Petals />
    </>
  )
}

function ChinaScene() {
  return (
    <>
      <CountryPanorama lang="cn" />
      <svg className="absolute bottom-0 left-0 h-[62vh] w-[220px]" viewBox="0 0 220 560" preserveAspectRatio="xMinYMax meet" aria-hidden>
        <BambooStalk x={18} h={560} w={17} tone="#8cc06a" leafTone="#5f9a45" />
        <BambooStalk x={72} h={470} w={13} tone="#a6cf87" leafTone="#71ad55" />
        <BambooStalk x={122} h={520} w={15} tone="#79b358" leafTone="#54903c" />
      </svg>
      <svg className="absolute bottom-2 right-6 w-[150px] max-w-[30vw] anim-bob-slow" viewBox="0 0 120 156" aria-hidden>
        <Panda />
      </svg>
      <svg className="absolute right-[16%] top-0 w-[120px]" viewBox="-30 -50 60 110" aria-hidden>
        <g className="anim-sway"><Lantern x={0} y={0} s={1} tone="#e0453c" /></g>
      </svg>
      <svg className="absolute right-[30%] top-0 hidden w-[86px] sm:block" viewBox="-26 -50 52 106" aria-hidden>
        <g className="anim-sway" style={{ animationDelay: '-2.4s' }}>
          <Lantern x={0} y={-10} s={0.78} tone="#f0803c" />
        </g>
      </svg>
    </>
  )
}

function KoreaScene() {
  return (
    <>
      <CountryPanorama lang="kr" />
      <svg className="absolute -top-2 left-0 w-[330px] max-w-[50vw]" viewBox="0 0 300 112" aria-hidden>
        <HanokEave />
      </svg>
      <svg className="absolute bottom-0 right-4 w-[170px] max-w-[32vw]" viewBox="0 0 120 168" aria-hidden>
        <Ginseng />
      </svg>
      <svg className="absolute bottom-[22%] left-[6%] w-[110px]" viewBox="-30 -30 60 60" aria-hidden>
        <g className="anim-bob-slow"><Mugunghwa x={0} y={0} s={1} /></g>
      </svg>
      <svg className="absolute top-[38%] right-[10%] hidden w-[80px] md:block" viewBox="-26 -26 52 52" aria-hidden>
        <g className="anim-bob-slow" style={{ animationDelay: '-3s' }}>
          <Mugunghwa x={0} y={0} s={0.8} />
        </g>
      </svg>
    </>
  )
}

function EnglishScene() {
  return (
    <>
      <CountryPanorama lang="en" />
      <svg className="absolute left-0 top-4 w-full" viewBox="0 0 900 120" aria-hidden>
        <Cloud x={140} y={40} s={1} tone="#dbe8f7" />
        <Cloud x={520} y={26} s={0.72} tone="#e7f0fb" />
        <Cloud x={790} y={58} s={0.9} tone="#dbe8f7" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-[280px] max-w-[44vw]" viewBox="0 0 200 110" aria-hidden>
        <OpenBook />
      </svg>
      <svg className="absolute bottom-6 left-2 hidden w-[150px] md:block" viewBox="0 0 200 110" aria-hidden>
        <g opacity="0.7"><OpenBook /></g>
      </svg>
    </>
  )
}

const SCENES: Record<LangId, () => React.ReactElement> = {
  jp: JapanScene,
  cn: ChinaScene,
  kr: KoreaScene,
  en: EnglishScene,
}

/**
 * @param lang which themed scene to draw
 * @param variant `page` sits behind app content; `panel` fills its own container
 */
export function Scenery({
  lang, variant = 'page', className = '',
}: { lang: LangId; variant?: 'page' | 'panel'; className?: string }) {
  const Scene = SCENES[lang]
  return (
    <div
      aria-hidden
      className={[
        variant === 'page' ? 'pointer-events-none fixed inset-0 z-0' : 'pointer-events-none absolute inset-0',
        'overflow-hidden',
        OPACITY,
        className,
      ].join(' ')}
    >
      <Scene />
    </div>
  )
}

export { Petals, Panda, Ginseng, Mugunghwa, SakuraBlossom, Cloud }
