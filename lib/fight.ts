// Scripted fight used as the mock live feed. Every pose is a pure function of
// time, so the delayed AI view and its skeleton line up exactly with the video.

export type Point = { x: number; y: number }

export type Pose = {
  head: Point
  neck: Point
  chest: Point
  hip: Point
  shoulderF: Point
  elbowF: Point
  handF: Point
  shoulderR: Point
  elbowR: Point
  handR: Point
  kneeF: Point
  footF: Point
  kneeR: Point
  footR: Point
}

export type FightFrame = {
  red: Pose
  blue: Pose
  referee: Pose
  centerX: number
  impact: { at: Point; strength: number } | null
}

type Action = 'idle' | 'jab' | 'cross' | 'kick' | 'teep' | 'knee'

const SLOT_SECONDS = 1.4
const ACTIONS: Action[] = ['jab', 'cross', 'kick', 'idle', 'teep', 'jab', 'knee', 'cross', 'idle', 'kick']
const ADVANCE: Record<Action, number> = { idle: 0, jab: 65, cross: 80, kick: 45, teep: 35, knee: 105 }
const IMPACT_AT = 0.37

const UPPER_ARM = 62
const FOREARM = 62
const THIGH = 88
const SHIN = 88

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const mix = (a: Point, b: Point, k: number): Point => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k })

// Two-bone inverse kinematics: returns the mid joint and the reachable end point.
function solve(root: Point, target: Point, first: number, second: number, bend: number) {
  const dx = target.x - root.x
  const dy = target.y - root.y
  const dist = clamp(Math.hypot(dx, dy) || 1, Math.abs(first - second) + 1, first + second - 1)
  const scale = Math.hypot(dx, dy) || 1
  const ux = dx / scale
  const uy = dy / scale
  const along = (first * first - second * second + dist * dist) / (2 * dist)
  const height = Math.sqrt(Math.max(0, first * first - along * along))
  return {
    mid: { x: root.x + ux * along - bend * uy * height, y: root.y + uy * along + bend * ux * height },
    end: { x: root.x + ux * dist, y: root.y + uy * dist },
  }
}

function buildPose(t: number, seed: number, action: Action | 'referee', env: number, recoil: number, originX: number, facing: 1 | -1, advance: number): Pose {
  const referee = action === 'referee'
  const beat = Math.sin(t * 5 + seed)
  const lean =
    (referee ? 0.02 : 0.08) -
    0.24 * recoil +
    env * ({ jab: 0.14, cross: 0.2, kick: -0.36, teep: -0.26, knee: 0.1, idle: 0, referee: 0 })[action]

  const hip = { x: advance - 26 * recoil, y: -172 + beat * (referee ? 1 : 5) - (action === 'kick' ? 12 * env : 0) }
  const up = { x: Math.sin(lean), y: -Math.cos(lean) }
  const chest = { x: hip.x + up.x * 125, y: hip.y + up.y * 125 }
  const neck = { x: chest.x + up.x * 16, y: chest.y + up.y * 16 }
  const head = { x: neck.x + up.x * 32 + 4, y: neck.y + up.y * 32 }

  const twist = action === 'cross' ? env : action === 'kick' ? env * 0.6 : 0
  const shoulderF = { x: chest.x + 16 - 16 * twist, y: chest.y + 4 }
  const shoulderR = { x: chest.x - 16 + 34 * twist, y: chest.y + 4 }

  const sway = Math.sin(t * 2.6 + seed * 2) * 6
  const guardF = referee ? { x: hip.x + 22, y: hip.y + 22 } : { x: chest.x + 68 + sway, y: chest.y - 12 }
  const guardR = referee ? { x: hip.x - 18, y: hip.y + 26 } : { x: chest.x + 44 - sway, y: chest.y + 6 }

  let handF = guardF
  let handR = guardR
  if (action === 'jab') handF = mix(guardF, { x: shoulderF.x + 150, y: shoulderF.y - 14 }, env)
  if (action === 'cross') handR = mix(guardR, { x: shoulderR.x + 150, y: shoulderR.y - 12 }, env)
  if (action === 'kick') handR = mix(guardR, { x: chest.x - 66, y: chest.y + 46 }, env)
  if (action === 'teep') handF = mix(guardF, { x: chest.x + 46, y: chest.y + 40 }, env)
  if (action === 'knee') {
    handF = mix(guardF, { x: chest.x + 112, y: chest.y - 26 }, env)
    handR = mix(guardR, { x: chest.x + 104, y: chest.y - 12 }, env)
  }

  const stance = referee ? 34 : 60
  const stepF = Math.max(0, beat) * (referee ? 0 : 10)
  const stepR = Math.max(0, -beat) * (referee ? 0 : 10)
  let footF: Point = { x: hip.x + stance, y: -stepF }
  let footR: Point = { x: hip.x - stance - 4, y: -stepR }
  if (action === 'kick') footR = mix(footR, { x: hip.x + 150, y: hip.y + 34 }, env)
  if (action === 'teep') footF = mix(footF, { x: hip.x + 168, y: hip.y + 72 }, env)
  if (action === 'knee') footR = mix(footR, { x: hip.x + 54, y: hip.y + 104 }, env)

  const armF = solve(shoulderF, handF, UPPER_ARM, FOREARM, 1)
  const armR = solve(shoulderR, handR, UPPER_ARM, FOREARM, 1)
  const legF = solve(hip, footF, THIGH, SHIN, -1)
  const legR = solve(hip, footR, THIGH, SHIN, -1)

  const world = (p: Point): Point => ({ x: originX + facing * p.x, y: p.y })
  return {
    head: world(head),
    neck: world(neck),
    chest: world(chest),
    hip: world(hip),
    shoulderF: world(shoulderF),
    elbowF: world(armF.mid),
    handF: world(armF.end),
    shoulderR: world(shoulderR),
    elbowR: world(armR.mid),
    handR: world(armR.end),
    kneeF: world(legF.mid),
    footF: world(legF.end),
    kneeR: world(legR.mid),
    footR: world(legR.end),
  }
}

