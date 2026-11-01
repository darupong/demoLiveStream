import { rounds } from './mock'

export const ROUND_SECONDS = 180
export const LIVE_ROUND = 3

// Both the live bar and the Live page read the same wall clock, so their timers match.
export function roundSeconds(eventId: string, now = Date.now()) {
  const offset = [...eventId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return (Math.floor(now / 1000) + offset) % ROUND_SECONDS
}

export const formatClock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export const liveScore = () => ({
  red: rounds.reduce((sum, r) => sum + r.red, 0),
  blue: rounds.reduce((sum, r) => sum + r.blue, 0),
})
