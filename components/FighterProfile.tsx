'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Flag } from './Flag'
import { eventsOfFighter, Fighter, fighterByName } from '@/lib/fighters'
import { FightEvent } from '@/lib/mock'
import { FighterAvatar } from './FighterAvatar'

// Only events viewers may reach get a link; an unapproved VOD stays plain text.
function fightHref(e: FightEvent) {
  if (e.status === 'live') return `/live/${e.id}`
  if (e.status === 'vod') return `/vod/${e.id}`
  if (e.status === 'upcoming') return `/events/${e.id}`
  return null
}

const fightLabel = { live: 'กำลังถ่ายทอด', upcoming: 'รอเริ่ม', ended: 'รอไฟล์ย้อนหลัง', vod: 'ดูย้อนหลังได้' }

export function FighterProfile({ fighter, heading: Heading = 'h1' }: { fighter: Fighter; heading?: 'h1' | 'h2' }) {
  return (
    <div className="fighter-card">
      <div className="fighter-head">
        <FighterAvatar fighter={fighter} size={84} />
        <div>
          <Heading>{fighter.name}</Heading>
          <p className="fighter-country"><Flag code={fighter.countryCode} size={30} /> <b>{fighter.country}</b></p>
          <p className="muted small">{fighter.camp} · {fighter.division}</p>
        </div>
      </div>
      <div className="fighter-record">
        <div><b className="lime">{fighter.wins}</b><span className="muted small">ชนะ</span></div>
        <div><b>{fighter.losses}</b><span className="muted small">แพ้</span></div>
        <div><b>{fighter.draws}</b><span className="muted small">เสมอ</span></div>
        <div><b>{fighter.knockouts}</b><span className="muted small">ชนะน็อก</span></div>
      </div>
      <dl className="facts">
        <div><dt>อายุ</dt><dd>{fighter.age} ปี</dd></div>
        <div><dt>ส่วนสูง</dt><dd>{fighter.heightCm} ซม.</dd></div>
        <div><dt>ช่วงแขน</dt><dd>{fighter.reachCm} ซม.</dd></div>
        <div><dt>การยืน</dt><dd>{fighter.stance}</dd></div>
        <div><dt>สไตล์</dt><dd>{fighter.style}</dd></div>
      </dl>
      <p className="muted small">{fighter.bio}</p>
      <section>
        <h3>รายการแข่งขัน</h3>
        <ul className="fighter-fights">
          {eventsOfFighter(fighter.name).map((e) => {
            const opponent = e.red === fighter.name ? e.blue : e.red
            const href = fightHref(e)
            return (
              <li key={e.id}>
                {href ? <Link className="lime" href={href}>พบ {opponent}</Link> : <span>พบ {opponent}</span>}
                <span className="muted small">{e.date}, {fightLabel[e.status]}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

// Opens over the Live page so the stream keeps playing behind it.
export function FighterDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const fighter = fighterByName(name)

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [])

  if (!fighter) return null
  return (
    <dialog
      ref={dialog}
      className="fighter-dialog"
      aria-label={`โปรไฟล์ ${fighter.name}`}
      onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) dialog.current?.close() }}
    >
      <button className="btn btn-sm fighter-dialog-close" onClick={() => dialog.current?.close()}>ปิด</button>
      <FighterProfile fighter={fighter} heading="h2" />
      <p style={{ marginTop: 16 }}><Link className="lime small" href={`/fighters/${fighter.id}`} target="_blank">เปิดหน้าโปรไฟล์เต็มในแท็บใหม่</Link></p>
    </dialog>
  )
}

export function FighterLink({ name }: { name: string }) {
  const fighter = fighterByName(name)
  if (!fighter) return <>{name}</>
  return <Link className="fighter-link" href={`/fighters/${fighter.id}`}><Flag code={fighter.countryCode} size={36} /> {name}</Link>
}
