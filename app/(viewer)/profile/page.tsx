'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { balanceOf, useLedger } from '@/lib/creditStore'
import { entitlements, findEvent } from '@/lib/mock'

export default function ProfilePage() {
  const ledger = useLedger()
  const [name, setName] = useState('ฟ้า')
  const [saved, setSaved] = useState(false)
  const mine = entitlements.filter((e) => e.user === 'fah@example.com')

  function save(e: FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <div className="stack" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="title">โปรไฟล์</h1>
      <section className="panel">
        <form className="stack" onSubmit={save}>
          <div className="field">
            <label htmlFor="display-name">ชื่อที่แสดง</label>
            <input id="display-name" className="input" required maxLength={40} value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }} />
          </div>
          <dl className="facts">
            <div><dt>อีเมล</dt><dd>fah@example.com</dd></div>
            <div><dt>Credit คงเหลือ</dt><dd className="lime">{balanceOf(ledger).toLocaleString()}</dd></div>
          </dl>
          <div className="row">
            <button className="btn btn-lime">บันทึกโปรไฟล์</button>
            {saved && <span className="tag tag-ok" role="status">บันทึกโปรไฟล์แล้ว</span>}
          </div>
        </form>
      </section>
      <section className="panel">
        <h2>สิทธิ์รับชมของฉัน</h2>
        <ul className="recap">
          {mine.map((m) => {
            const event = findEvent(m.eventId)!
            return (
              <li key={m.ref} className="row between">
                <Link href={event.status === 'vod' ? `/vod/${event.id}` : `/live/${event.id}`}>{event.red} vs {event.blue}</Link>
                <span className="muted small">ได้รับ {m.grantedAt}</span>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="panel">
        <h2>ประวัติ Credit และของขวัญ</h2>
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="table">
            <thead><tr><th>เวลา</th><th>รายการ</th><th>Credit</th><th>คงเหลือ</th></tr></thead>
            <tbody>
              {[...ledger].reverse().map((l) => (
                <tr key={l.id}>
                  <td>{l.time}</td>
                  <td>{l.label}</td>
                  <td className={l.change < 0 ? 'red' : 'lime'}>{l.change > 0 ? '+' : ''}{l.change.toLocaleString()}</td>
                  <td>{l.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div><Link className="btn" href="/login">ออกจากระบบ</Link></div>
    </div>
  )
}
