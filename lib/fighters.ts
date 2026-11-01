// All fighter data is fictional. Every bout lives in one shared list, so a fighter's
// page always agrees with their opponent's page. Numbers are seeded, so they never
// change between renders.
import { crowdNames, events, gifts, products, vodQueue } from './mock.ts'
import type { FightEvent, Gift } from './mock.ts'

export const COUNTRIES = { TH: 'ไทย', JP: 'ญี่ปุ่น', FR: 'ฝรั่งเศส', NL: 'เนเธอร์แลนด์', MM: 'เมียนมา', GB: 'สหราชอาณาจักร' }
export type CountryCode = keyof typeof COUNTRIES

// Everyone else on the roster is Thai.
const FOREIGN_FIGHTERS: Record<string, CountryCode> = {
  lekkai: 'JP',
  daabthong: 'JP',
  singthong: 'FR',
  phetdam: 'FR',
  prabtong: 'NL',
  kraisorn: 'NL',
  mekkhala: 'MM',
  sonkhla: 'MM',
}

export type Camp = { id: string; name: string; color: string; province: string; founded: number; headTrainer: string; about: string }

export const camps: Camp[] = [
  { id: 'singha-lanna', name: 'ค่ายสิงห์ล้านนา', color: '#b23a2e', province: 'เชียงใหม่', founded: 2538, headTrainer: 'ครูสมศักดิ์', about: 'เน้นเตะและคุมระยะ ฝึกนักมวยรุ่นเล็กจนขึ้นเวทีใหญ่' },
  { id: 'phet-isan', name: 'ค่ายเพชรอีสาน', color: '#2f6db0', province: 'นครราชสีมา', founded: 2529, headTrainer: 'ครูบุญมี', about: 'ค่ายเก่าแก่ที่ขึ้นชื่อเรื่องความอึดและการเดินหน้า' },
  { id: 'krung-thon', name: 'ค่ายกรุงธน', color: '#7a4fb5', province: 'กรุงเทพมหานคร', founded: 2547, headTrainer: 'ครูวิชัย', about: 'ใช้ข้อมูลวิดีโอและคะแนนวิเคราะห์ช่วยวางแผนการชก' },
  { id: 'payak-thaksin', name: 'ค่ายพยัคฆ์ทักษิณ', color: '#c17a1d', province: 'สงขลา', founded: 2541, headTrainer: 'ครูอารีย์', about: 'เด่นเรื่องเข่าและวงใน ปั้นนักมวยสายบู๊จากภาคใต้' },
  { id: 'burapha-chon', name: 'ค่ายบูรพาชล', color: '#1f8f8a', province: 'ชลบุรี', founded: 2552, headTrainer: 'ครูประสิทธิ์', about: 'ค่ายรุ่นใหม่ริมทะเล ฝึกนักมวยต่างชาติควบคู่นักมวยไทย' },
  { id: 'ruamjai-siam', name: 'ค่ายรวมใจสยาม', color: '#5a7d1f', province: 'สุพรรณบุรี', founded: 2535, headTrainer: 'ครูมานพ', about: 'เน้นมวยฝีมือ แม่นจังหวะ และวินัยการซ้อม' },
]

export const STRIKES = [
  { key: 'punch', label: 'หมัด', style: 'มวยหมัด' },
  { key: 'kick', label: 'เตะ', style: 'มวยเตะ' },
  { key: 'knee', label: 'เข่า', style: 'มวยเข่า' },
  { key: 'elbow', label: 'ศอก', style: 'มวยศอก' },
] as const

export type StrikeKey = (typeof STRIKES)[number]['key']
export type Method = 'น็อก' | 'เทคนิค' | 'คะแนน' | 'เสมอ'
export type Result = 'ชนะ' | 'แพ้' | 'เสมอ'

export type Bout = {
  id: string
  at: number
  date: string
  venue: string
  division: string
  rounds: number
  redId: string
  blueId: string
  winnerId: string | null
  method: Method
  endRound: number
  eventId?: string
  hasVod: boolean
}

export type Fighter = {
  id: string
  name: string
  countryCode: CountryCode
  country: string
  campId: string
  camp: string
  division: string
  age: number
  heightCm: number
  reachCm: number
  stance: string
  style: string
  wins: number
  losses: number
  draws: number
  knockouts: number
  bio: string
}

export type Fight = {
  bout: Bout
  opponent: Fighter
  result: Result
  aiScore: number
  strikes: Record<StrikeKey, number>
}

