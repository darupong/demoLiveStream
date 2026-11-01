import { ReactNode } from 'react'
import { COUNTRIES, CountryCode, fighterByName } from '@/lib/fighters'

// Drawn as SVG because emoji flags show as plain letters on Windows.
const star = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 ? 2.9 : 7.2
  const angle = -Math.PI / 2 + (i * Math.PI) / 5
  return `${(15 + radius * Math.cos(angle)).toFixed(2)},${(10.6 + radius * Math.sin(angle)).toFixed(2)}`
}).join(' ')

const ARTWORK: Record<CountryCode, ReactNode> = {
  TH: (
    <>
      <rect width="30" height="20" fill="#a51931" />
      <rect y="3.33" width="30" height="13.34" fill="#f4f5f8" />
      <rect y="6.67" width="30" height="6.66" fill="#2d2a4a" />
    </>
  ),
  GB: (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.600" />
      <path d="M15 0V20M0 10H30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0V20M0 10H30" stroke="#c8102e" strokeWidth="3.500" />
    </>
  ),
  JP: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#bc002d" />
    </>
  ),
  FR: (
    <>
      <rect width="10" height="20" fill="#002395" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ed2939" />
    </>
  ),
  NL: (
    <>
      <rect width="30" height="6.67" fill="#ae1c28" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#21468b" />
    </>
  ),
  MM: (
    <>
      <rect width="30" height="6.67" fill="#fecb00" />
      <rect y="6.67" width="30" height="6.67" fill="#34b233" />
      <rect y="13.33" width="30" height="6.67" fill="#ea2839" />
      <polygon points={star} fill="#fff" />
    </>
  ),
}

export function Flag({ code, size = 24 }: { code: CountryCode; size?: number }) {
  return (
    <svg className="flag" width={size} height={Math.round((size * 2) / 3)} viewBox="0 0 30 20" role="img" aria-label={`ธงชาติ${COUNTRIES[code]}`}>
      {ARTWORK[code]}
    </svg>
  )
}

export function FighterFlag({ name, size }: { name: string; size?: number }) {
  const fighter = fighterByName(name)
  return fighter ? <Flag code={fighter.countryCode} size={size} /> : null
}
