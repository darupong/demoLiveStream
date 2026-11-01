'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { formatClock, LIVE_ROUND, liveScore, roundSeconds } from '@/lib/liveClock'
import { events, FightEvent } from '@/lib/mock'
import { setRailCollapsed, useRailCollapsed } from '@/lib/railStore'
import { AvatarByName } from './FighterAvatar'
import { FighterFlag } from './Flag'
import { useNow } from './useNow'

const LIVE = events.filter((e) => e.status === 'live')
const UPCOMING = events.filter((e) => e.status === 'upcoming')

const hrefOf = (e: FightEvent) => (e.status === 'live' ? `/live/${e.id}` : `/events/${e.id}`)

function CurrentLink({ href, className, title, children }: { href: string; className: string; title?: string; children: ReactNode }) {
  const path = usePathname()
  return <Link href={href} className={className} title={title} aria-current={path === href ? 'page' : undefined}>{children}</Link>
}

function ScoreCards() {
  const now = useNow()
  const score = liveScore()
  return (
    <>
      <div className="rail-head">
        <h2>กำลังถ่ายทอด</h2>
        <button className="chat-toggle" aria-label="ย่อแถบซ้าย" title="ย่อแถบซ้าย" onClick={() => setRailCollapsed(true)}>⇤ <small>ย่อ</small></button>
      </div>
      {LIVE.map((e) => (
        <CurrentLink key={e.id} href={hrefOf(e)} className="rail-score">
          {[[e.red, score.red], [e.blue, score.blue]].map(([name, points]) => (
            <span key={name} className="rail-score-row">
              <AvatarByName name={String(name)} size={26} />
              <span>{name}</span>
              <FighterFlag name={String(name)} size={18} />
              <b>{points}</b>
            </span>
          ))}
          <small>
            <i aria-hidden="true" /> ยก {LIVE_ROUND}/{e.rounds} {now === null ? '--:--' : formatClock(roundSeconds(e.id, now))}
            <span>{e.viewers}</span>
          </small>
        </CurrentLink>
      ))}
      <h2>รายการถัดไป</h2>
      {UPCOMING.map((e) => (
        <CurrentLink key={e.id} href={hrefOf(e)} className="rail-item">
          <span className="rail-pair"><AvatarByName name={e.red} size={26} /><AvatarByName name={e.blue} size={26} /></span>
          <span className="rail-copy"><b>{e.red} vs {e.blue}</b><small>{e.date}</small></span>
        </CurrentLink>
      ))}
    </>
  )
}

const ICONS: Record<string, string> = {
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  vod: 'M12 6a6 6 0 1 1-6 6M6 8v4h4M12 9v3l2 2',
  fighters: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c1-4 4-6 7-6s6 2 7 6',
}

function Icon({ name }: { name: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

function SlimRail() {
  return (
    <div className="rail-slim-list">
      <button className="chat-toggle rail-expand" aria-label="ขยายแถบซ้าย" title="ขยายแถบซ้าย" onClick={() => setRailCollapsed(false)}>⇥ <small>ขยาย</small></button>
      <CurrentLink href="/" className="rail-slim-link"><Icon name="home" /><small>หน้าแรก</small></CurrentLink>
      <CurrentLink href="/vod" className="rail-slim-link"><Icon name="vod" /><small>ย้อนหลัง</small></CurrentLink>
      <CurrentLink href="/fighters" className="rail-slim-link"><Icon name="fighters" /><small>นักมวย</small></CurrentLink>
      <hr />
      {LIVE.map((e) => (
        <CurrentLink key={e.id} href={hrefOf(e)} className="rail-slim-avatar is-live" title={`${e.red} vs ${e.blue} ${e.viewers} รับชม`}>
          <AvatarByName name={e.red} size={38} />
          <span className="tag tag-live">LIVE</span>
        </CurrentLink>
      ))}
      {UPCOMING.map((e) => (
        <CurrentLink key={e.id} href={hrefOf(e)} className="rail-slim-avatar" title={`${e.red} vs ${e.blue} ${e.date}`}>
          <AvatarByName name={e.red} size={38} />
        </CurrentLink>
      ))}
    </div>
  )
}

export function ChannelRail() {
  const collapsed = useRailCollapsed()
  return (
    <nav className={collapsed ? 'rail is-collapsed' : 'rail'} aria-label="รายการถ่ายทอด">
      <div className="rail-full"><ScoreCards /></div>
      <div className="rail-compact"><SlimRail /></div>
    </nav>
  )
}
