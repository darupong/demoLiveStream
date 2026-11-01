'use client'

import Link from 'next/link'
import { FormEvent, useId, useState } from 'react'
import { BIG_GIFT_CREDIT, FightEvent, Gift, gifts } from '@/lib/mock'
import { ChatState, LiveRoom } from './useLiveRoom'

// Pick a fighter and a gift. Small gifts send on tap for speed; expensive ones need a second tap.
export function GiftPicker({ event, room }: { event: FightEvent; room: LiveRoom }) {
  const [to, setTo] = useState(event.red)
  const [confirming, setConfirming] = useState<Gift | null>(null)

  function tapGift(gift: Gift) {
    if (gift.credit >= BIG_GIFT_CREDIT && gift.credit <= room.credit) return setConfirming(gift)
    setConfirming(null)
    room.sendGift(gift, to)
  }

  function confirmGift() {
    if (confirming) room.sendGift(confirming, to)
    setConfirming(null)
  }

  if (confirming) {
    return (
      <div className="tray-confirm" role="alertdialog" aria-label="ยืนยันส่งของขวัญ">
        <span className="small">ส่ง {confirming.icon} {confirming.name} ให้ {to} ใช้ {confirming.credit.toLocaleString()} Credit</span>
        <div className="row">
          <button className="btn btn-sm btn-lime" onClick={confirmGift}>ยืนยันส่ง</button>
          <button className="btn btn-sm" onClick={() => setConfirming(null)}>ยกเลิก</button>
        </div>
      </div>
    )
  }
  if (room.short) {
    return (
      <div className="tray-confirm tray-short" role="alert">
        <span className="small">Credit ไม่พอสำหรับ{room.short.name}</span>
        <div className="row">
          <a className="btn btn-sm btn-lime" href="https://example.com/credit" target="_blank" rel="noreferrer">เติม Credit</a>
          <button className="btn btn-sm" onClick={room.clearShort}>ปิด</button>
        </div>
      </div>
    )
  }
  return (
    <div className="gift-picker">
      <div className="tray-to" role="group" aria-label="ส่งของขวัญให้">
        {[event.red, event.blue].map((name) => (
          <button key={name} className="to-btn" aria-pressed={to === name} onClick={() => setTo(name)}>{name}</button>
        ))}
      </div>
      <div className="gift-row">
        {gifts.map((g) => (
          <button key={g.id} className="gift-btn" aria-label={`ส่ง${g.name} ${g.credit.toLocaleString()} Credit`} onClick={() => tapGift(g)}>
            <span aria-hidden="true">{g.icon}</span>
            <small>{g.credit.toLocaleString()}</small>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Composer({ room, chatState }: { room: LiveRoom; chatState: ChatState }) {
  const formId = useId()
  const [text, setText] = useState('')
  const canType = ['ok', 'failed', 'limited'].includes(chatState)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (room.send(text)) setText('')
  }

  return (
    <>
      {room.error && <p className="alert small" role="alert">{room.error}</p>}
      {chatState === 'blocked' && <p className="alert small">บัญชีนี้ถูกบล็อกจากแชทในรายการนี้</p>}
      {chatState === 'no-rights' && <p className="alert small">บัญชีนี้ไม่มีสิทธิ์แชทในรายการนี้</p>}
      {chatState === 'guest' && <p className="muted small">เข้าสู่ระบบเพื่อแชทกับคนดู <Link className="lime" href="/login">เข้าสู่ระบบ</Link></p>}
      {canType && <input className="input" form={formId} aria-label="ข้อความแชท" maxLength={200} placeholder="ส่งข้อความ" value={text} onChange={(e) => setText(e.target.value)} />}
      <form id={formId} className="tray-foot" onSubmit={submit}>
        <span className="tray-credit small">Credit <b className="lime">{room.credit.toLocaleString()}</b></span>
        {canType && <button className="btn btn-sm btn-lime">ส่ง</button>}
      </form>
    </>
  )
}
