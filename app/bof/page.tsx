import Link from 'next/link'
import { aiJobs, chatReports, events, vodQueue } from '@/lib/mock'

export default function BofHome() {
  const live = events.filter((e) => e.status === 'live')
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">ภาพรวม</h1></div>
      <div className="queue">
        <Link href="/bof/events"><b>{live.length}</b><span className="muted small">รายการกำลังถ่ายทอด</span></Link>
        <Link href="/bof/vod"><b>{vodQueue.filter((v) => v.status === 'review').length}</b><span className="muted small">VOD รอตรวจ</span></Link>
        <Link href="/bof/scores"><b>{aiJobs.filter((j) => j.status === 'failed').length}</b><span className="muted small">งานคะแนน AI ล้มเหลว</span></Link>
        <Link href="/bof/moderation"><b>{chatReports.length}</b><span className="muted small">รายงานแชทรอจัดการ</span></Link>
      </div>
      <h2 className="section-head" style={{ marginTop: 0 }}>กำลังถ่ายทอด</h2>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>รายการ</th><th>ผู้ชม</th><th>เริ่ม</th><th /></tr></thead>
          <tbody>
            {live.map((e) => (
              <tr key={e.id}>
                <td>{e.red} vs {e.blue}</td>
                <td>{e.viewers}</td>
                <td>{e.date}</td>
                <td><Link href={`/bof/events/${e.id}`}>ควบคุมรายการ</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
