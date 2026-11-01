'use client'

import { useLedger } from '@/lib/creditStore'
import { findEvent, giftTransactions } from '@/lib/mock'

export default function BofGifts() {
  const ledger = useLedger()
  const mine = ledger
    .filter((l) => l.gift)
    .reverse()
    .map((l) => ({ id: l.id, user: 'fah@example.com', gift: l.gift!, credit: -l.change, to: l.to!, eventId: l.eventId!, time: l.time }))
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">ธุรกรรมของขวัญ</h1></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>เลขธุรกรรม</th><th>เวลา</th><th>ผู้ส่ง</th><th>ของขวัญ</th><th>Credit</th><th>ผู้รับ</th><th>รายการ</th></tr></thead>
          <tbody>
            {[...mine, ...giftTransactions].map((t) => {
              const e = findEvent(t.eventId)!
              return <tr key={t.id}><td>{t.id}</td><td>{t.time}</td><td>{t.user}</td><td>{t.gift}</td><td>{t.credit}</td><td>{t.to}</td><td>{e.red} vs {e.blue}</td></tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
