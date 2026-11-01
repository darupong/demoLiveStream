'use client'

import { FightEvent, rounds } from '@/lib/mock'
import { AvatarByName } from './FighterAvatar'
import { FighterFlag } from './Flag'

export type ScoreState = 'ready' | 'waiting' | 'processing' | 'failed' | 'retrying' | 'hidden'

export const scoreOptions: [ScoreState, string][] = [
  ['ready', 'ผลพร้อมแล้ว'],
  ['waiting', 'รอผล'],
  ['processing', 'กำลังประมวลผล'],
  ['failed', 'ประมวลผลล้มเหลว'],
  ['retrying', 'กำลังลองใหม่'],
  ['hidden', 'ยังไม่ถึงเวลาแสดง (กันสปอยล์)'],
]

const pendingLabel: Record<Exclude<ScoreState, 'ready'>, string> = {
  waiting: 'รอผล',
  processing: 'กำลังประมวลผล',
  failed: 'ยังไม่มีผล ทีมงานกำลังตรวจสอบ',
  retrying: 'กำลังลองใหม่',
  hidden: 'แสดงเมื่อดูถึงยกนี้',
}

// Only the latest finished round depends on the scoring job; earlier rounds are settled.
export function visibleRounds(state: ScoreState) {
  return rounds.map((r, i) => ({ ...r, pending: state !== 'ready' && i === rounds.length - 1 }))
}

export function MatchCard({ event, clock, round, state, live, onFighter }: { event: FightEvent; clock: string; round: number; state: ScoreState; live: boolean; onFighter: (name: string) => void }) {
  const shown = visibleRounds(state).filter((r) => !r.pending)
  const total = (side: 'red' | 'blue') => shown.reduce((sum, r) => sum + r[side], 0)
  const [min, sec] = clock.split(':').map(Number)
  return (
    <section className="panel">
      <div className="row between">
        <h2>การแข่งขันปัจจุบัน</h2>
        {live && <span className="tag tag-bad">● LIVE</span>}
      </div>
      <div className="row between small" style={{ marginTop: 14 }}>
        <span className="muted">กำลังแข่งขัน</span>
        <b className="lime">ยกที่ {round} / {event.rounds}</b>
      </div>
      <div className="clock">{clock}</div>
      <div className="bar"><i style={{ width: `${Math.min(100, ((min * 60 + sec) / 180) * 100)}%` }} /></div>
      <div className="corners">
        <button className="fighter-btn" aria-label={`ดูโปรไฟล์ ${event.red}`} onClick={() => onFighter(event.red)}>
          <div className="corner-dot red"><AvatarByName name={event.red} size={50} /></div>
          <b className="small"><FighterFlag name={event.red} size={27} /> {event.red}</b>
          <div className="muted small">มุมแดง</div>
        </button>
        <span className="muted small">vs</span>
        <button className="fighter-btn" aria-label={`ดูโปรไฟล์ ${event.blue}`} onClick={() => onFighter(event.blue)}>
          <div className="corner-dot blue"><AvatarByName name={event.blue} size={50} /></div>
          <b className="small"><FighterFlag name={event.blue} size={27} /> {event.blue}</b>
          <div className="muted small">มุมน้ำเงิน</div>
        </button>
      </div>
      <div className="totals">
        <div><b className="red">{total('red')}</b><div className="muted small">มุมแดง</div></div>
        <span className="muted small">คะแนนรวม AI จาก {shown.length} ยกที่จบแล้ว</span>
        <div><b className="blue">{total('blue')}</b><div className="muted small">มุมน้ำเงิน</div></div>
      </div>
    </section>
  )
}

export function RoundTable({ state, currentRound }: { state: ScoreState; currentRound?: number }) {
  return (
    <section className="panel">
      <div className="row between">
        <h2>คะแนนรายยก</h2>
        <span className="tag tag-lime">AI SCORING</span>
      </div>
      <table className="score-table">
        <thead>
          <tr><th scope="col">ยก</th><th scope="col" className="red">มุมแดง</th><th scope="col" className="blue">มุมน้ำเงิน</th></tr>
        </thead>
        <tbody>
          {visibleRounds(state).map((r) => (
            <tr key={r.round}>
              <td>ยก {r.round}</td>
              {r.pending && state !== 'ready'
                ? <td colSpan={2} className="muted">{pendingLabel[state]}</td>
                : <><td className="red">{r.red}</td><td className="blue">{r.blue}</td></>}
            </tr>
          ))}
          {currentRound && (
            <tr><td>ยก {currentRound}</td><td colSpan={2} className="lime">กำลังแข่งขัน</td></tr>
          )}
        </tbody>
      </table>
    </section>
  )
}

export function RoundRecap({ state }: { state: ScoreState }) {
  return (
    <section className="panel">
      <h2>สรุปรายยก</h2>
      <ol className="recap">
        {visibleRounds(state).filter((r) => !r.pending).map((r) => (
          <li key={r.round}><b>ยก {r.round}</b> <span className="muted">{r.recap}</span></li>
        ))}
      </ol>
    </section>
  )
}
