'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { formatClock, LIVE_ROUND, liveScore, roundSeconds } from '@/lib/liveClock'
import { events } from '@/lib/mock'
import { FighterFlag } from './Flag'
import { LanguageSwitch } from './LanguageSwitch'
import { useNow } from './useNow'

function NavLinks() {
  const path = usePathname()
  const onVod = path.startsWith('/vod')
  const onFighters = path.startsWith('/fighters')
  const links = [
    { href: '/', label: 'ถ่ายทอดสด', active: !onVod && !onFighters && (path === '/' || path.startsWith('/live') || path.startsWith('/events')) },
    { href: '/vod', label: 'ดูย้อนหลัง', active: onVod },
    { href: '/fighters', label: 'นักมวย', active: onFighters },
  ]
  return (
    <nav className="topnav" aria-label="เมนูหลัก">
      {links.map((l) => <Link key={l.href} href={l.href} aria-current={l.active ? 'page' : undefined}>{l.label}</Link>)}
    </nav>
  )
}

function LiveBar() {
  const path = usePathname()
  const now = useNow()
  const score = liveScore()

  return (
    <div className="live-bar" role="region" aria-label="ข้อมูลการถ่ายทอดสดตอนนี้">
      <span className="tag tag-live">● LIVE</span>
      {events.filter((e) => e.status === 'live').map((e) => {
        const href = `/live/${e.id}`
        return (
          <Link key={e.id} href={href} className="live-bar-item" aria-current={path === href ? 'page' : undefined}>
            <span className="live-bar-fight">
              <FighterFlag name={e.red} size={21} /> {e.red}
              <b>{score.red} : {score.blue}</b>
              {e.blue} <FighterFlag name={e.blue} size={21} />
            </span>
            <span className="live-bar-meta">ยก {LIVE_ROUND}/{e.rounds} <b>{now === null ? '--:--' : formatClock(roundSeconds(e.id, now))}</b></span>
            <span className="live-bar-meta">{e.viewers} รับชม</span>
          </Link>
        )
      })}
    </div>
  )
}

export function Navbar() {
  return (
    <header className="nav-center">
      <div className="topbar">
        <NavLinks />
        <Link href="/" className="logo">LIVE<span>STREAM.</span></Link>
        <div className="topbar-end">
          <Link href="/bof" className="muted small nav-bof">Back Office</Link>
          <LanguageSwitch />
          <Link href="/profile" className="avatar" aria-label="โปรไฟล์">F</Link>
        </div>
      </div>
      <div className="nav-ropes" aria-hidden="true"><i /><i /><i /></div>
      <LiveBar />
    </header>
  )
}
