import Link from 'next/link'
import { FightEvent } from '@/lib/mock'
import { FighterFlag } from './Flag'
import { fighterByName } from '@/lib/fighters'
import { MatchPoster } from './Posters'

export function EventCard({ event }: { event: FightEvent }) {
  const href = event.status === 'vod' ? `/vod/${event.id}` : `/events/${event.id}`
  return (
    <Link href={href} className="card">
      <div className="card-art">
        <MatchPoster red={fighterByName(event.red)!} blue={fighterByName(event.blue)!} avatar={76} />
        {event.status === 'live' && <span className="tag tag-live">LIVE</span>}
        {event.status === 'upcoming' && <span className="tag">เร็ว ๆ นี้</span>}
        {event.status === 'vod' && <span className="tag">ย้อนหลัง</span>}
      </div>
      <div className="card-body">
        <h3><FighterFlag name={event.red} size={21} /> {event.red} <span className="vs">vs</span> {event.blue} <FighterFlag name={event.blue} size={21} /></h3>
        <p className="muted small">{event.date}, {event.division}</p>
      </div>
    </Link>
  )
}
