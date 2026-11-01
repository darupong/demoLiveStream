'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { campOf, nextFightOf } from '@/lib/fighters'
import { Channel, channelOf, chaptersOf, commentsOf, formatViews, KIND_LABEL, toSeconds, transcriptOf, uploadedOf, upNext, Video, VideoKind } from '@/lib/library'
import { initial } from '@/lib/mock'
import { FighterAvatar } from './FighterAvatar'
import { Flag } from './Flag'
import { videoPoster } from './HomePage'

const TICK_MS = 250
const AUTOPLAY_MS = 5000
const FILTERS: ('all' | VideoKind)[] = ['all', 'interview', 'documentary', 'technique']

const toClock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`
const agoLabel = (hours: number) => (hours < 1 ? 'เมื่อสักครู่' : hours < 24 ? `${hours} ชั่วโมงที่แล้ว` : `${Math.floor(hours / 24)} วันที่แล้ว`)
const activeIndex = (items: { at: number }[], position: number) => items.reduce((best, item, i) => (item.at <= position ? i : best), 0)

type Timeline = { position: number; total: number; playing: boolean; toggle: () => void; seek: (to: number) => void }

function useTimeline(total: number): Timeline {
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setPosition((p) => Math.min(total, p + TICK_MS / 1000)), TICK_MS)
    return () => clearInterval(timer)
  }, [playing, total])

  useEffect(() => {
    if (position >= total) setPlaying(false)
  }, [position, total])

  function toggle() {
    if (position >= total) setPosition(0)
    setPlaying(!playing)
  }

  return { position, total, playing, toggle, seek: setPosition }
}

function ChannelAvatar({ channel, size }: { channel: Channel; size: number }) {
  if (channel.fighter) return <FighterAvatar fighter={channel.fighter} size={size} />
  return <span className="yt-initial" style={{ width: size, height: size, background: channel.camp?.color }} aria-hidden="true">{initial(channel.name.replace('ค่าย', ''))}</span>
}

function Stage({ video, channel, line }: { video: Video; channel: Channel; line: string }) {
  const fighter = channel.fighter
  return (
    <div className="stage">
      {fighter
        ? (
          <div className="studio" style={{ '--tone': campOf(fighter).color } as CSSProperties}>
            <span className="studio-mark">LIVESTREAM.</span>
            <FighterAvatar fighter={fighter} size={220} />
            <span className="studio-name"><Flag code={fighter.countryCode} size={30} /> <b>{fighter.name}</b> <small>{fighter.camp}</small></span>
          </div>
        )
        : videoPoster(video)}
      <p className="studio-sub">{line}</p>
    </div>
  )
}

function Player({ video, channel, next, time, theater, onTheater }: { video: Video; channel: Channel; next: Video; time: Timeline; theater: boolean; onTheater: () => void }) {
  const router = useRouter()
  const box = useRef<HTMLDivElement>(null)
  const [autoplay, setAutoplay] = useState(true)
  const chapters = chaptersOf(video)
  const lines = transcriptOf(video)
  const ended = time.position >= time.total
  const line = time.playing || (time.position > 0 && !ended) ? lines[activeIndex(lines, time.position)].text : ''

  useEffect(() => {
    if (!ended || !autoplay) return
    const timer = setTimeout(() => router.push(`/watch/${next.id}`), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [ended, autoplay, next.id, router])

  return (
    <div className="player watch-player" ref={box}>
      <Stage video={video} channel={channel} line={line} />
      {ended && (
        <div className="yt-end">
          <p className="muted small">{autoplay ? 'เล่นถัดไปอัตโนมัติใน 5 วินาที' : 'วิดีโอถัดไป'}</p>
          <h2>{next.title}</h2>
          <div className="row">
            <Link className="btn btn-lime" href={`/watch/${next.id}`}>เล่นเลย</Link>
            {autoplay && <button className="btn" onClick={() => setAutoplay(false)}>ยกเลิก</button>}
          </div>
        </div>
      )}
      <div className="watch-seek">
        {chapters.slice(1).map((c) => <i key={c.at} style={{ left: `${(c.at / time.total) * 100}%` }} />)}
        <input className="seek" type="range" aria-label="ตำแหน่งวิดีโอ" min={0} max={time.total} step={1} value={time.position} onChange={(e) => time.seek(Number(e.target.value))} />
      </div>
      <div className="controls">
        <button className="icon-btn" aria-label={time.playing ? 'หยุดชั่วคราว' : 'เล่น'} onClick={time.toggle}>{time.playing ? '❚❚' : '▶'}</button>
        <Link className="icon-btn" aria-label="วิดีโอถัดไป" href={`/watch/${next.id}`}>⏭</Link>
        <span className="small muted yt-time">{toClock(time.position)} / {video.length}</span>
        <span className="small muted watch-chapter">{chapters[activeIndex(chapters, time.position)].title}</span>
        <button className="yt-switch" role="switch" aria-checked={autoplay} aria-label="เล่นถัดไปอัตโนมัติ" title="เล่นถัดไปอัตโนมัติ" onClick={() => setAutoplay(!autoplay)}><i /></button>
        <button className="icon-btn yt-theater-btn" aria-label={theater ? 'ออกจากโหมดโรงภาพยนตร์' : 'โหมดโรงภาพยนตร์'} aria-pressed={theater} title="โหมดโรงภาพยนตร์" onClick={onTheater}>▭</button>
        <button className="icon-btn" aria-label="เต็มจอ" onClick={() => box.current?.requestFullscreen?.()}>⛶</button>
      </div>
    </div>
  )
}

function ChannelRow({ video, channel }: { video: Video; channel: Channel }) {
  const [following, setFollowing] = useState(false)
  const [vote, setVote] = useState<'' | 'up' | 'down'>('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const likes = Math.round(video.views * 0.04) + (vote === 'up' ? 1 : 0)
  const name = <b>{channel.name}</b>

  function share() {
    navigator.clipboard?.writeText(location.href)
    setCopied(true)
  }

  return (
    <div className="yt-channel">
      <div className="yt-owner">
        <ChannelAvatar channel={channel} size={44} />
        <div className="yt-owner-copy">
          {channel.href ? <Link href={channel.href}>{name}</Link> : name}
          <small className="muted">ผู้ติดตาม {formatViews(channel.followers + (following ? 1 : 0))} คน</small>
        </div>
        <button className={`yt-pill ${following ? '' : 'is-solid'}`} aria-pressed={following} onClick={() => setFollowing(!following)}>{following ? 'ติดตามแล้ว' : 'ติดตาม'}</button>
      </div>
      <div className="yt-actions">
        <span className="yt-vote">
          <button aria-label={`ถูกใจ ${formatViews(likes)}`} aria-pressed={vote === 'up'} onClick={() => setVote(vote === 'up' ? '' : 'up')}>♥ {formatViews(likes)}</button>
          <button aria-label="ไม่ถูกใจ" aria-pressed={vote === 'down'} onClick={() => setVote(vote === 'down' ? '' : 'down')}>✕</button>
        </span>
        <button className="yt-pill" onClick={share}>{copied ? 'คัดลอกลิงก์แล้ว' : 'แชร์'}</button>
        <button className="yt-pill" aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? 'บันทึกแล้ว' : 'บันทึก'}</button>
      </div>
    </div>
  )
}

function Description({ video, time, onTranscript }: { video: Video; time: Timeline; onTranscript: () => void }) {
  const [open, setOpen] = useState(false)
  const chapters = chaptersOf(video)
  const active = activeIndex(chapters, time.position)
  return (
    <section className="yt-desc" aria-label="คำอธิบายวิดีโอ">
      <p className="yt-desc-meta">{formatViews(video.views)} ครั้ง · {uploadedOf(video)} · {KIND_LABEL[video.kind]}</p>
      <p>{video.description}</p>
      {open && (
        <>
          <h2>ตอนย่อย</h2>
          <ol className="watch-chapters">
            {chapters.map((c, i) => (
              <li key={c.at}>
                <button aria-current={i === active ? 'true' : undefined} onClick={() => time.seek(c.at)}><span>{toClock(c.at)}</span> {c.title}</button>
              </li>
            ))}
          </ol>
          <div><button className="yt-pill" onClick={onTranscript}>แสดงบทสนทนา</button></div>
        </>
      )}
      <button className="yt-more" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'แสดงน้อยลง' : 'เพิ่มเติม'}</button>
    </section>
  )
}

function FightBanner({ channel }: { channel: Channel }) {
  const next = channel.fighter && nextFightOf(channel.fighter)
  if (!next) return null
  const live = next.event.status === 'live'
  return (
    <Link className="yt-fight" href={live ? `/live/${next.event.id}` : `/events/${next.event.id}`}>
      {live && <span className="tag tag-live">● LIVE</span>}
      <span>{live ? `${channel.name} กำลังชกกับ ${next.opponent.name}` : `ไฟต์ถัดไป พบ ${next.opponent.name} ${next.event.date}`}</span>
      <b>{live ? 'ดูสด' : 'ดูรายการ'}</b>
    </Link>
  )
}

function Comments({ video }: { video: Video }) {
  const [items, setItems] = useState(() => commentsOf(video))
  const [sort, setSort] = useState('top')
  const [text, setText] = useState('')
  const [liked, setLiked] = useState<string[]>([])
  const [reported, setReported] = useState<string[]>([])

  function submit(e: FormEvent) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return
    setItems([{ id: `me-${Date.now()}`, user: 'ฟ้า', text: clean, likes: 0, hours: 0 }, ...items])
    setText('')
  }

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  // Like YouTube, a comment you just wrote stays on top whichever order is picked.
  const sorted = [...items].sort((a, b) => (sort === 'top' ? Number(a.hours > 0) - Number(b.hours > 0) || b.likes - a.likes : a.hours - b.hours))

  return (
    <section className="yt-comments" aria-label="ความคิดเห็น">
      <div className="yt-comments-head">
        <h2>ความคิดเห็น {items.length} รายการ</h2>
        <select className="input" aria-label="เรียงความคิดเห็น" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="top">ยอดนิยม</option>
          <option value="new">ล่าสุด</option>
        </select>
      </div>
      <form className="yt-comment-form" onSubmit={submit}>
        <span className="yt-initial" aria-hidden="true">ฟ</span>
        <input aria-label="เขียนความคิดเห็น" maxLength={300} placeholder="เพิ่มความคิดเห็น" value={text} onChange={(e) => setText(e.target.value)} />
        {text.trim() && <button className="btn btn-sm btn-lime">แสดงความคิดเห็น</button>}
      </form>
      <ul>
        {sorted.map((c) => (
          <li key={c.id}>
            <span className="yt-initial" aria-hidden="true">{initial(c.user)}</span>
            <div>
              <p className="small"><b>{c.user}</b> <span className="muted">{agoLabel(c.hours)}</span></p>
              <p>{c.text}</p>
              <div className="yt-comment-actions">
                <button aria-label={`ถูกใจความคิดเห็นของ ${c.user}`} aria-pressed={liked.includes(c.id)} onClick={() => setLiked(toggle(liked, c.id))}>♥ {c.likes + (liked.includes(c.id) ? 1 : 0)}</button>
                <button disabled={reported.includes(c.id)} onClick={() => setReported([...reported, c.id])}>{reported.includes(c.id) ? 'รายงานแล้ว' : 'รายงาน'}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Transcript({ video, time, onClose }: { video: Video; time: Timeline; onClose: () => void }) {
  const lines = transcriptOf(video)
  const active = activeIndex(lines, time.position)
  return (
    <section className="yt-transcript" aria-label="บทสนทนา">
      <div className="row between">
        <h2>บทสนทนา</h2>
        <button className="icon-btn" aria-label="ปิดบทสนทนา" onClick={onClose}>✕</button>
      </div>
      <ol className="watch-transcript">
        {lines.map((l, i) => (
          <li key={l.at}>
            <button aria-current={i === active ? 'true' : undefined} onClick={() => time.seek(l.at)}><span>{toClock(l.at)}</span> {l.text}</button>
          </li>
        ))}
      </ol>
    </section>
  )
}

function UpNext({ video }: { video: Video }) {
  const [filter, setFilter] = useState<'all' | VideoKind>('all')
  const list = upNext(video).filter((v) => filter === 'all' || v.kind === filter)
  return (
    <section className="yt-next" aria-label="วิดีโอแนะนำ">
      <div className="yt-chips" role="group" aria-label="กรองวิดีโอแนะนำ">
        {FILTERS.map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'ทั้งหมด' : KIND_LABEL[f]}</button>
        ))}
      </div>
      <ol>
        {list.map((v) => (
          <li key={v.id}>
            <Link href={`/watch/${v.id}`}>
              <span className="yt-thumb">{videoPoster(v)}<em>{v.length}</em></span>
              <span className="yt-next-copy">
                <b>{v.title}</b>
                <small className="muted">{channelOf(v).name}</small>
                <small className="muted">{formatViews(v.views)} ครั้ง · {uploadedOf(v)}</small>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function WatchPage({ video }: { video: Video }) {
  const time = useTimeline(toSeconds(video.length))
  const [theater, setTheater] = useState(false)
  const [transcript, setTranscript] = useState(false)
  const channel = channelOf(video)
  const player = <Player video={video} channel={channel} next={upNext(video)[0]} time={time} theater={theater} onTheater={() => setTheater(!theater)} />

  return (
    <div className={theater ? 'yt is-theater' : 'yt'}>
      {theater && player}
      <div className="yt-columns">
        <div className="yt-main">
          {!theater && player}
          <div className="yt-info">
            <h1>{video.title}</h1>
            <ChannelRow video={video} channel={channel} />
            <Description video={video} time={time} onTranscript={() => setTranscript(true)} />
            <FightBanner channel={channel} />
          </div>
          <Comments video={video} />
        </div>
        <aside className="yt-side">
          {transcript && <Transcript video={video} time={time} onClose={() => setTranscript(false)} />}
          <UpNext video={video} />
        </aside>
      </div>
    </div>
  )
}
