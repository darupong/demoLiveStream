'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { setChatCollapsed, useChatCollapsed } from '@/lib/chatPanelStore'
import { formatClock, LIVE_ROUND, ROUND_SECONDS, roundSeconds } from '@/lib/liveClock'
import { FightEvent } from '@/lib/mock'
import { FightFeed } from './FightFeed'
import { AvatarByName } from './FighterAvatar'
import { FighterDialog } from './FighterProfile'
import { FighterFlag } from './Flag'
import { CheerFloats, GiftBanners } from './LiveOverlay'
import { MockPanel } from './MockPanel'
import { MatchCard, RoundRecap, RoundTable, scoreOptions, ScoreState } from './ScorePanels'
import { ShopPanel, shopOptions, ShopState } from './ShopPanel'
import { ChatMode, CollapsedChat, StreamChat } from './StreamChat'
import { chatOptions, ChatState, useLiveRoom } from './useLiveRoom'

type Stream = 'live' | 'waiting' | 'lost' | 'token' | 'ended' | 'vod-pending'
type Access = 'entitled' | 'none' | 'guest'

const streamOptions: [Stream, string][] = [
  ['live', 'กำลังถ่ายทอด'],
  ['waiting', 'รอเริ่ม'],
  ['lost', 'สัญญาณหลุด'],
  ['token', 'ลิงก์รับชมหมดอายุ'],
  ['ended', 'จบแล้ว VOD พร้อม'],
  ['vod-pending', 'จบแล้ว VOD ยังไม่พร้อม'],
]

const AI_DELAY = 30
const RECONNECT_MS: Partial<Record<Stream, number>> = { lost: 6000, token: 3000 }

