'use client'

import { useLedger } from '@/lib/creditStore'
import { Fighter, giftsOf } from '@/lib/fighters'
import { Donut, Legend, SLICE_COLORS } from './FighterRings'

// Base totals plus anything this viewer sent from the Live page, so a new gift shows up here.
export function FighterGifts({ fighter }: { fighter: Fighter }) {
  const ledger = useLedger()
  const base = giftsOf(fighter)
  const mine = ledger.filter((l) => l.fighter === fighter.name)
  const myCredit = mine.reduce((sum, l) => sum - l.change, 0)

  const items = base.items.map((i) => ({ ...i, count: i.count + mine.filter((l) => l.gift === i.gift.name).length }))
  const pieces = items.reduce((sum, i) => sum + i.count, 0)
  const credit = items.reduce((sum, i) => sum + i.count * i.gift.credit, 0)
  const fans = [...base.fans, ...(myCredit > 0 ? [{ name: 'ฟ้า (คุณ)', credit: myCredit }] : [])].sort((a, b) => b.credit - a.credit).slice(0, 3)
  const parts = items.map((i, n) => ({ label: `${i.gift.icon} ${i.gift.name}`, value: i.count * i.gift.credit, color: SLICE_COLORS[n] }))

  return (
    <div className="b-gifts">
      <div className="b-gifts-chart">
        <Donut parts={parts} size={150} thickness={15} label={`ของขวัญจากผู้ชมรวม ${credit.toLocaleString()} Credit`}>
          <b>{credit.toLocaleString()}</b><small className="muted">Credit</small>
        </Donut>
        <p className="muted small">รวม {pieces.toLocaleString()} ชิ้น</p>
      </div>
      <Legend parts={parts} />
      <div className="b-gift-counts">
        {items.map((i) => (
          <span key={i.gift.id} title={`${i.gift.name} ${i.count.toLocaleString()} ชิ้น`}>
            <em aria-hidden="true">{i.gift.icon}</em>{i.count.toLocaleString()}
          </span>
        ))}
      </div>
      <div>
        <h4>แฟนที่ให้มากที่สุด</h4>
        <ol className="b-fans">
          {fans.map((f) => <li key={f.name}><span>{f.name}</span><b>{f.credit.toLocaleString()}</b></li>)}
        </ol>
      </div>
    </div>
  )
}
