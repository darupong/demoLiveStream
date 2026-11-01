'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FightEvent, streamLog } from '@/lib/mock'
import { MockPanel } from './MockPanel'

type Signal = 'none' | 'on' | 'grace' | 'ended' | 'lost' | 'stopped'

const GRACE_SECONDS = 60
const STOP_TIME = '20:52:10'

const signalTag: Record<Signal, { label: string; tone: string }> = {
  none: { label: 'รอเริ่ม', tone: '' },
  on: { label: 'กำลังถ่ายทอด', tone: 'tag-live' },
  grace: { label: 'สัญญาณขาดช่วง', tone: 'tag-warn' },
  ended: { label: 'จบรายการ', tone: '' },
  lost: { label: 'จบรายการ', tone: 'tag-bad' },
  stopped: { label: 'จบรายการ', tone: '' },
}

const endReason: Partial<Record<Signal, string>> = {
  ended: 'จบตามปกติ',
  lost: 'สัญญาณหลุดเกินเวลารอ',
  stopped: 'Admin สั่งหยุด',
}

const initialSignal = (status: FightEvent['status']): Signal => (status === 'live' ? 'on' : status === 'upcoming' ? 'none' : 'ended')

export function StreamControl({ event }: { event: FightEvent }) {
  const [signal, setSignal] = useState<Signal>(initialSignal(event.status))
  const [confirming, setConfirming] = useState(false)
  const [grace, setGrace] = useState(GRACE_SECONDS)
  const [showKey, setShowKey] = useState(false)
  const [log, setLog] = useState(event.status === 'upcoming' ? [] : streamLog)
  const running = signal === 'on' || signal === 'grace'

  // Grace timer: a short drop keeps the event open, a long one ends it.
  useEffect(() => {
    if (signal !== 'grace') return
    setGrace(GRACE_SECONDS)
    const timer = setInterval(() => setGrace((g) => g - 1), 1000)
    return () => clearInterval(timer)
  }, [signal])

  useEffect(() => {
    if (signal === 'grace' && grace <= 0) setSignal('lost')
  }, [signal, grace])

  function stop() {
    setConfirming(false)
    setSignal('stopped')
    setLog((l) => [...l, { time: STOP_TIME, text: 'Admin หยุดรายการ และบล็อกการส่งสัญญาณซ้ำ' }])
  }

  return (
    <>
      <div className="bof-head">
        <div>
          <Link className="muted small" href="/bof/events">รายการถ่ายทอด</Link>
          <h1 className="bof-title">{event.red} vs {event.blue}</h1>
        </div>
        <span className={`tag ${signalTag[signal].tone}`}>{signalTag[signal].label}</span>
      </div>
      <div className="two">
        <div className="stack">
          <section className="panel stack">
            <h2>ค่าสำหรับ OBS</h2>
            <div className="field"><label>Server</label><code className="code">rtmp://push.example.com/live</code></div>
            <div className="field">
              <label>Stream Key</label>
              <code className="code">{showKey ? 'mock-stream-key-0000' : '••••••••••••••••'}</code>
            </div>
            <div><button className="btn btn-sm" onClick={() => setShowKey(!showKey)}>{showKey ? 'ซ่อน Stream Key' : 'แสดง Stream Key'}</button></div>
          </section>
          <section className="panel">
            <h2>บันทึกสถานะสัญญาณ</h2>
            {log.length === 0 && <p className="muted small" style={{ marginTop: 12 }}>ยังไม่ได้รับสัญญาณจาก OBS</p>}
            <ul className="recap small">
              {log.map((l) => <li key={l.time}><span className="muted">{l.time}</span> {l.text}</li>)}
            </ul>
          </section>
        </div>
        <div className="stack">
          <section className="panel stack">
            <h2>สถานะสัญญาณ</h2>
            <dl className="facts">
              <div><dt>ตอนนี้</dt><dd>{signalTag[signal].label}</dd></div>
              {signal === 'grace' && <div><dt>เวลารอสัญญาณกลับ</dt><dd className="lime">{Math.max(0, grace)} วินาที</dd></div>}
              {endReason[signal] && <div><dt>เหตุผลที่จบ</dt><dd>{endReason[signal]}</dd></div>}
            </dl>
          </section>
          <section className="panel stack">
            <h2>หยุดรายการ</h2>
            {running && !confirming && (
              <>
                <p className="muted small">ผู้ชมจะเห็นหน้าจบการถ่ายทอด และ OBS จะส่งสัญญาณกลับเข้ารายการนี้ไม่ได้</p>
                <div><button className="btn btn-danger" onClick={() => setConfirming(true)}>หยุดรายการ</button></div>
              </>
            )}
            {running && confirming && (
              <>
                <p className="small">ยืนยันหยุด {event.red} vs {event.blue}? ทำแล้วเริ่มสัญญาณเดิมต่อไม่ได้</p>
                <div className="row">
                  <button className="btn btn-danger" onClick={stop}>ยืนยันหยุดรายการ</button>
                  <button className="btn" onClick={() => setConfirming(false)}>ยกเลิก</button>
                </div>
              </>
            )}
            {signal === 'none' && <p className="muted small">รายการนี้ยังไม่เริ่มถ่ายทอด</p>}
            {!running && signal !== 'none' && (
              <>
                <p className="muted small">รายการนี้จบแล้ว ไฟล์บันทึกจะไปรอตรวจที่หน้าอนุมัติ VOD</p>
                <div><Link className="btn btn-sm" href="/bof/vod">ไปหน้าอนุมัติ VOD</Link></div>
              </>
            )}
          </section>
        </div>
      </div>
      {event.status === 'live' && (
        <MockPanel groups={[{
          label: 'สัญญาณจาก OBS',
          value: signal,
          onChange: (v) => setSignal(v as Signal),
          options: [['on', 'ส่งสัญญาณปกติ'], ['grace', 'สัญญาณขาดช่วง'], ['ended', 'จบตามปกติ'], ['lost', 'สัญญาณหลุดเกินเวลารอ'], ['stopped', 'Admin สั่งหยุด']],
        }]} />
      )}
    </>
  )
}