export function LivePage({ event }: { event: FightEvent }) {
  const [access, setAccess] = useState<Access>('entitled')
  const [stream, setStream] = useState<Stream>('live')
  const [mode, setMode] = useState<'normal' | 'ai'>('normal')
  const [score, setScore] = useState<ScoreState>('ready')
  const [aiData, setAiData] = useState('ready')
  const [aiVideo, setAiVideo] = useState('ready')
  const [chat, setChat] = useState<ChatState>('ok')
  const [shop, setShop] = useState<ShopState>('ready')
  const [shopOpen, setShopOpen] = useState(false)
  const [seconds, setSeconds] = useState(102)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fighter, setFighter] = useState('')
  const collapsed = useChatCollapsed()
  const player = useRef<HTMLDivElement>(null)

  const canWatch = access === 'entitled'
  const isLive = stream === 'live' && canWatch
  const ai = mode === 'ai'
  const aiWaiting = ai && aiVideo === 'waiting' && isLive
  const clock = formatClock(Math.max(0, ai ? seconds - AI_DELAY : seconds))
  const social = isLive && !ai
  const room = useLiveRoom(event.id, event.red, event.blue, social, chat)
  const chatMode: ChatMode = !canWatch ? 'locked' : ai ? 'ai' : isLive ? 'open' : 'paused'

  // In the delayed view the last round only ended "just now" for live viewers, so its score waits.
  const shownScore: ScoreState = ai && seconds < AI_DELAY ? 'hidden' : score

  useEffect(() => {
    if (!isLive || paused) return
    const timer = setInterval(() => setSeconds((s) => (s + 1) % ROUND_SECONDS), 1000)
    return () => clearInterval(timer)
  }, [isLive, paused])

  useEffect(() => {
    setSeconds(roundSeconds(event.id))
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
  }, [event.id])

  // SOW S02: a dropped signal or expired link recovers by itself without ending the event.
  useEffect(() => {
    const wait = RECONNECT_MS[stream]
    if (!wait) return
    const timer = setTimeout(() => setStream('live'), wait)
    return () => clearTimeout(timer)
  }, [stream])

  return (
    <div className="watch" data-chat={collapsed ? 'collapsed' : 'open'}>
      <div className="watch-player">
        <div className="player live-player" ref={player}>
          <div className="stage">
            <FightFeed playing={isLive && !paused && !aiWaiting} delay={ai ? AI_DELAY : 0} skeleton={ai && aiData === 'ready' && isLive && !aiWaiting} />
            <div className="stage-tl">
              {isLive && <span className="tag tag-live">● LIVE</span>}
              <span className="chip">{event.viewers} รับชม</span>
            </div>
            <div className="stage-tr">
              <span className="chip">{ai ? `AI SKELETON ช้ากว่าสด ${AI_DELAY} วินาที` : 'HD 1080p MAIN CAMERA'}</span>
              <span className="mark">LIVESTREAM.</span>
            </div>
            {isLive && (
              <div className="lower-third">
                <span><FighterFlag name={event.red} size={30} /> {event.red}</span>
                <b>{clock}<small>ROUND {LIVE_ROUND} / {event.rounds}</small></b>
                <span>{event.blue} <FighterFlag name={event.blue} size={30} /></span>
              </div>
            )}
            {social && (
              <>
                <GiftBanners banners={room.banners} />
                <CheerFloats floats={room.floats} />
              </>
            )}
            {canWatch && stream === 'waiting' && (
              <div className="overlay"><h2>การถ่ายทอดสดจะเริ่มเร็ว ๆ นี้</h2><p className="muted">เริ่ม {event.date}</p></div>
            )}
            {canWatch && stream === 'lost' && (
              <div className="overlay">
                <h2>สัญญาณภาพขาดช่วง</h2>
                <p className="muted">กำลังเชื่อมต่อใหม่อัตโนมัติ รายการยังไม่จบ</p>
                <button className="btn" onClick={() => setStream('live')}>เชื่อมต่ออีกครั้ง</button>
              </div>
            )}
            {canWatch && stream === 'token' && (
              <div className="overlay">
                <h2>ลิงก์รับชมหมดอายุ</h2>
                <p className="muted">กำลังขอลิงก์ใหม่และกลับเข้ารับชมให้อัตโนมัติ</p>
                <button className="btn btn-lime" onClick={() => setStream('live')}>กลับเข้ารับชม</button>
              </div>
            )}
            {canWatch && stream === 'ended' && (
              <div className="overlay">
                <h2>จบการถ่ายทอดสด</h2>
                <p className="muted">ดูย้อนหลังได้แล้ว</p>
                <Link className="btn btn-lime" href={`/vod/${event.id}`}>ดูย้อนหลัง</Link>
              </div>
            )}
            {canWatch && stream === 'vod-pending' && (
              <div className="overlay">
                <h2>จบการถ่ายทอดสด</h2>
                <p className="muted">ไฟล์ย้อนหลังยังไม่พร้อม กำลังเตรียมไฟล์และรอตรวจก่อนเผยแพร่</p>
              </div>
            )}
            {access === 'guest' && (
              <div className="overlay overlay-solid">
                <h2>เข้าสู่ระบบเพื่อรับชม</h2>
                <p className="muted">ต้องเข้าสู่ระบบก่อนตรวจสิทธิ์รับชมรายการนี้</p>
                <Link className="btn btn-lime" href="/login">เข้าสู่ระบบ</Link>
              </div>
            )}
            {access === 'none' && (
              <div className="overlay overlay-solid">
                <h2>บัญชีนี้ยังไม่มีสิทธิ์รับชม</h2>
                <p className="muted">ซื้อสิทธิ์รับชมรายการนี้เพื่อดูถ่ายทอดสด</p>
                <a className="btn btn-lime" href="https://example.com/ppv" target="_blank" rel="noreferrer">ซื้อสิทธิ์รับชม {event.price} บาท</a>
              </div>
            )}
            {aiWaiting && (
              <div className="overlay">
                <h2>ภาพหน่วง 30 วินาทียังไม่พร้อม</h2>
                <p className="muted">โหมด AI ต้องรอภาพสะสมหลังเริ่มถ่ายทอดประมาณ 30 วินาที</p>
                <button className="btn btn-lime" onClick={() => setAiVideo('ready')}>ลองอีกครั้ง</button>
              </div>
            )}
            {ai && isLive && !aiWaiting && aiData === 'missing' && (
              <div className="overlay" style={{ background: 'none', placeContent: 'end center', paddingBottom: 64 }}>
                <span className="chip">ข้อมูล Skeleton ยังไม่พร้อม ภาพจะยังเล่นต่อ</span>
              </div>
            )}
          </div>
          <div className="controls">
            <button className="icon-btn" aria-label={paused ? 'เล่น' : 'หยุดชั่วคราว'} onClick={() => setPaused(!paused)}>{paused ? '▶' : '❚❚'}</button>
            <button className="icon-btn" aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'} aria-pressed={muted} onClick={() => setMuted(!muted)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
              </svg>
            </button>
            <span className="small">{isLive ? <><span className="red">●</span> ถ่ายทอดสด</> : 'หยุดเล่น'}</span>
            <span className="small lime" style={{ marginLeft: 'auto' }}>1080p HD</span>
            <button className="icon-btn" aria-label="เต็มจอ" onClick={() => player.current?.requestFullscreen?.()}>⛶</button>
          </div>
        </div>
      </div>

      {collapsed
        ? <CollapsedChat event={event} room={room} mode={chatMode} onExpand={() => setChatCollapsed(false)} />
        : <StreamChat event={event} room={room} chatState={chat} mode={chatMode} showPin={isLive} onFighter={setFighter} onCollapse={() => setChatCollapsed(true)} />}

      <div className="watch-info">
        <header className="channel">
          <div className="channel-avatars" aria-hidden="true">
            <span className="red"><AvatarByName name={event.red} size={46} /></span>
            <span className="blue"><AvatarByName name={event.blue} size={46} /></span>
            {isLive && <em>LIVE</em>}
          </div>
          <div className="channel-copy">
            <h1>
              <button className="fighter-btn" aria-label={`ดูโปรไฟล์ ${event.red}`} onClick={() => setFighter(event.red)}><FighterFlag name={event.red} size={36} /> {event.red}</button>
              {' '}<span className="vs">vs</span>{' '}
              <button className="fighter-btn" aria-label={`ดูโปรไฟล์ ${event.blue}`} onClick={() => setFighter(event.blue)}>{event.blue} <FighterFlag name={event.blue} size={36} /></button>
            </h1>
            <p className="muted">มวยไทย · {event.division} · กำหนด {event.rounds} ยก</p>
            <div className="row channel-tags">
              <span className="tag">{event.venue}</span>
              <span className="tag">ภาษาไทย</span>
              <span className="tag tag-lime">AI SCORING</span>
            </div>
          </div>
          <div className="channel-actions">
            <div className="channel-buttons">
              <button className="mode" aria-pressed={!ai} onClick={() => setMode('normal')}>ถ่ายทอดสด</button>
              <button className="mode" aria-pressed={ai} onClick={() => setMode('ai')}>AI Skeleton</button>
              <button className="btn" aria-expanded={shopOpen} onClick={() => setShopOpen(!shopOpen)}>ร้านค้า</button>
            </div>
            <div className="channel-stats">
              <b className="red">● {event.viewers}</b>
              <span>ยก {LIVE_ROUND} / {event.rounds} {clock}</span>
              <button className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(location.href)}>แชร์การแข่งขัน</button>
            </div>
          </div>
        </header>
        {ai && <p className="muted small">จุดและเส้นบนภาพเป็นตัวอย่างประกอบ งานวาดจริงเป็นของทีม AI</p>}
        {shopOpen && <ShopPanel eventId={event.id} state={shop} onRetry={() => setShop('ready')} />}
        <div className="watch-panels">
          <MatchCard event={event} clock={clock} round={LIVE_ROUND} state={shownScore} live={isLive} onFighter={setFighter} />
          <RoundTable state={shownScore} currentRound={LIVE_ROUND} />
          <RoundRecap state={shownScore} />
        </div>
      </div>

      {fighter && <FighterDialog name={fighter} onClose={() => setFighter('')} />}

      <MockPanel groups={[
        { label: 'สิทธิ์ผู้ชม', value: access, onChange: (v) => setAccess(v as Access), options: [['entitled', 'มีสิทธิ์ PPV'], ['none', 'Login แล้ว ไม่มีสิทธิ์'], ['guest', 'ยังไม่ Login']] },
        { label: 'สถานะ Live', value: stream, onChange: (v) => setStream(v as Stream), options: streamOptions },
        { label: 'คะแนนยกล่าสุด', value: score, onChange: (v) => setScore(v as ScoreState), options: scoreOptions },
        { label: 'เวลาในยก', value: 'now', onChange: (v) => v === 'early' && setSeconds(5), options: [['now', 'ตามเวลาปัจจุบัน'], ['early', 'เริ่มยกใหม่ 5 วินาที']] },
        { label: 'ภาพโหมด AI', value: aiVideo, onChange: setAiVideo, options: [['ready', 'พร้อม'], ['waiting', 'เปิดใน 30 วินาทีแรก']] },
        { label: 'ข้อมูล Skeleton', value: aiData, onChange: setAiData, options: [['ready', 'พร้อม'], ['missing', 'ยังไม่พร้อม']] },
        { label: 'แชท', value: chat, onChange: (v) => setChat(v as ChatState), options: chatOptions },
        { label: 'ร้านค้า', value: shop, onChange: (v) => setShop(v as ShopState), options: shopOptions },
      ]} />
    </div>
  )
}
