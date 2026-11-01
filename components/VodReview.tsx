'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FightEvent, VodStatus, vodQueue, vodStatusLabel } from '@/lib/mock'
import { Ring } from './Ring'

export function VodReview({ event, item }: { event: FightEvent; item: (typeof vodQueue)[number] }) {
  const [status, setStatus] = useState<VodStatus>(item.status)
  const [selected, setSelected] = useState(item.files[0]?.vid)
  return (
    <>
      <div className="bof-head">
        <div>
          <Link className="muted small" href="/bof/vod">อนุมัติ VOD</Link>
          <h1 className="bof-title">{event.red} vs {event.blue}</h1>
        </div>
        <span className="tag">{vodStatusLabel[status]}</span>
      </div>
      <div className="two">
        <div className="player">
          <div className="stage">
            <Ring />
            {!selected && <div className="overlay"><h2>ยังไม่มีไฟล์ให้ตรวจ</h2></div>}
          </div>
          {selected && <div className="controls"><span className="small muted">กำลังตรวจไฟล์ {selected}</span></div>}
        </div>
        <section className="panel stack">
          <h2>ไฟล์บันทึกของรายการนี้</h2>
          {item.files.length > 1 && <p className="muted small">สัญญาณหลุดระหว่างรายการ ไฟล์จึงแยกเป็น {item.files.length} ส่วน</p>}
          {status === 'preparing' && <p className="muted small">ระบบกำลังรับไฟล์จากการบันทึก</p>}
          {status === 'failed' && (
            <>
              <p className="alert">เตรียมไฟล์ไม่สำเร็จ ไม่ได้รับไฟล์บันทึกภายในเวลาที่กำหนด</p>
              <div><button className="btn" onClick={() => setStatus('preparing')}>เตรียมไฟล์ใหม่</button></div>
            </>
          )}
          {item.files.map((f) => (
            <button key={f.vid} className="choice" aria-pressed={f.vid === selected} onClick={() => setSelected(f.vid)}>
              <b>{f.vid}</b>
              <div className="muted small">ความยาว {f.length}</div>
            </button>
          ))}
          <div className="row">
            {status === 'published'
              ? <button className="btn btn-danger" onClick={() => setStatus('review')}>เลิกเผยแพร่</button>
              : <button className="btn btn-lime" disabled={status !== 'review'} onClick={() => setStatus('published')}>อนุมัติและเผยแพร่</button>}
          </div>
        </section>
      </div>
    </>
  )
}
