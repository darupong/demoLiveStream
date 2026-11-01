import { Fighter, fighterByName, portraitOf } from '@/lib/fighters'

const HAIR_PATHS = [
  'M26 42 C24 16 76 16 74 42 C70 30 30 30 26 42Z',
  'M25 44 C20 12 80 12 75 44 L70 34 L60 38 L50 32 L40 38 L30 34Z',
  'M27 40 C28 18 72 18 73 40 C62 26 40 26 27 40Z',
  'M36 28 C44 12 58 12 64 28 C58 24 42 24 36 28Z',
]

const BROWS = ['M36 47 L46 45 M54 45 L64 47', 'M36 45 L46 47 M54 47 L64 45', 'M36 46 H46 M54 46 H64']

// A drawn portrait: fighters have no photos yet, so this stands in with their camp colour on the mongkol.
export function FighterAvatar({ fighter, size = 46 }: { fighter: Fighter; size?: number }) {
  const p = portraitOf(fighter)
  return (
    <svg className="avatar-art" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`รูป ${fighter.name}`}>
      <rect width="100" height="100" fill={p.camp} />
      <rect width="100" height="100" fill="#06080c" opacity=".45" />
      <path d="M8 100 C10 78 30 72 50 72 C70 72 90 78 92 100Z" fill={p.skin} />
      <path d="M66 74 C80 78 90 84 92 100 L66 100Z" fill={p.shade} />
      <path d="M41 58 H59 V76 C54 80 46 80 41 76Z" fill={p.shade} />
      <ellipse cx="50" cy="46" rx="23" ry="26" fill={p.skin} />
      <ellipse cx="27" cy="48" rx="3.5" ry="6" fill={p.shade} />
      <ellipse cx="73" cy="48" rx="3.5" ry="6" fill={p.shade} />
      <path d={HAIR_PATHS[p.hairStyle]} fill={p.hair} />
      <path d="M26.500 37 C36 31 64 31 73.500 37 L74 42 C64 36 36 36 26 42Z" fill="#f4f1e6" />
      <path d="M27 40 C36 34 64 34 73 40" fill="none" stroke={p.camp} strokeWidth="2.400" />
      <path d={BROWS[p.brow]} fill="none" stroke={p.hair} strokeWidth="2.400" strokeLinecap="round" />
      <circle cx="41" cy="51" r="2" fill="#17120f" />
      <circle cx="59" cy="51" r="2" fill="#17120f" />
      <path d="M50 53 L47 60 H52" fill="none" stroke={p.shade} strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 65 C47 67 53 67 57 65" fill="none" stroke={p.shade} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function AvatarByName({ name, size }: { name: string; size?: number }) {
  const fighter = fighterByName(name)
  return fighter ? <FighterAvatar fighter={fighter} size={size} /> : null
}
