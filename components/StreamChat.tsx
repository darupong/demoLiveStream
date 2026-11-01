'use client'

import { useEffect, useRef, useState } from 'react'
import { fighterByName } from '@/lib/fighters'
import { FightEvent } from '@/lib/mock'
import { FighterAvatar } from './FighterAvatar'
import { FighterFlag } from './Flag'
import { PinnedProduct } from './LiveOverlay'
import { Composer, GiftPicker } from './LiveTray'
import { ChatMessage, ChatState, LiveRoom } from './useLiveRoom'

export type ChatMode = 'open' | 'paused' | 'ai' | 'locked'

type PanelProps = {
  event: FightEvent
  room: LiveRoom
  chatState: ChatState
  mode: ChatMode
  showPin: boolean
  onFighter: (name: string) => void
  onCollapse: () => void
}

const NAME_COLORS = ['#ff7a85', '#7fb0ff', '#e6b450', '#6fdba0', '#c79bff', '#ff9f68']
const STICK_TO_BOTTOM_PX = 80
const MAX_UNREAD = 99

const nameColor = (name: string) => NAME_COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % NAME_COLORS.length]

function ChatLog({ messages }: { messages: ChatMessage[] }) {
  const log = useRef<HTMLUListElement>(null)
  const [reported, setReported] = useState<number[]>([])

  // Follow new messages unless the viewer scrolled up to read older ones.
  useEffect(() => {
    const el = log.current
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < STICK_TO_BOTTOM_PX) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <ul className="chat-list" role="log" aria-label="ประวัติแชท" ref={log}>
      {messages.slice(-60).map((m) => (
        <li key={m.id} className={m.gift ? 'is-gift' : undefined}>
          <span><b style={{ color: nameColor(m.user) }}>{m.user}</b> {m.text}</span>
          <button className="link-btn" disabled={reported.includes(m.id)} onClick={() => setReported((r) => [...r, m.id])}>
            {reported.includes(m.id) ? 'รายงานแล้ว' : 'รายงาน'}
          </button>
        </li>
      ))}
    </ul>
  )
}

function share(room: LiveRoom) {
  const { red, blue } = room.cheers
  const redShare = Math.round((red / (red + blue)) * 100)
  return { red, blue, redShare, blueShare: 100 - redShare }
}

function BattleSide({ name, percent, tone, onFighter }: { name: string; percent: number; tone: string; onFighter: (name: string) => void }) {
  const fighter = fighterByName(name)
  return (
    <button className={`battle-side ${tone}`} aria-label={`ดูโปรไฟล์ ${name}`} onClick={() => onFighter(name)}>
      {fighter && <FighterAvatar fighter={fighter} size={58} />}
      <b className="battle-share">{percent}%</b>
      <small><FighterFlag name={name} size={18} /> {name}</small>
    </button>
  )
}

function CheerBattle({ event, room, enabled, onFighter }: { event: FightEvent; room: LiveRoom; enabled: boolean; onFighter: (name: string) => void }) {
  const { red, blue, redShare, blueShare } = share(room)
  return (
    <section className="cheer-battle" aria-label="คะแนนเชียร์จากผู้ชม">
      <h3>ศึกแฟนมวย</h3>
      <div className="battle-row">
        <BattleSide name={event.red} percent={redShare} tone="red" onFighter={onFighter} />
        <span className="vs">VS</span>
        <BattleSide name={event.blue} percent={blueShare} tone="blue" onFighter={onFighter} />
      </div>
      <div className="cheer-bar" role="img" aria-label={`${event.red} ${redShare} เปอร์เซ็นต์ ${event.blue} ${blueShare} เปอร์เซ็นต์`}>
        <i style={{ width: `${redShare}%` }} />
      </div>
      <div className="cheer-actions">
        <button className="cheer-btn red" disabled={!enabled} aria-label={`เชียร์ ${event.red}`} onClick={() => room.cheer('red')}>♥ {red.toLocaleString()}</button>
        <button className="cheer-btn blue" disabled={!enabled} aria-label={`เชียร์ ${event.blue}`} onClick={() => room.cheer('blue')}>♥ {blue.toLocaleString()}</button>
      </div>
    </section>
  )
}

export function StreamChat({ event, room, chatState, mode, showPin, onFighter, onCollapse }: PanelProps) {
  const open = mode === 'open'
  const pin = showPin && <PinnedProduct eventId={event.id} />
  return (
    <aside className="watch-chat" aria-label="แชทสด">
      <div className="chat-head">
        <h2>แชทสด</h2>
        <button className="chat-toggle" aria-label="ย่อแถบแชท" title="ย่อแถบแชท" onClick={onCollapse}>⇥ <small>ย่อ</small></button>
      </div>
      {mode === 'ai' && <>{pin}<div className="chat-closed"><h3>โหมด AI ปิดแชท เชียร์ และของขวัญ</h3><p>กลับไปโหมดถ่ายทอดสดเพื่อใช้งาน</p></div></>}
      {mode === 'locked' && <>{pin}<div className="chat-closed"><h3>แชทเปิดเฉพาะผู้มีสิทธิ์รับชม</h3><p>เข้าสู่ระบบและมีสิทธิ์รับชมก่อนใช้แชท เชียร์ และของขวัญ</p></div></>}
      {(open || mode === 'paused') && (
        <>
          <CheerBattle event={event} room={room} enabled={open} onFighter={onFighter} />
          <ChatLog messages={room.messages} />
          {pin}
          {open
            ? <div className="tray"><GiftPicker event={event} room={room} /><Composer room={room} chatState={chatState} /></div>
            : <p className="chat-note">แชทเปิดระหว่างถ่ายทอดสด</p>}
        </>
      )}
    </aside>
  )
}

export function CollapsedChat({ event, room, mode, onExpand }: { event: FightEvent; room: LiveRoom; mode: ChatMode; onExpand: () => void }) {
  const [seen] = useState(() => room.messages.at(-1)?.id ?? 0)
  const unread = room.messages.filter((m) => m.id > seen).length
  const { redShare, blueShare } = share(room)
  const open = mode === 'open'
  return (
    <aside className="watch-chat is-collapsed" aria-label="แชทสดแบบย่อ">
      <button className="chat-toggle" aria-label="เปิดแถบแชท" title="เปิดแถบแชท" onClick={onExpand}>
        ⇤ <small>แชท</small>
        {unread > 0 && <span className="chat-unread">{unread > MAX_UNREAD ? `${MAX_UNREAD}+` : unread}</span>}
      </button>
      {(open || mode === 'paused') && (
        <div className="chat-mini">
          <button className="cheer-btn red" disabled={!open} aria-label={`เชียร์ ${event.red}`} onClick={() => room.cheer('red')}>♥<small>{redShare}%</small></button>
          <button className="cheer-btn blue" disabled={!open} aria-label={`เชียร์ ${event.blue}`} onClick={() => room.cheer('blue')}>♥<small>{blueShare}%</small></button>
        </div>
      )}
    </aside>
  )
}
