'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { campOf, Fighter, fighterByName, fighters, analyticsOf, camps } from '@/lib/fighters'
import { documentaries, fightClips, formatViews, highlights, interviews, techniques, Video, videos } from '@/lib/library'
import { events, FightEvent } from '@/lib/mock'
import { FighterAvatar } from './FighterAvatar'
import { FightFeed } from './FightFeed'
import { FighterFlag, Flag } from './Flag'
import { ListState, listOptions } from './ListState'
import { MockPanel } from './MockPanel'
import { CampPoster, MatchPoster, PersonPoster, TechniquePoster } from './Posters'
import { VideoRow, VideoTile } from './VideoRow'

const TOP_COUNT = 10
const ROW_LIMIT = 12
const FEATURE_START = 600
const FEATURE_OFFSET = 137

const pairOf = (e: FightEvent) => [fighterByName(e.red)!, fighterByName(e.blue)!] as const

export function videoPoster(video: Video) {
  const camp = camps.find((c) => c.id === video.campId)
  if (video.kind === 'documentary' && camp) return <CampPoster camp={camp} />
  if (video.kind === 'technique' && camp) return <TechniquePoster video={video} color={camp.color} />
  const fighter = fighters.find((f) => f.id === video.fighterId)!
  return <PersonPoster fighter={fighter} color={campOf(fighter).color} />
}

