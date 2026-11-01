'use client'

import { useState } from 'react'
import { events } from '@/lib/mock'
import { EventCard } from './EventCard'
import { ListState, listOptions } from './ListState'
import { MockPanel } from './MockPanel'

export function VodList() {
  const [state, setState] = useState('ready')
  return (
    <>
      <h1 className="title" style={{ marginBottom: 20 }}>ดูย้อนหลัง</h1>
      <ListState state={state} onRetry={() => setState('ready')} emptyTitle="ยังไม่มีรายการย้อนหลัง" emptyBody="รายการจะแสดงที่หน้านี้เมื่อผ่านการอนุมัติ" />
      {state === 'ready' && (
        <div className="grid">
          {events.filter((e) => e.status === 'vod').map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
      <MockPanel groups={[{ label: 'หน้ารายการย้อนหลัง', value: state, onChange: setState, options: listOptions }]} />
    </>
  )
}
