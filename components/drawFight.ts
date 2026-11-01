import { fightFrame, Point, Pose } from '@/lib/fight'

export const FEED_WIDTH = 1280
export const FEED_HEIGHT = 720

const GROUND_Y = 590
const LIME = '#d9f24b'

type Look = { skin: string; shade: string; shorts: string; trim: string; glove: string; hair: string; top?: string }

const RED: Look = { skin: '#c1906a', shade: '#9a6d4b', shorts: '#d62b37', trim: '#f4f4f4', glove: '#e23342', hair: '#17120f' }
const BLUE: Look = { skin: '#b4835c', shade: '#8d6242', shorts: '#2f5fd6', trim: '#f4f4f4', glove: '#3a6bea', hair: '#1c1613' }
const REFEREE: Look = { skin: '#b98a63', shade: '#946b4b', shorts: '#191b20', trim: '#191b20', glove: '#b98a63', hair: '#2a2622', top: '#e9ebef' }

const seeded = (n: number) => {
  const s = Math.sin(n * 91.7 + 17.3) * 24634.6345
  return s - Math.floor(s)
}

function paintPost(ctx: CanvasRenderingContext2D, x: number, base: number, top: number, width: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x - width / 2, top, width, base - top)
  ctx.fillStyle = 'rgb(255 255 255 / .16)'
  ctx.fillRect(x - width / 2, top, width * 0.3, base - top)
}