function Billboard({ playing }: { playing: boolean }) {
  const live = events.filter((e) => e.status === 'live')
  const [featureId, setFeatureId] = useState(live[0].id)
  const index = live.findIndex((e) => e.id === featureId)
  const feature = live[index]
  const [red, blue] = pairOf(feature)
  return (
    <section className="billboard" aria-label="กำลังถ่ายทอดสด">
      <FightFeed key={feature.id} start={FEATURE_START + index * FEATURE_OFFSET} playing={playing} delay={0} skeleton={false} />
      <div className="billboard-shade" />
      <div className="billboard-copy">
        <p className="billboard-status"><span className="tag tag-live">● LIVE</span> <span>{feature.viewers} รับชมอยู่</span></p>
        <h1>
          <span><Flag code={red.countryCode} size={60} /> {red.name}</span>
          <span className="vs">vs</span>
          <span>{blue.name} <Flag code={blue.countryCode} size={60} /></span>
        </h1>
        <p className="billboard-note">{feature.division} กำหนด {feature.rounds} ยก ที่{feature.venue}</p>
        <div className="row">
          <Link className="btn btn-lime billboard-play" href={`/live/${feature.id}`}>▶ ดูถ่ายทอดสด</Link>
          <Link className="btn" href={`/events/${feature.id}`}>ข้อมูลรายการ</Link>
          <Link className="btn" href={`/fighters/${red.id}`}>โปรไฟล์ {red.name}</Link>
        </div>
      </div>
      <div className="billboard-switch" role="group" aria-label="เลือกรายการถ่ายทอดสด">
        {live.map((e) => {
          const [a, b] = pairOf(e)
          return (
            <button key={e.id} aria-pressed={e.id === featureId} onClick={() => setFeatureId(e.id)}>
              <FighterAvatar fighter={a} size={34} />
              <FighterAvatar fighter={b} size={34} />
              <span><b>{e.red} vs {e.blue}</b><small>{e.viewers} รับชม</small></span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function Rows() {
  const topClips = [
    ...highlights.map((h) => ({ key: h.bout.id, href: h.href, title: h.title, views: h.views, poster: <MatchPoster red={h.winner} blue={h.loser} avatar={66} /> })),
    ...videos.map((v) => ({ key: v.id, href: `/watch/${v.id}`, title: v.title, views: v.views, poster: videoPoster(v) })),
  ].sort((a, b) => b.views - a.views).slice(0, TOP_COUNT)

  const resume = [
    { href: fightClips[0].href, title: `${fightClips[0].red.name} vs ${fightClips[0].blue.name}`, meta: fightClips[0].bout.date, progress: 64, poster: <MatchPoster red={fightClips[0].red} blue={fightClips[0].blue} /> },
    { href: `/watch/${interviews[1].id}`, title: interviews[1].title, meta: `สัมภาษณ์ ${interviews[1].length}`, progress: 22, poster: videoPoster(interviews[1]) },
    { href: `/watch/${documentaries[0].id}`, title: documentaries[0].title, meta: `สารคดี ${documentaries[0].length}`, progress: 81, poster: videoPoster(documentaries[0]) },
  ]

  const featured = [...fighters].map((f) => ({ fighter: f, rank: analyticsOf(f).rank })).filter((f) => f.rank === 1)

  return (
    <div className="home-rows">
      <VideoRow title="กำลังถ่ายทอดสด">
        {events.filter((e) => e.status === 'live').map((e) => {
          const [red, blue] = pairOf(e)
          return <VideoTile key={e.id} href={`/live/${e.id}`} poster={<MatchPoster red={red} blue={blue} />} badge={<span className="tag tag-live">● LIVE</span>} length={`${e.viewers} รับชม`} title={`${e.red} vs ${e.blue}`} meta={`${e.division}, ${e.venue}`} />
        })}
      </VideoRow>

      <VideoRow title="ดูต่อจากที่ค้างไว้">
        {resume.map((r) => <VideoTile key={r.href} {...r} />)}
      </VideoRow>

      <VideoRow title="10 อันดับยอดนิยม">
        {topClips.map((t, i) => (
          <Link key={t.key} className="top-tile" href={t.href}>
            <span className="top-number" aria-hidden="true">{i + 1}</span>
            <span className="top-art">
              {t.poster}
              <b>{t.title}</b>
              <small className="muted">อันดับ {i + 1}, {formatViews(t.views)} ครั้ง</small>
            </span>
          </Link>
        ))}
      </VideoRow>

      <VideoRow title="รายการที่จะมาถึง">
        {events.filter((e) => e.status === 'upcoming').map((e) => {
          const [red, blue] = pairOf(e)
          return <VideoTile key={e.id} href={`/events/${e.id}`} poster={<MatchPoster red={red} blue={blue} />} badge={<span className="tag">เร็ว ๆ นี้</span>} title={`${e.red} vs ${e.blue}`} meta={e.date} />
        })}
      </VideoRow>

      <VideoRow title="ดูย้อนหลังล่าสุด" href="/vod">
        {fightClips.slice(0, ROW_LIMIT).map((c) => (
          <VideoTile key={c.bout.id} href={c.href} poster={<MatchPoster red={c.red} blue={c.blue} />} title={`${c.red.name} vs ${c.blue.name}`} meta={`${c.bout.date}, ${c.bout.division}`} />
        ))}
      </VideoRow>

      <VideoRow title="ไฮไลต์น็อกเด็ด">
        {highlights.slice(0, ROW_LIMIT).map((h) => (
          <VideoTile key={h.bout.id} href={h.href} poster={<MatchPoster red={h.winner} blue={h.loser} />} badge={<span className="tag tag-lime">น็อก</span>} length={h.length} title={h.title} meta={`${formatViews(h.views)} ครั้ง`} />
        ))}
      </VideoRow>

      <VideoRow title="บทสัมภาษณ์นักมวย">
        {interviews.map((v) => <VideoTile key={v.id} href={`/watch/${v.id}`} poster={videoPoster(v)} length={v.length} title={v.title} meta={`${formatViews(v.views)} ครั้ง`} />)}
      </VideoRow>

      <VideoRow title="เบื้องหลังค่ายมวย">
        {documentaries.map((v) => <VideoTile key={v.id} href={`/watch/${v.id}`} poster={videoPoster(v)} length={v.length} title={v.title} meta={`${formatViews(v.views)} ครั้ง`} />)}
      </VideoRow>

      <VideoRow title="สอนเทคนิคมวยไทย">
        {techniques.map((v) => <VideoTile key={v.id} href={`/watch/${v.id}`} poster={videoPoster(v)} length={v.length} title={v.title} meta={v.description} />)}
      </VideoRow>

      <VideoRow title="นักมวยแนะนำ" href="/fighters">
        {featured.map(({ fighter }: { fighter: Fighter }) => (
          <Link key={fighter.id} className="fighter-chip" href={`/fighters/${fighter.id}`}>
            <FighterAvatar fighter={fighter} size={112} />
            <b><FighterFlag name={fighter.name} size={21} /> {fighter.name}</b>
            <small className="muted">อันดับ 1 {fighter.division}</small>
          </Link>
        ))}
      </VideoRow>
    </div>
  )
}

export function HomePage() {
  const [state, setState] = useState('ready')
  const [playing, setPlaying] = useState(true)

  // The billboard has no pause button, so honour the system setting with a still frame.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])

  return (
    <div className="home">
      {state === 'ready'
        ? (
          <>
            <Billboard playing={playing} />
            <Rows />
          </>
        )
        : (
          <div className="home-state">
            <ListState state={state} onRetry={() => setState('ready')} emptyTitle="ยังไม่มีรายการในตอนนี้" emptyBody="รายการใหม่จะแสดงที่หน้านี้เมื่อประกาศตารางแข่ง" />
          </div>
        )}
      <MockPanel groups={[{ label: 'หน้าแรก', value: state, onChange: setState, options: listOptions }]} />
    </div>
  )
}
