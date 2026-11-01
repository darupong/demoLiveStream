import Link from 'next/link'
import { FighterAvatar } from '@/components/FighterAvatar'
import { Flag } from '@/components/Flag'
import { fighters } from '@/lib/fighters'

export default function FightersPage() {
  return (
    <>
      <h1 className="title" style={{ marginBottom: 20 }}>นักมวย</h1>
      <div className="fighter-grid">
        {fighters.map((f) => (
          <Link key={f.id} className="fighter-tile" href={`/fighters/${f.id}`}>
            <FighterAvatar fighter={f} size={56} />
            <span>
              <b>{f.name}</b>
              <small className="muted">{f.country} · {f.division} · ชนะ {f.wins} แพ้ {f.losses}</small>
            </span>
            <Flag code={f.countryCode} size={36} />
          </Link>
        ))}
      </div>
    </>
  )
}