const DIVISIONS = ['รุ่นฟลายเวต', 'รุ่นแบนตัมเวต', 'รุ่นเฟเธอร์เวต', 'รุ่นไลท์เวต', 'รุ่นเวลเตอร์เวต']
const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const VENUES = ['สนามมวยเวทีกลาง', 'สนามมวยริมน้ำ']
const FIRST_BOUT = Date.UTC(2026, 8, 26)
const TWO_WEEKS = 14 * 86_400_000
const SCHEDULED_ROUNDS = 14

function hash(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100_000) / 100_000
}

export const between = (key: string, lo: number, hi: number) => lo + Math.floor(hash(key) * (hi - lo + 1))
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0)
const round1 = (v: number) => Math.round(v * 10) / 10
const thaiDate = (at: number) => {
  const d = new Date(at)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`
}

const roster = events.flatMap((e) => {
  const [redId, blueId] = e.id.split('-')
  return [
    { id: redId, name: e.red, division: e.division },
    { id: blueId, name: e.blue, division: e.division },
  ]
})

const nameOf = (id: string) => roster.find((f) => f.id === id)!.name
const strength = (id: string) => hash(`${id}:skill`)
const styleIndex = (id: string) => between(`${id}:style`, 0, STRIKES.length - 1)

function decide(key: string, redId: string, blueId: string, rounds: number) {
  if (hash(`${key}:draw`) < 0.05) return { winnerId: null, method: 'เสมอ' as Method, endRound: rounds }
  const redChance = 0.5 + (strength(redId) - strength(blueId)) * 0.5
  const winnerId = hash(`${key}:win`) < redChance ? redId : blueId
  const roll = hash(`${key}:method`)
  if (roll < 0.3) return { winnerId, method: 'น็อก' as Method, endRound: between(`${key}:round`, 1, rounds) }
  if (roll < 0.42) return { winnerId, method: 'เทคนิค' as Method, endRound: between(`${key}:round`, 2, rounds) }
  return { winnerId, method: 'คะแนน' as Method, endRound: rounds }
}

function parseEventDate(text: string) {
  const [, day, month] = text.match(/(\d+) (\S+\.)/)!
  return Date.UTC(2026, MONTHS.indexOf(month), Number(day))
}

const eventBouts: Bout[] = events
  .filter((e) => e.status === 'ended' || e.status === 'vod')
  .map((e) => {
    const [redId, blueId] = e.id.split('-')
    const at = parseEventDate(e.date)
    return {
      id: e.id,
      at,
      date: thaiDate(at),
      venue: e.venue,
      division: e.division,
      rounds: e.rounds,
      redId,
      blueId,
      eventId: e.id,
      hasVod: vodQueue.some((v) => v.eventId === e.id && v.status === 'published'),
      ...decide(e.id, redId, blueId, e.rounds),
    }
  })

// Each card pairs fighters who sit next to each other by weight, so nobody meets a far heavier opponent.
const pastBouts: Bout[] = Array.from({ length: SCHEDULED_ROUNDS }, (_, week) => {
  const order = [...roster].sort(
    (a, b) => DIVISIONS.indexOf(a.division) * 10 + hash(`${a.id}:${week}`) * 14 - (DIVISIONS.indexOf(b.division) * 10 + hash(`${b.id}:${week}`) * 14),
  )
  const at = FIRST_BOUT - week * TWO_WEEKS
  return order.flatMap((red, i) => {
    if (i % 2) return []
    const blue = order[i + 1]
    const id = `b${week}-${i / 2}`
    const rounds = 5
    return [{
      id,
      at,
      date: thaiDate(at),
      venue: VENUES[between(`${id}:venue`, 0, 1)],
      division: red.division,
      rounds,
      redId: red.id,
      blueId: blue.id,
      hasVod: hash(`${id}:vod`) < 0.7,
      ...decide(id, red.id, blue.id, rounds),
    }]
  })
}).flat()

export const bouts: Bout[] = [...eventBouts, ...pastBouts].sort((a, b) => b.at - a.at)

const boutsOf = (id: string) => bouts.filter((b) => b.redId === id || b.blueId === id)
const resultFor = (b: Bout, id: string): Result => (b.winnerId === null ? 'เสมอ' : b.winnerId === id ? 'ชนะ' : 'แพ้')

export const fighters: Fighter[] = roster.map((f, i) => {
  const camp = camps[i % camps.length]
  const style = STRIKES[styleIndex(f.id)].style
  const recent = boutsOf(f.id)
  const count = (r: Result) => recent.filter((b) => resultFor(b, f.id) === r).length
  const earlierWins = between(`${f.id}:wins`, 18, 46)
  const recentKnockouts = recent.filter((b) => b.winnerId === f.id && b.method === 'น็อก').length
  const countryCode = FOREIGN_FIGHTERS[f.id] ?? 'TH'
  return {
    id: f.id,
    name: f.name,
    countryCode,
    country: COUNTRIES[countryCode],
    campId: camp.id,
    camp: camp.name,
    division: f.division,
    age: between(`${f.id}:age`, 20, 30),
    heightCm: between(`${f.id}:height`, 164, 179),
    reachCm: between(`${f.id}:reach`, 168, 186),
    stance: hash(`${f.id}:stance`) < 0.3 ? 'ซ้ายนำ (Southpaw)' : 'ขวานำ (Orthodox)',
    style,
    wins: earlierWins + count('ชนะ'),
    losses: between(`${f.id}:losses`, 2, 9) + count('แพ้'),
    draws: between(`${f.id}:draws`, 0, 3) + count('เสมอ'),
    knockouts: Math.floor(earlierWins * (0.2 + hash(`${f.id}:ko`) * 0.3)) + recentKnockouts,
    bio: `${f.name} เป็นนักมวยสาย${style}จาก${camp.name} ลงแข่ง${f.division} จุดเด่นคือการคุมจังหวะและเดินหน้ากดดันคู่ต่อสู้`,
  }
})

export const findFighter = (id: string) => fighters.find((f) => f.id === id)
export const fighterByName = (name: string) => fighters.find((f) => f.name === name)
export const eventsOfFighter = (name: string) => events.filter((e) => e.red === name || e.blue === name)
export const campOf = (fighter: Fighter) => camps.find((c) => c.id === fighter.campId)!
export const teammatesOf = (fighter: Fighter) => fighters.filter((f) => f.campId === fighter.campId && f.id !== fighter.id)
export const productsOf = (fighter: Fighter) => products.filter((p) => p.name.includes(fighter.name))

export function fightsOf(id: string): Fight[] {
  const weights = (key: StrikeKey, i: number) => (i === styleIndex(id) ? 1.5 : 1) * { punch: 30, kick: 22, knee: 14, elbow: 8 }[key]
  return boutsOf(id).map((bout) => {
    const result = resultFor(bout, id)
    const swing = result === 'ชนะ' ? 7 : result === 'แพ้' ? -7 : 0
    const key = `${bout.id}:${id}`
    return {
      bout,
      opponent: findFighter(bout.redId === id ? bout.blueId : bout.redId)!,
      result,
      aiScore: Math.round(clamp(60 + strength(id) * 20 + swing + (hash(`${key}:ai`) - 0.5) * 14, 40, 99)),
      strikes: Object.fromEntries(
        STRIKES.map((s, i) => [s.key, Math.round(weights(s.key, i) * (0.75 + hash(`${key}:${s.key}`) * 0.5) * (bout.endRound / 5 + 0.4))]),
      ) as Record<StrikeKey, number>,
    }
  })
}

function averageStrikes(fights: Fight[]) {
  return Object.fromEntries(STRIKES.map((s) => [s.key, Math.round(mean(fights.map((f) => f.strikes[s.key])))])) as Record<StrikeKey, number>
}

const averageScore = (fights: Fight[]) => round1(mean(fights.map((f) => f.aiScore)))

function roundScores(id: string) {
  const peak = between(`${id}:peak`, 1, 5)
  return [1, 2, 3, 4, 5].map((round) => ({
    round,
    score: round1(clamp(9.4 - Math.abs(round - peak) * 0.28 + (hash(`${id}:r${round}`) - 0.5) * 0.5 + strength(id) * 0.4, 7, 10)),
  }))
}

function currentStreak(fights: Fight[]) {
  const first = fights[0]?.result
  const length = fights.findIndex((f) => f.result !== first)
  return { result: first, length: length === -1 ? fights.length : length }
}

export function divisionRanking(division: string) {
  return fighters
    .filter((f) => f.division === division)
    .map((f) => {
      const fights = fightsOf(f.id)
      return { fighter: f, wins: fights.filter((x) => x.result === 'ชนะ').length, score: averageScore(fights) }
    })
    .sort((a, b) => b.wins - a.wins || b.score - a.score)
}

export function analyticsOf(fighter: Fighter) {
  const fights = fightsOf(fighter.id)
  const ranking = divisionRanking(fighter.division)
  const peers = ranking.flatMap((r) => fightsOf(r.fighter.id))
  const wonBy = (m: Method) => fights.filter((f) => f.result === 'ชนะ' && f.bout.winnerId === fighter.id && f.bout.method === m).length
  const totalFights = fighter.wins + fighter.losses + fighter.draws
  return {
    fights,
    trend: [...fights].reverse().map((f) => ({ date: f.bout.date, opponent: f.opponent.name, result: f.result, score: f.aiScore })),
    averageScore: averageScore(fights),
    divisionScore: averageScore(peers),
    methods: [
      { label: 'ชนะน็อก', value: wonBy('น็อก') },
      { label: 'ชนะคะแนน', value: wonBy('คะแนน') },
      { label: 'ชนะเทคนิค', value: wonBy('เทคนิค') },
    ],
    strikes: averageStrikes(fights),
    divisionStrikes: averageStrikes(peers),
    rounds: roundScores(fighter.id),
    totalFights,
    winRate: Math.round((fighter.wins / totalFights) * 100),
    knockoutRate: Math.round((fighter.knockouts / fighter.wins) * 100),
    rank: ranking.findIndex((r) => r.fighter.id === fighter.id) + 1,
    rankedFighters: ranking.length,
    streak: currentStreak(fights),
    form: fights.slice(0, 5).map((f) => f.result),
  }
}

export function opponentsOf(id: string) {
  const met = new Map<string, Fight[]>()
  for (const fight of fightsOf(id)) met.set(fight.opponent.id, [...(met.get(fight.opponent.id) ?? []), fight])
  return [...met.values()]
    .map((list) => ({
      opponent: list[0].opponent,
      wins: list.filter((f) => f.result === 'ชนะ').length,
      losses: list.filter((f) => f.result === 'แพ้').length,
      draws: list.filter((f) => f.result === 'เสมอ').length,
      last: list[0],
    }))
    .sort((a, b) => b.wins + b.losses + b.draws - (a.wins + a.losses + a.draws) || b.last.bout.at - a.last.bout.at)
}

export function nextFightOf(fighter: Fighter) {
  const event = events.find((e) => (e.status === 'live' || e.status === 'upcoming') && (e.red === fighter.name || e.blue === fighter.name))
  if (!event) return null
  const opponent = fighterByName(event.red === fighter.name ? event.blue : event.red)!
  return { event, opponent, record: opponentsOf(fighter.id).find((o) => o.opponent.id === opponent.id) ?? null }
}

export function titlesOf(fighter: Fighter) {
  const { rank } = analyticsOf(fighter)
  const titles = [{ year: 2568, title: `นักมวยดาวรุ่ง ${fighter.division}` }]
  if (rank <= 2) titles.unshift({ year: 2569, title: `รองแชมป์${fighter.division} ${VENUES[0]}` })
  if (rank === 1) titles.unshift({ year: 2569, title: `แชมป์${fighter.division} ${VENUES[0]}` })
  return titles
}

// Picks a stable look for the drawn portrait. Real photos would replace this.
const SKIN_TONES = [['#c99a72', '#a8794f'], ['#b98a5f', '#946b4b'], ['#a97a50', '#845c3b'], ['#d4a981', '#b38560'], ['#94673f', '#70492b']]
const HAIR_COLORS = ['#17120f', '#2a1d14', '#3a2a1c']

export function portraitOf(fighter: Fighter) {
  const [skin, shade] = SKIN_TONES[between(`${fighter.id}:skin`, 0, SKIN_TONES.length - 1)]
  return {
    skin,
    shade,
    hair: HAIR_COLORS[between(`${fighter.id}:haircolor`, 0, HAIR_COLORS.length - 1)],
    hairStyle: between(`${fighter.id}:hair`, 0, 3),
    brow: between(`${fighter.id}:brow`, 0, 2),
    camp: campOf(fighter).color,
  }
}

const GIFT_COUNT_CEILING = [900, 520, 140, 34, 4]

// Base numbers viewers gave before this session; the profile adds this browser's ledger on top.
export function giftsOf(fighter: Fighter) {
  const scale = 0.4 + strength(fighter.id) * 0.8
  const items = gifts.map((gift: Gift, i) => ({ gift, count: Math.round(between(`${fighter.id}:${gift.id}`, GIFT_COUNT_CEILING[i] / 3, GIFT_COUNT_CEILING[i]) * scale) }))
  const fans = crowdNames
    .map((name) => ({ name, credit: Math.round(between(`${fighter.id}:${name}`, 400, 6200) / 10) * 10 }))
    .sort((a, b) => b.credit - a.credit)
    .slice(0, 3)
  return { items, fans }
}

export const vodHref = (bout: Bout) => `/vod/${bout.eventId ?? bout.id}`

// Older bouts have no event record, so the VOD page builds one from the bout. Unpublished bouts return nothing.
export function archivedEvent(id: string): FightEvent | undefined {
  const bout = bouts.find((b) => b.id === id && b.hasVod && !b.eventId)
  if (!bout) return undefined
  return {
    id: bout.id,
    red: nameOf(bout.redId),
    blue: nameOf(bout.blueId),
    division: bout.division,
    rounds: bout.rounds,
    status: 'vod',
    date: bout.date,
    venue: bout.venue,
    price: 79,
  }
}
