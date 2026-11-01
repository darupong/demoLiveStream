'use client'

import { useState } from 'react'
import { chatReports, findEvent } from '@/lib/mock'

export default function BofModeration() {
  const [outcome, setOutcome] = useState<Record<string, string>>({})
  const decide = (id: string, result: string) => setOutcome((o) => ({ ...o, [id]: result }))
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">ดูแลแชท</h1></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ผู้ใช้</th><th>ข้อความ</th><th>เหตุผล</th><th>รายการ</th><th>จัดการ</th></tr></thead>
          <tbody>
            {chatReports.map((r) => {
              const e = findEvent(r.eventId)!
              return (
                <tr key={r.id}>
                  <td>{r.user}</td>
                  <td>{r.text}</td>
                  <td>{r.reason}</td>
                  <td>{e.red} vs {e.blue}</td>
                  <td>
                    {outcome[r.id]
                      ? <span className="tag">{outcome[r.id]}</span>
                      : (
                        <div className="row" style={{ flexWrap: 'nowrap' }}>
                          <button className="btn btn-sm btn-danger" onClick={() => decide(r.id, 'บล็อกในรายการนี้แล้ว')}>บล็อก</button>
                          <button className="btn btn-sm" onClick={() => decide(r.id, 'ปิดรายงานแล้ว')}>ปิดรายงาน</button>
                        </div>
                      )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
