'use client'

import { useEffect, useRef } from 'react'
import { drawFight, FEED_HEIGHT, FEED_WIDTH } from './drawFight'

const FRAME_MS = 1000 / 30

// Mock live video. `delay` rewinds the same timeline, which is how the AI view stays 30 seconds behind.
// `start` sets the timeline position; VOD remounts with a new `start` to seek.
export function FightFeed({ playing, delay, skeleton, start = 600 }: { playing: boolean; delay: number; skeleton: boolean; start?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const clock = useRef(start)

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    drawFight(ctx, clock.current - delay, skeleton)
    if (!playing) return

    let raf = 0
    let last = performance.now()
    let drawn = last
    const tick = (now: number) => {
      // Cap the step so a background tab pauses the feed instead of jumping.
      clock.current += Math.min(0.1, (now - last) / 1000)
      last = now
      if (now - drawn >= FRAME_MS) {
        drawn = now
        drawFight(ctx, clock.current - delay, skeleton)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, delay, skeleton])

  return <canvas ref={canvas} width={FEED_WIDTH} height={FEED_HEIGHT} role="img" aria-label="ภาพถ่ายทอดสดจำลอง" />
}