export function fightFrame(t: number): FightFrame {
  const slot = Math.floor(t / SLOT_SECONDS)
  const action = ACTIONS[Math.floor(hash(slot) * ACTIONS.length)]
  const attackerIsRed = hash(slot + 0.5) < 0.55
  const landed = action !== 'idle' && hash(slot + 0.25) < 0.6

  const q = clamp((t / SLOT_SECONDS - slot - 0.08) / 0.8, 0, 1)
  const env = action === 'idle' ? 0 : Math.sin(Math.PI * q ** 0.7) ** 2
  const recoil = landed && q > IMPACT_AT ? Math.sin((Math.PI * (q - IMPACT_AT)) / (1 - IMPACT_AT)) ** 2 : 0

  const gap = 235 + 22 * Math.sin(t * 0.7)
  const centerX = 55 * Math.sin(t * 0.23) + 28 * Math.sin(t * 0.61 + 1)
  const reach = ADVANCE[action] * env

  const red = buildPose(t, 0, attackerIsRed ? action : 'idle', attackerIsRed ? env : 0, attackerIsRed ? 0 : recoil, centerX - gap / 2, 1, attackerIsRed ? reach : 0)
  const blue = buildPose(t, 1.7, attackerIsRed ? 'idle' : action, attackerIsRed ? 0 : env, attackerIsRed ? recoil : 0, centerX + gap / 2, -1, attackerIsRed ? 0 : reach)

  // The referee circles wide so they rarely stand behind a fighter.
  const refereeX = centerX * 0.5 + 340 * Math.sin(t * 0.19)
  const far = buildPose(t, 3.1, 'referee', 0, 0, refereeX, 1, 0)
  const referee = Object.fromEntries(
    Object.entries(far).map(([joint, p]) => [joint, { x: p.x * 0.84, y: p.y * 0.84 - 58 }]),
  ) as Pose

  const defender = attackerIsRed ? blue : red
  const hitsHead = action === 'jab' || action === 'cross'
  const strength = landed ? clamp(1 - Math.abs(q - IMPACT_AT) / 0.07, 0, 1) : 0
  return {
    red,
    blue,
    referee,
    centerX,
    impact: strength > 0 ? { at: hitsHead ? defender.head : defender.chest, strength } : null,
  }
}
