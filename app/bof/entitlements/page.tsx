'use client'

import { useState } from 'react'
import { entitlements, findEvent } from '@/lib/mock'

export default function BofEntitlements() {
  const [query, setQuery] = useState('')
  const rows = entitlements.filter((e) => e.user.includes(query.trim().toLowerCase()))
  return (
    <>
      <div className="bof-head">
        <h1 className="bof-title">สิทธิ์รับชม</h1>
        <input className="input" style={{ maxWidth: 280 }} type="search" aria-label="ค้นหาอีเมล" placeholder="ค้นหาอีเมล" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <p className="muted small" style={{ marginBottom: 12 }}>สิทธิ์มาจากระบบชำระเงินภายนอก หน้านี้ใช้ตรวจสอบเท่านั้น</p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ผู้ใช้</th><th>รายการ</th><th>ได้รับสิทธิ์</th><th>เลขอ้างอิง</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const e = findEvent(r.eventId)!
              return <tr key={r.ref}><td>{r.user}</td><td>{e.red} vs {e.blue}</td><td>{r.grantedAt}</td><td>{r.ref}</td></tr>
            })}
            {rows.length === 0 && <tr><td colSpan={4} className="muted">ไม่พบสิทธิ์ของอีเมลนี้</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
