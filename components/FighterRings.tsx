import { ReactNode } from 'react'
import { STRIKES, StrikeKey } from '@/lib/fighters'
import type { Result } from '@/lib/fighters'

// Adjacent slices pass the colour-blind check in this order, including last back to first.
export const SLICE_COLORS = ['#88a01c', '#5c86f5', '#c9822e', '#2ba896', '#b76fd1']
const METER = 'var(--lime)'
const PEER = '#7c8494'
const SLICE_GAP = 3
const CHART_SIZE = 112

type Slice = { label: string; value: number; color: string }

export function Donut({ parts, label, size = 132, thickness = 13, children }: { parts: Slice[]; label: string; size?: number; thickness?: number; children?: ReactNode }) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const shown = parts.filter((p) => p.value > 0)
  const total = shown.reduce((sum, p) => sum + p.value, 0)
  const gap = shown.length > 1 ? SLICE_GAP : 0
  let offset = 0
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`} fill="none" strokeWidth={thickness}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--line)" />
          {shown.map((p) => {
            const length = (p.value / total) * circumference
            const slice = (
              <circle key={p.label} cx={size / 2} cy={size / 2} r={radius} stroke={p.color} strokeDasharray={`${Math.max(1, length - gap)} ${circumference}`} strokeDashoffset={-offset}>
                <title>{`${p.label} ${p.value.toLocaleString()}`}</title>
              </circle>
            )
            offset += length
            return slice
          })}
        </g>
      </svg>
      {children && <div className="donut-center">{children}</div>}
    </div>
  )
}

function MeterRing({ percent, label, size = 96, children }: { percent: number; label: string; size?: number; children: ReactNode }) {
  const radius = (size - 11) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`} fill="none" strokeWidth="11">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--line)" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={METER} strokeLinecap="round" strokeDasharray={`${(Math.min(100, percent) / 100) * circumference} ${circumference}`} />
        </g>
      </svg>
      <div className="donut-center">{children}</div>
    </div>
  )
}

export function StatRing({ title, percent, value, note }: { title: string; percent: number; value: string; note: string }) {
  return (
    <div className="b-stat">
      <MeterRing percent={percent} label={`${title} ${value}`}><b>{value}</b></MeterRing>
      <div>
        <h3>{title}</h3>
        <p className="muted small">{note}</p>
      </div>
    </div>
  )
}

export function Legend({ parts }: { parts: Slice[] }) {
  return (
    <ul className="b-legend">
      {parts.map((p) => (
        <li key={p.label}>
          <i style={{ background: p.color }} aria-hidden="true" />
          <span>{p.label}</span>
          <b>{p.value.toLocaleString()}</b>
        </li>
      ))}
    </ul>
  )
}

export function WinMethods({ methods }: { methods: { label: string; value: number }[] }) {
  const parts = methods.map((m, i) => ({ ...m, color: SLICE_COLORS[i] }))
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className="b-chart">
      <Donut parts={parts} size={CHART_SIZE} thickness={12} label={`วิธีการชนะ ${parts.map((p) => `${p.label} ${p.value}`).join(' ')}`}>
        <b>{total}</b><small className="muted">ครั้งที่ชนะ</small>
      </Donut>
      <Legend parts={parts} />
    </div>
  )
}

export function StrikeMix({ strikes, division }: { strikes: Record<StrikeKey, number>; division: Record<StrikeKey, number> }) {
  const parts = STRIKES.map((s, i) => ({ label: s.label, value: strikes[s.key], color: SLICE_COLORS[i] }))
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  const divisionTotal = STRIKES.reduce((sum, s) => sum + division[s.key], 0)
  return (
    <div className="b-chart">
      <Donut parts={parts} size={CHART_SIZE} thickness={12} label={`อาวุธเข้าเป้าเฉลี่ยต่อไฟต์ ${parts.map((p) => `${p.label} ${p.value}`).join(' ')}`}>
        <b>{total}</b><small className="muted">ต่อไฟต์</small>
      </Donut>
      <Legend parts={parts} />
      <p className="muted small b-chart-note">เฉลี่ยในรุ่น {divisionTotal} ครั้งต่อไฟต์</p>
    </div>
  )
}

// Concentric arcs: each ring is a round, and a longer arc means a stronger round.
export function RoundRings({ rounds }: { rounds: { round: number; score: number }[] }) {
  const size = 132 // Drawing units; the rings scale down to CHART_SIZE on screen.
  const best = rounds.reduce((a, b) => (b.score > a.score ? b : a))
  return (
    <div className="b-chart">
      <div className="donut" style={{ width: CHART_SIZE, height: CHART_SIZE }}>
        <svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`คะแนนเฉลี่ยรายยก ${rounds.map((r) => `ยก ${r.round} ${r.score}`).join(' ')}`}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`} fill="none" strokeWidth="7" strokeLinecap="round">
            {rounds.map((r, i) => {
              const radius = 60 - i * 10
              const circumference = 2 * Math.PI * radius
              return (
                <g key={r.round}>
                  <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--line)" />
                  <circle cx={size / 2} cy={size / 2} r={radius} stroke={r.round === best.round ? METER : PEER} strokeDasharray={`${((r.score - 6) / 4) * circumference} ${circumference}`}>
                    <title>{`ยก ${r.round} คะแนนเฉลี่ย ${r.score}`}</title>
                  </circle>
                </g>
              )
            })}
          </g>
        </svg>
      </div>
      <ul className="b-legend">
        {rounds.map((r) => (
          <li key={r.round}>
            <i style={{ background: r.round === best.round ? METER : PEER }} aria-hidden="true" />
            <span>ยก {r.round}</span>
            <b>{r.score}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

const RESULT_LETTER: Record<Result, string> = { ชนะ: '✓', แพ้: '✕', เสมอ: '=' }
const RESULT_CLASS: Record<Result, string> = { ชนะ: 'is-win', แพ้: 'is-loss', เสมอ: '' }

export function FightRings({ fights }: { fights: { key: string; date: string; opponent: string; result: Result; score: number }[] }) {
  return (
    <ol className="fight-rings">
      {fights.map((f) => (
        <li key={f.key} className={RESULT_CLASS[f.result]} title={`${f.date} พบ ${f.opponent} ${f.result} คะแนน AI ${f.score}`}>
          <span aria-label={f.result}>{RESULT_LETTER[f.result]}</span>
          <small>{f.score}</small>
        </li>
      ))}
    </ol>
  )
}
