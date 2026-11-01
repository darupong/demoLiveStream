'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FightEvent } from '@/lib/mock'
import { FighterLink } from './FighterProfile'
import { MockPanel } from './MockPanel'
import { Ring } from './Ring'

export function EventDetail({ event }: { event: FightEvent }) {
  const [access, setAccess] = useState('entitled')
  const live = event.status === 'live'
  return (
    <>
      <nav className="crumbs" aria-label="เส้นทาง">
        <Link href="/">หน้าหลัก</Link><span>/</span><b>{event.red} vs {event.blue}</b>
      </nav>
      <div className="detail">
        <div className="stack">
          <h1 className="title"><FighterLink name={event.red} /> <span className="vs">vs</span> <FighterLink name={event.blue} /></h1>
          <div className="player"><div className="stage"><Ring /></div></div>
        </div>
        <aside className="panel stack">
          <dl className="facts">
            <div><dt>วันเวลา</dt><dd>{event.date}</dd></div>
            <div><dt>สนาม</dt><dd>{event.venue}</dd></div>
            <div><dt>รุ่น</dt><dd>{event.division}</dd></div>
            <div><dt>กำหนด</dt><dd>{event.rounds} ยก</dd></div>
            <div><dt>ค่ารับชม</dt><dd>{event.price} บาท</dd></div>
          </dl>
          {access === 'guest' && (
            <>
              <p className="muted small">เข้าสู่ระบบเพื่อตรวจสิทธิ์รับชมรายการนี้</p>
              <Link className="btn btn-lime" href="/login">เข้าสู่ระบบ</Link>
            </>
          )}
          {access === 'none' && (
            <>
              <p className="muted small">บัญชีนี้ยังไม่มีสิทธิ์รับชมรายการนี้</p>
              <a className="btn btn-lime" href="https://example.com/ppv" target="_blank" rel="noreferrer">ซื้อสิทธิ์รับชม {event.price} บาท</a>
            </>
          )}
          {access === 'entitled' && (live
            ? <Link className="btn btn-lime" href={`/live/${event.id}`}>ดูถ่ายทอดสด</Link>
            : <p className="tag tag-ok">มีสิทธิ์รับชมแล้ว รอเริ่ม {event.date}</p>)}
        </aside>
      </div>
      <MockPanel groups={[{
        label: 'สิทธิ์ผู้ชม',
        value: access,
        onChange: setAccess,
        options: [['entitled', 'มีสิทธิ์ PPV'], ['none', 'Login แล้ว ไม่มีสิทธิ์'], ['guest', 'ยังไม่ Login']],
      }]} />
    </>
  )
}
