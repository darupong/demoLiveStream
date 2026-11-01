// Run with `npm run check`. Guards the scripted fight used as the mock live feed.
import assert from 'node:assert/strict'
import { fightFrame } from '../lib/fight.ts'

const STEP = 0.01
const MAX_JOINT_JUMP = 40
const joints = (frame) => [...Object.values(frame.red), ...Object.values(frame.blue), ...Object.values(frame.referee)]

assert.deepEqual(fightFrame(612.34), fightFrame(612.34), 'same time must give the same frame, or the AI delay drifts')

let impacts = 0
let previous = fightFrame(600)
for (let t = 600; t < 900; t += STEP) {
  const frame = fightFrame(t)
  for (const p of joints(frame)) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `bad joint at t=${t}`)
  assert.ok(frame.red.hip.x < frame.blue.hip.x, `fighters crossed at t=${t}`)

  const before = joints(previous)
  joints(frame).forEach((p, i) => {
    const jump = Math.hypot(p.x - before[i].x, p.y - before[i].y)
    assert.ok(jump < MAX_JOINT_JUMP, `joint ${i} jumped ${jump.toFixed(1)}px at t=${t.toFixed(2)}`)
  })

  if (frame.impact && !previous.impact) impacts++
  previous = frame
}

assert.ok(impacts > 20, `expected a busy fight, got ${impacts} impacts in 5 minutes`)
console.log(`ok: 5 minutes of fight, ${impacts} impacts, motion stays continuous`)
