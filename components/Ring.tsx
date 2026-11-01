import { useId } from 'react'

const SKIN = '#b98a5f'
const SKIN_DARK = '#a0744c'
const RED = '#d9333f'
const BLUE = '#3f6fe0'

function Fighter({ x, color, flip }: { x: number; color: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 520) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-34 -140 L-96 -6 L-52 -6 L2 -104 L44 -6 L96 -6 L36 -140Z" fill={SKIN_DARK} />
      <path d="M-98 -8 L-48 -8 L-58 10 L-124 10Z M46 -8 L100 -8 L126 10 L54 10Z" fill="#14161b" />
      <path d="M-58 -280 L60 -290 L48 -160 L-44 -160Z" fill={SKIN} />
      <path d="M-48 -168 L50 -168 L66 -92 L14 -84 L0 -112 L-16 -84 L-70 -92Z" fill={color} />
      <rect x={-48} y={-176} width={98} height={12} fill="#e8e8e8" />
      <path d="M-14 -246 L24 -252 L34 -216 L10 -194 L-20 -214Z" fill={color} />
      <path d="M46 -282 L120 -262 L122 -238 L44 -250Z" fill={SKIN_DARK} />
      <path d="M118 -282 L160 -286 L172 -246 L146 -226 L116 -238Z" fill={color} />
      <path d="M-50 -272 L-84 -210 L-12 -186 L-4 -206 L-52 -226Z" fill={SKIN_DARK} />
      <rect x={-6} y={-306} width={24} height={26} fill={SKIN_DARK} />
      <circle cx={8} cy={-332} r={38} fill={SKIN} />
      <path d="M-30 -336 A38 38 0 0 1 46 -336 L30 -350 L-12 -350Z" fill="#191512" />
    </g>
  )
}

// A stand-in for the video feed, drawn to match the supplied design.
export function Ring({ skeleton = false }: { skeleton?: boolean }) {
  const id = useId()
  return (
    <svg viewBox="0 0 1066 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="30%" r="75%">
          <stop offset="0" stopColor="#4a4f5c" />
          <stop offset="1" stopColor="#14171e" />
        </radialGradient>
      </defs>
      <rect width="1066" height="600" fill={`url(#${id}-bg)`} />
      <path d="M0 520 L300 300 H766 L1066 520 V600 H0Z" fill="#6d727d" />
      <path d="M533 300 L300 520 H766Z" fill="#7b808b" />
      <path d="M0 260 Q533 300 1066 290" stroke="#d83a44" strokeWidth="8" fill="none" />
      <path d="M0 320 Q533 340 1066 335" stroke="#d6d8dc" strokeWidth="6" fill="none" />
      <path d="M0 500 Q533 510 1066 505" stroke="#d6d8dc" strokeWidth="6" fill="none" />
      <path d="M0 555 Q533 540 1066 548" stroke="#3a62c8" strokeWidth="8" fill="none" />
      <Fighter x={355} color={RED} />
      <Fighter x={711} color={BLUE} flip />
      {skeleton &&
        [355, 711].map((x, i) => (
          <g key={x} transform={`translate(${x} 520) scale(${i ? -1 : 1} 1)`} stroke="var(--lime)" strokeWidth="4" fill="none">
            <path d="M8 -332 V-270 M-60 -272 H64 L140 -256 M-60 -272 L-66 -200 L-8 -196 M0 -270 L0 -150 L-52 -74 L-74 0 M0 -150 L42 -72 L72 0" />
            {[[8, -332], [-60, -272], [64, -272], [140, -256], [0, -150], [-52, -74], [-74, 0], [42, -72], [72, 0]].map(([cx, cy]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="6" fill="var(--lime)" stroke="none" />
            ))}
          </g>
        ))}
    </svg>
  )
}