function paintBackdrop() {
  const canvas = document.createElement('canvas')
  canvas.width = FEED_WIDTH
  canvas.height = FEED_HEIGHT
  const ctx = canvas.getContext('2d')!

  const air = ctx.createLinearGradient(0, 0, 0, 430)
  air.addColorStop(0, '#07090d')
  air.addColorStop(1, '#1b1f29')
  ctx.fillStyle = air
  ctx.fillRect(0, 0, FEED_WIDTH, FEED_HEIGHT)

  // Crowd: rows grow larger and brighter toward the ring.
  for (let row = 0; row < 9; row++) {
    const y = 110 + row * 36
    const size = 6 + row * 1.7
    for (let i = 0; i < 74 - row * 3; i++) {
      const x = (i + seeded(row * 100 + i)) * (FEED_WIDTH / (70 - row * 3))
      const light = 16 + row * 7 + seeded(i + row * 7) * 16
      ctx.fillStyle = `hsl(${20 + seeded(i * 3) * 200} 10% ${light * 0.55}%)`
      ctx.beginPath()
      ctx.ellipse(x, y + size * 2.2, size * 1.25, size * 1.7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `hsl(25 22% ${light * 0.6}%)`
      ctx.beginPath()
      ctx.arc(x, y, size * 0.72, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Overhead lighting rig.
  ctx.fillStyle = '#0a0c10'
  ctx.fillRect(120, 34, 1040, 12)
  ctx.globalCompositeOperation = 'lighter'
  for (const x of [230, 400, 560, 720, 880, 1050]) {
    const cone = ctx.createLinearGradient(0, 40, 0, 480)
    cone.addColorStop(0, 'rgb(255 244 220 / .17)')
    cone.addColorStop(1, 'rgb(255 244 220 / 0)')
    ctx.fillStyle = cone
    ctx.beginPath()
    ctx.moveTo(x - 10, 44)
    ctx.lineTo(x + 10, 44)
    ctx.lineTo(x + 150, 480)
    ctx.lineTo(x - 150, 480)
    ctx.fill()
    const lamp = ctx.createRadialGradient(x, 46, 0, x, 46, 34)
    lamp.addColorStop(0, 'rgb(255 250 235 / 1)')
    lamp.addColorStop(1, 'rgb(255 250 235 / 0)')
    ctx.fillStyle = lamp
    ctx.fillRect(x - 34, 12, 68, 68)
  }
  ctx.globalCompositeOperation = 'source-over'

  // Ring floor in perspective with a pool of light in the middle.
  ctx.beginPath()
  ctx.moveTo(170, 432)
  ctx.lineTo(1110, 432)
  ctx.lineTo(1262, 652)
  ctx.lineTo(18, 652)
  ctx.closePath()
  const mat = ctx.createRadialGradient(640, 540, 40, 640, 540, 640)
  mat.addColorStop(0, '#a9aeb7')
  mat.addColorStop(0.55, '#70757f')
  mat.addColorStop(1, '#3a3e47')
  ctx.fillStyle = mat
  ctx.fill()

  ctx.save()
  ctx.translate(640, 530)
  ctx.scale(1, 0.34)
  ctx.font = '800 130px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgb(255 255 255 / .1)'
  ctx.fillText('LIVESTREAM.', 0, 0)
  ctx.restore()

  paintPost(ctx, 170, 432, 262, 14, '#c92733')
  paintPost(ctx, 1110, 432, 262, 14, '#2c58c9')

  const ropes: [number, string][] = [[0, '#d83a44'], [54, '#e8e9ec'], [108, '#3460d0']]
  for (const [drop, color] of ropes) {
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(170, 282 + drop)
    ctx.quadraticCurveTo(640, 292 + drop, 1110, 282 + drop)
    ctx.moveTo(170, 282 + drop)
    ctx.lineTo(18, 470 + drop)
    ctx.moveTo(1110, 282 + drop)
    ctx.lineTo(1262, 470 + drop)
    ctx.stroke()
  }
  return canvas
}

function paintGrain() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(256, 256)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = Math.random() * 255
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  return canvas
}

function limb(ctx: CanvasRenderingContext2D, a: Point, b: Point, ra: number, rb: number, color: string) {
  const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(a.x + cos * ra, a.y + sin * ra)
  ctx.lineTo(b.x + cos * rb, b.y + sin * rb)
  ctx.lineTo(b.x - cos * rb, b.y - sin * rb)
  ctx.lineTo(a.x - cos * ra, a.y - sin * ra)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(a.x, a.y, ra, 0, Math.PI * 2)
  ctx.arc(b.x, b.y, rb, 0, Math.PI * 2)
  ctx.fill()
}

const along = (a: Point, b: Point, k: number): Point => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k })

function leg(ctx: CanvasRenderingContext2D, p: Pose, knee: Point, foot: Point, facing: number, look: Look, skin: string) {
  limb(ctx, knee, foot, 16, 11, skin)
  limb(ctx, p.hip, knee, 25, 17, skin)
  limb(ctx, p.hip, along(p.hip, knee, 0.62), 29, 25, look.shorts)
  limb(ctx, along(foot, knee, 0.08), along(foot, knee, 0.18), 12, 13, look.top ? look.shorts : '#ecebe6')
  limb(ctx, foot, { x: foot.x + facing * 30, y: foot.y + 4 }, 9, 7, look.top ? '#0e0f12' : skin)
}

function arm(ctx: CanvasRenderingContext2D, shoulder: Point, elbow: Point, hand: Point, look: Look, skin: string) {
  limb(ctx, shoulder, elbow, 14, 12, look.top ?? skin)
  limb(ctx, elbow, hand, 12, 9, skin)
  if (look.top) return
  limb(ctx, along(shoulder, elbow, 0.56), along(shoulder, elbow, 0.68), 15, 14, look.shorts)
  limb(ctx, along(hand, elbow, 0.3), along(hand, elbow, 0.44), 11, 11, '#f1f1f1')
  ctx.fillStyle = look.glove
  ctx.beginPath()
  ctx.arc(hand.x, hand.y, 20, 0, Math.PI * 2)
  ctx.fill()
}

function figure(ctx: CanvasRenderingContext2D, p: Pose, look: Look, facing: number) {
  ctx.fillStyle = 'rgb(0 0 0 / .38)'
  ctx.beginPath()
  ctx.ellipse(p.hip.x, look.top ? -58 : 6, 110, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  arm(ctx, p.shoulderR, p.elbowR, p.handR, look, look.shade)
  leg(ctx, p, p.kneeR, p.footR, facing, look, look.shade)

  const torso = look.top ?? look.skin
  ctx.fillStyle = torso
  ctx.beginPath()
  ctx.moveTo(p.chest.x - 34, p.chest.y - 8)
  ctx.lineTo(p.chest.x + 34, p.chest.y - 8)
  ctx.lineTo(p.hip.x + 27, p.hip.y)
  ctx.lineTo(p.hip.x - 27, p.hip.y)
  ctx.fill()
  // A soft side shadow gives the flat torso some volume under the ring lights.
  ctx.fillStyle = 'rgb(0 0 0 / .14)'
  ctx.beginPath()
  ctx.moveTo(p.chest.x - facing * 34, p.chest.y - 8)
  ctx.lineTo(p.chest.x - facing * 6, p.chest.y - 8)
  ctx.lineTo(p.hip.x - facing * 6, p.hip.y)
  ctx.lineTo(p.hip.x - facing * 27, p.hip.y)
  ctx.fill()

  leg(ctx, p, p.kneeF, p.footF, facing, look, look.skin)
  limb(ctx, { x: p.hip.x - 29, y: p.hip.y - 10 }, { x: p.hip.x + 29, y: p.hip.y - 10 }, 7, 7, look.trim)

  limb(ctx, p.chest, p.neck, 13, 12, look.shade)
  ctx.fillStyle = look.skin
  ctx.beginPath()
  ctx.arc(p.head.x, p.head.y, 27, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = look.hair
  ctx.beginPath()
  ctx.arc(p.head.x, p.head.y, 28, Math.PI * 0.98, Math.PI * 2.02)
  ctx.lineTo(p.head.x - facing * 18, p.head.y - 8)
  ctx.fill()

  arm(ctx, p.shoulderF, p.elbowF, p.handF, look, look.skin)
}

function skeleton(ctx: CanvasRenderingContext2D, p: Pose) {
  const chains = [
    [p.head, p.neck, p.chest, p.hip],
    [p.neck, p.shoulderF, p.elbowF, p.handF],
    [p.neck, p.shoulderR, p.elbowR, p.handR],
    [p.hip, p.kneeF, p.footF],
    [p.hip, p.kneeR, p.footR],
  ]
  ctx.strokeStyle = LIME
  ctx.lineWidth = 3.5
  ctx.lineJoin = 'round'
  for (const chain of chains) {
    ctx.beginPath()
    chain.forEach((j, i) => (i ? ctx.lineTo(j.x, j.y) : ctx.moveTo(j.x, j.y)))
    ctx.stroke()
  }
  ctx.fillStyle = LIME
  for (const j of Object.values(p)) {
    ctx.beginPath()
    ctx.arc(j.x, j.y, 5.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

let backdrop: HTMLCanvasElement | undefined
let grain: HTMLCanvasElement | undefined

export function drawFight(ctx: CanvasRenderingContext2D, t: number, showSkeleton: boolean) {
  backdrop ??= paintBackdrop()
  grain ??= paintGrain()
  const frame = fightFrame(t)

  // Broadcast camera: holds a shot, cuts tighter, and drifts as if handheld.
  const shot = Math.floor(t / 9) % 3
  const zoom = [1.05, 1.34, 1.18][shot] + Math.sin(t * 0.17) * 0.012
  const hit = frame.impact?.strength ?? 0
  const shakeX = Math.sin(t * 1.7) * 3 + Math.sin(t * 23) * 3 * hit
  const shakeY = Math.sin(t * 2.3) * 2 + Math.cos(t * 29) * 3 * hit
  const pan = frame.centerX * (shot === 0 ? 0.35 : 0.8)
  const focusY = [FEED_HEIGHT / 2, 372, 380][shot]

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#07090d'
  ctx.fillRect(0, 0, FEED_WIDTH, FEED_HEIGHT)
  ctx.translate(FEED_WIDTH / 2, FEED_HEIGHT / 2)
  ctx.scale(zoom, zoom)
  ctx.translate(-FEED_WIDTH / 2 - pan + shakeX, -focusY + shakeY)
  ctx.drawImage(backdrop, 0, 0)

  // Press flashes in the crowd.
  const tick = Math.floor(t * 8)
  ctx.fillStyle = 'rgb(255 255 255 / .9)'
  for (let i = 0; i < 40; i++) {
    if (seeded(tick * 13 + i) > 0.985) ctx.fillRect(seeded(i * 5) * FEED_WIDTH, 120 + seeded(i * 9) * 200, 3, 3)
  }

  ctx.save()
  ctx.translate(FEED_WIDTH / 2, GROUND_Y)
  figure(ctx, frame.referee, REFEREE, 1)
  figure(ctx, frame.blue, BLUE, -1)
  figure(ctx, frame.red, RED, 1)
  if (showSkeleton) {
    skeleton(ctx, frame.red)
    skeleton(ctx, frame.blue)
  }
  if (frame.impact) {
    const { at, strength } = frame.impact
    ctx.globalCompositeOperation = 'lighter'
    const burst = ctx.createRadialGradient(at.x, at.y, 0, at.x, at.y, 70)
    burst.addColorStop(0, `rgb(255 245 215 / ${0.75 * strength})`)
    burst.addColorStop(1, 'rgb(255 245 215 / 0)')
    ctx.fillStyle = burst
    ctx.fillRect(at.x - 70, at.y - 70, 140, 140)
    ctx.globalCompositeOperation = 'source-over'
  }
  ctx.restore()

  // Front ropes, posts, and apron pass in front of the fighters.
  const ropes: [number, string][] = [[0, '#d83a44'], [62, '#e8e9ec'], [124, '#3460d0']]
  for (const [drop, color] of ropes) {
    ctx.strokeStyle = color
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.moveTo(18, 462 + drop)
    ctx.quadraticCurveTo(640, 476 + drop, 1262, 462 + drop)
    ctx.stroke()
  }
  paintPost(ctx, 18, 660, 440, 26, '#c92733')
  paintPost(ctx, 1262, 660, 440, 26, '#2c58c9')
  ctx.fillStyle = '#0c0e13'
  ctx.fillRect(-200, 652, FEED_WIDTH + 400, 300)
  ctx.font = '800 34px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgb(217 242 75 / .85)'
  // Kept to the sides because the score bar sits over the centre of the apron.
  ctx.fillText('LIVESTREAM.', 230, 696)
  ctx.fillText('LIVESTREAM.', 1050, 696)

  // Lens: darker corners and a live sensor grain.
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  const vignette = ctx.createRadialGradient(640, 360, 280, 640, 360, 800)
  vignette.addColorStop(0, 'rgb(0 0 0 / 0)')
  vignette.addColorStop(1, 'rgb(0 0 0 / .62)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, FEED_WIDTH, FEED_HEIGHT)

  ctx.globalAlpha = 0.045
  const offsetX = Math.floor(seeded(tick) * 256)
  const offsetY = Math.floor(seeded(tick + 3) * 256)
  for (let x = -offsetX; x < FEED_WIDTH; x += 256) {
    for (let y = -offsetY; y < FEED_HEIGHT; y += 256) ctx.drawImage(grain, x, y)
  }
  ctx.globalAlpha = 1
}
