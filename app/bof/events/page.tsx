import Link from 'next/link'
import { events } from '@/lib/mock'

const label = { live: 'กำลังถ่ายทอด', upcoming: 'รอเริ่ม', ended: 'จบแล้ว รอ VOD', vod: 'เผยแพร่ VOD แล้ว' }

export default function BofEvents() {
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">รายการถ่ายทอด</h1></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>รายการ</th><th>วันเวลา</th><th>สนาม</th><th>สถานะ</th><th /></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.red} vs {e.blue}</td>
                <td>{e.date}</td>
                <td>{e.venue}</td>
                <td><span className={`tag ${e.status === 'live' ? 'tag-live' : ''}`}>{label[e.status]}</span></td>
                <td><Link href={`/bof/events/${e.id}`}>ควบคุมรายการ</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
