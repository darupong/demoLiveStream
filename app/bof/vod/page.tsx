import Link from 'next/link'
import { findEvent, vodQueue, vodStatusLabel } from '@/lib/mock'

const tone = { preparing: '', failed: 'tag-bad', review: 'tag-warn', published: 'tag-ok' }

export default function BofVod() {
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">อนุมัติ VOD</h1></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>รายการ</th><th>ไฟล์บันทึก</th><th>สถานะ</th><th /></tr></thead>
          <tbody>
            {vodQueue.map((v) => {
              const e = findEvent(v.eventId)!
              return (
                <tr key={v.eventId}>
                  <td>{e.red} vs {e.blue}</td>
                  <td>{v.files.length} ไฟล์</td>
                  <td><span className={`tag ${tone[v.status]}`}>{vodStatusLabel[v.status]}</span></td>
                  <td><Link href={`/bof/vod/${v.eventId}`}>ตรวจไฟล์</Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
