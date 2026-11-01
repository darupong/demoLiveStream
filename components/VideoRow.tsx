'use client'

import Link from 'next/link'
import { ReactNode, useRef } from 'react'

const PAGE_SHARE = 0.85

export function VideoRow({ title, href, children }: { title: string; href?: string; children: ReactNode }) {
  const list = useRef<HTMLDivElement>(null)
  const slide = (direction: 1 | -1) => list.current?.scrollBy({ left: direction * list.current.clientWidth * PAGE_SHARE, behavior: 'smooth' })
  return (
    <section className="video-row" aria-label={title}>
      <div className="video-row-head">
        <h2>{title}</h2>
        {href && <Link href={href}>ดูทั้งหมด</Link>}
      </div>
      <div className="video-row-body">
        <button className="row-arrow is-left" aria-label={`เลื่อน${title}ไปทางซ้าย`} onClick={() => slide(-1)}>‹</button>
        <div className="video-row-list" ref={list}>{children}</div>
        <button className="row-arrow is-right" aria-label={`เลื่อน${title}ไปทางขวา`} onClick={() => slide(1)}>›</button>
      </div>
    </section>
  )
}

export function VideoTile({ href, poster, title, meta, badge, length, progress }: {
  href: string
  poster: ReactNode
  title: string
  meta: string
  badge?: ReactNode
  length?: string
  progress?: number
}) {
  return (
    <Link className="tile" href={href}>
      <div className="tile-art">
        {poster}
        {badge && <span className="tile-badge">{badge}</span>}
        {length && <span className="tile-length">{length}</span>}
        {progress !== undefined && <span className="tile-progress"><i style={{ width: `${progress}%` }} /></span>}
      </div>
      <b>{title}</b>
      <small className="muted">{meta}</small>
    </Link>
  )
}
