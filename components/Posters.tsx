import { CSSProperties } from 'react'
import { Camp, Fighter } from '@/lib/fighters'
import { KIND_LABEL, Video } from '@/lib/library'
import { FighterAvatar } from './FighterAvatar'
import { Flag } from './Flag'

// Drawn covers stand in for video thumbnails, so each clip looks different from the next.
export function MatchPoster({ red, blue, avatar = 84 }: { red: Fighter; blue: Fighter; avatar?: number }) {
  return (
    <div className="poster poster-match">
      <span className="poster-side">
        <FighterAvatar fighter={red} size={avatar} />
        <Flag code={red.countryCode} size={Math.round(avatar * 0.36)} />
      </span>
      <b className="poster-vs">VS</b>
      <span className="poster-side">
        <FighterAvatar fighter={blue} size={avatar} />
        <Flag code={blue.countryCode} size={Math.round(avatar * 0.36)} />
      </span>
    </div>
  )
}

export function PersonPoster({ fighter, color, avatar = 112 }: { fighter: Fighter; color: string; avatar?: number }) {
  return (
    <div className="poster poster-person" style={{ '--tone': color } as CSSProperties}>
      <b className="poster-name">{fighter.name}</b>
      <FighterAvatar fighter={fighter} size={avatar} />
    </div>
  )
}

export function CampPoster({ camp }: { camp: Camp }) {
  return (
    <div className="poster poster-camp" style={{ '--tone': camp.color } as CSSProperties}>
      <small>เบื้องหลัง</small>
      <b>{camp.name.replace('ค่าย', '')}</b>
      <small>{camp.province}</small>
    </div>
  )
}

export function TechniquePoster({ video, color }: { video: Video; color: string }) {
  return (
    <div className="poster poster-technique" style={{ '--tone': color } as CSSProperties}>
      <span aria-hidden="true">{video.icon}</span>
      <b>{KIND_LABEL[video.kind]}</b>
    </div>
  )
}
