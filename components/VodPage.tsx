'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FightEvent, vodQueue } from '@/lib/mock'
import { FightFeed } from './FightFeed'
import { FighterLink } from './FighterProfile'
import { MockPanel } from './MockPanel'
import { RoundRecap, RoundTable } from './ScorePanels'

const blocked: Record<string, { title: string; body: string; action?: 'buy' }> = {
  preparing: { title: 'กำลังเตรียมไฟล์ย้อนหลัง', body: 'ไฟล์จะพร้อมหลังจบรายการไม่นาน' },
  review: { title: 'ไฟล์ย้อนหลังรอตรวจ', body: 'เปิดให้รับชมเมื่อผ่านการอนุมัติ' },
  failed: { title: 'เตรียมไฟล์ย้อนหลังไม่สำเร็จ', body: 'ทีมงานกำลังตรวจสอบ ติดต่อฝ่ายช่วยเหลือหากต้องการข้อมูลเพิ่มเติม' },
  denied: { title: 'บัญชีนี้ยังไม่มีสิทธิ์รับชมรายการนี้', body: 'ซื้อสิทธิ์เพื่อดูย้อนหลัง', action: 'buy' },
}

const FALLBACK_SECONDS = 4360
const TICK_MS = 250

const toSeconds = (length: string) => length.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)
const toClock = (s: number) => {
  const whole = Math.floor(s)
  return `${Math.floor(whole / 3600)}:${String(Math.floor(whole / 60) % 60).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`
}

export function VodPage({ event }: { event: FightEvent }) {
  const files = vodQueue.find((v) => v.eventId === event.id)?.files ?? []
  const total = files.reduce((sum, f) => sum + toSeconds(f.length), 0) || FALLBACK_SECONDS

  const [state, setState] = useState('ready')
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [seekId, setSeekId] = useState(0)
  const notice = blocked[state]
  const running = playing && !notice

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setPosition((p) => Math.min(total, p + TICK_MS / 1000)), TICK_MS)
    return () => clearInterval(timer)
  }, [running, total])

  useEffect(() => {
    if (position >= total) setPlaying(false)
  }, [position, total])

  function seek(to: number) {
    setPosition(to)
    setSeekId((id) => id + 1)
  }

  let partStart = 0
  const parts = files.map((f, i) => {
    const part = { ...f, number: i + 1, start: partStart }
    partStart += toSeconds(f.length)
    return part
  })

  return (
    <>
      <nav className="crumbs" aria-label="เส้นทาง">
        <Link href="/">หน้าหลัก</Link><span>/</span>
        <Link href="/vod">ดูย้อนหลัง</Link><span>/</span>
        <b>{event.red} vs {event.blue}</b>
      </nav>
      <div className="live-head">
        <div>
          <h1 className="title"><FighterLink name={event.red} /> <span className="vs">vs</span> <FighterLink name={event.blue} /></h1>
          <p className="muted">{event.date} {event.division}</p>
        </div>
      </div>
      <div className="live-grid">
        <div className="stack">
          <div className="player">
            <div className="stage">
              <FightFeed key={seekId} start={600 + position} playing={running} delay={0} skeleton={false} />
              {notice && (
                <div className="overlay">
                  <h2>{notice.title}</h2>
                  <p className="muted">{notice.body}</p>
                  {notice.action === 'buy' && <a className="btn btn-lime" href="https://example.com/ppv" target="_blank" rel="noreferrer">ซื้อสิทธิ์รับชม {event.price} บาท</a>}
                </div>
              )}
            </div>
            <div className="controls">
              <button className="icon-btn" aria-label={playing ? 'หยุดชั่วคราว' : 'เล่น'} disabled={!!notice} onClick={() => setPlaying(!playing)}>{playing ? '❚❚' : '▶'}</button>
              <input className="seek" type="range" aria-label="ตำแหน่งวิดีโอ" min={0} max={total} step={1} value={position} disabled={!!notice} onChange={(e) => seek(Number(e.target.value))} />
              <span className="small muted">{toClock(position)} / {toClock(total)}</span>
            </div>
          </div>
          {parts.length > 1 && (
            <section className="panel stack">
              <h2>ส่วนของการถ่ายทอด</h2>
              <p className="muted small">สัญญาณหลุดระหว่างรายการ วิดีโอจึงมี {parts.length} ส่วน และเล่นต่อกันอัตโนมัติ</p>
              <div className="row">
                {parts.map((p) => (
                  <button key={p.vid} className="btn btn-sm" disabled={!!notice} onClick={() => seek(p.start)}>ส่วนที่ {p.number} ({p.length})</button>
                ))}
              </div>
            </section>
          )}
          <RoundRecap state="ready" />
        </div>
        <aside className="side"><RoundTable state="ready" /></aside>
      </div>
      <MockPanel groups={[{
        label: 'สถานะ VOD',
        value: state,
        onChange: setState,
        options: [['ready', 'พร้อมรับชม'], ['preparing', 'กำลังเตรียม'], ['review', 'รอตรวจ'], ['failed', 'ล้มเหลว'], ['denied', 'ไม่มีสิทธิ์']],
      }]} />
    </>
  )
}
