'use client'

import { useState } from 'react'
import { aiJobLabel, aiJobs, findEvent } from '@/lib/mock'

const tone = { waiting: '', processing: 'tag-warn', failed: 'tag-bad', done: 'tag-ok' }

export default function BofScores() {
  const [jobs, setJobs] = useState(aiJobs)
  return (
    <>
      <div className="bof-head"><h1 className="bof-title">คะแนน AI</h1></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>รายการ</th><th>ยก</th><th>สถานะ</th><th>ผลจาก AI</th><th /></tr></thead>
          <tbody>
            {jobs.map((j) => {
              const e = findEvent(j.eventId)!
              return (
                <tr key={j.id}>
                  <td>{e.red} vs {e.blue}</td>
                  <td>{j.round}</td>
                  <td><span className={`tag ${tone[j.status]}`}>{aiJobLabel[j.status]}</span></td>
                  <td>{j.raw ? <details><summary className="small">ดู JSON</summary><code className="code">{j.raw}</code></details> : <span className="muted">-</span>}</td>
                  <td>{j.status === 'failed' && <button className="btn btn-sm" onClick={() => setJobs((all) => all.map((x) => x.id === j.id ? { ...x, status: 'processing', raw: '' } : x))}>ลองใหม่</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
