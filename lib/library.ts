// Fictional on-demand catalogue for the home page. Fight clips come from the shared
// bout list, so a highlight never disagrees with a fighter's record.
import { between, bouts, camps, fighters, findFighter, vodHref } from './fighters.ts'
import type { Bout, Camp, Fighter } from './fighters.ts'
import { crowdNames } from './mock.ts'

export type VideoKind = 'interview' | 'documentary' | 'technique'

export type Video = {
  id: string
  kind: VideoKind
  title: string
  description: string
  length: string
  views: number
  fighterId?: string
  campId?: string
  icon?: string
}

export type Highlight = { bout: Bout; winner: Fighter; loser: Fighter; title: string; length: string; views: number; href: string }

export const KIND_LABEL: Record<VideoKind, string> = { interview: 'สัมภาษณ์', documentary: 'สารคดี', technique: 'สอนเทคนิค' }

const INTERVIEW_TITLES = [
  (n: string) => `สัมภาษณ์หลังไฟต์ ${n}`,
  (n: string) => `${n} เปิดใจก่อนขึ้นเวที`,
  (n: string) => `หนึ่งวันกับ ${n}`,
  (n: string) => `${n} ตอบทุกคำถามจากแฟนมวย`,
]

const TECHNIQUES = [
  { icon: '🦵', title: 'เตะเฉียงให้คมและไม่เสียหลัก' },
  { icon: '🥊', title: 'หมัดตรงนำเข้าวงใน' },
  { icon: '💥', title: 'ศอกกลับในจังหวะคู่ชกพลาด' },
  { icon: '🤼', title: 'จับคอและเข่าโค้ง' },
  { icon: '🛡️', title: 'ถีบกันระยะแบบไม่ให้คู่ชกเข้าถึง' },
  { icon: '🙏', title: 'ไหว้ครูรำมวยสำหรับผู้เริ่มต้น' },
]

const minutes = (key: string, lo: number, hi: number) => `${between(key, lo, hi)}:${String(between(`${key}:s`, 0, 59)).padStart(2, '0')}`

export const interviews: Video[] = fighters.slice(0, 8).map((f, i) => ({
  id: `interview-${f.id}`,
  kind: 'interview',
  title: INTERVIEW_TITLES[i % INTERVIEW_TITLES.length](f.name),
  description: `${f.name} จาก${f.camp} พูดถึงการเตรียมตัว สไตล์${f.style} และเป้าหมายในปีนี้`,
  length: minutes(`${f.id}:interview`, 6, 24),
  views: between(`${f.id}:interview:views`, 18_000, 420_000),
  fighterId: f.id,
}))

export const documentaries: Video[] = camps.map((c) => ({
  id: `camp-${c.id}`,
  kind: 'documentary',
  title: `เบื้องหลัง${c.name}`,
  description: `${c.about} ตามติดการซ้อมหนึ่งวันกับ${c.headTrainer} ที่จังหวัด${c.province}`,
  length: minutes(`${c.id}:doc`, 18, 46),
  views: between(`${c.id}:doc:views`, 12_000, 260_000),
  campId: c.id,
}))

export const techniques: Video[] = TECHNIQUES.map((t, i) => ({
  id: `technique-${i + 1}`,
  kind: 'technique',
  title: t.title,
  description: `${camps[i % camps.length].headTrainer} จาก${camps[i % camps.length].name} สอนทีละขั้นตอน`,
  length: minutes(`technique:${i}`, 4, 15),
  views: between(`technique:${i}:views`, 9_000, 180_000),
  campId: camps[i % camps.length].id,
  icon: t.icon,
}))

export const videos = [...interviews, ...documentaries, ...techniques]
export const findVideo = (id: string) => videos.find((v) => v.id === id)
export const relatedVideos = (video: Video) => videos.filter((v) => v.kind === video.kind && v.id !== video.id)

export const highlights: Highlight[] = bouts
  .filter((b) => b.hasVod && b.method === 'น็อก' && b.winnerId)
  .map((bout) => {
    const winner = findFighter(bout.winnerId!)!
    const loser = findFighter(bout.winnerId === bout.redId ? bout.blueId : bout.redId)!
    return {
      bout,
      winner,
      loser,
      title: `${winner.name} น็อก ${loser.name} ยก ${bout.endRound}`,
      length: minutes(`${bout.id}:hl`, 1, 4),
      views: between(`${bout.id}:hl:views`, 30_000, 900_000),
      href: vodHref(bout),
    }
  })

export const fightClips = bouts.filter((b) => b.hasVod).map((bout) => ({
  bout,
  red: findFighter(bout.redId)!,
  blue: findFighter(bout.blueId)!,
  href: vodHref(bout),
}))

export const formatViews = (views: number) =>
  views >= 1_000_000 ? `${(views / 1_000_000).toFixed(1)}M` : views >= 1_000 ? `${Math.round(views / 1_000)}K` : `${views}`

export const toSeconds = (length: string) => length.split(':').reduce((sum, part) => sum * 60 + Number(part), 0)

const CHAPTERS: Record<VideoKind, string[]> = {
  interview: ['เปิดรายการ', 'การเตรียมตัวก่อนชก', 'จุดเปลี่ยนในเวที', 'เป้าหมายปีนี้', 'ฝากถึงแฟนมวย'],
  documentary: ['เช้าวันซ้อม', 'การฝึกพื้นฐาน', 'ชีวิตในค่าย', 'เบื้องหลังเวที', 'ก้าวต่อไปของค่าย'],
  technique: ['อุ่นเครื่อง', 'ท่าพื้นฐาน', 'ข้อผิดพลาดที่พบบ่อย', 'ซ้อมกับเป้า', 'สรุปท้ายคลิป'],
}

const LINES: Record<VideoKind, string[]> = {
  interview: [
    'สวัสดีครับ วันนี้เรามาคุยกันแบบสบาย ๆ หลังการซ้อม',
    'ช่วงนี้ซ้อมวันละสองรอบ เช้าวิ่ง เย็นเข้าเป้า',
    'ไฟต์ที่แล้วผมเรียนรู้เรื่องการคุมระยะเยอะมาก',
    'พอถึงยกสามผมรู้ว่าต้องเปลี่ยนจังหวะทันที',
    'ครูบอกเสมอว่าอย่ารีบ ให้คู่ต่อสู้พลาดเอง',
    'ปีนี้เป้าหมายคือขึ้นชิงแชมป์ให้ได้',
    'เรื่องน้ำหนักก็ต้องคุมตั้งแต่ก่อนแข่งเป็นเดือน',
    'ขอบคุณแฟนมวยที่เชียร์กันมาตลอดครับ',
  ],
  documentary: [
    'ตีห้าครึ่ง เสียงนักมวยเริ่มดังขึ้นทั่วค่าย',
    'ทุกคนเริ่มจากวิ่งสิบกิโลเมตรก่อนกินข้าวเช้า',
    'ครูจะดูการยืนของนักมวยทุกคนก่อนเข้าเป้า',
    'เด็กใหม่ใช้เวลาเป็นปีกว่าจะได้ขึ้นเวทีแรก',
    'บ่ายสามคือช่วงซ้อมหนักที่สุดของวัน',
    'ที่นี่ทุกคนกินข้าวและนอนด้วยกันเหมือนครอบครัว',
    'ก่อนแข่งครูจะวางแผนแยกกับนักมวยทีละคน',
    'ค่ายยังตั้งใจส่งต่อวิชานี้ให้รุ่นต่อไป',
  ],
  technique: [
    'ก่อนเริ่มให้อุ่นสะโพกและข้อเท้าให้พร้อม',
    'ยืนให้เท้าห่างเท่าช่วงไหล่ น้ำหนักกลางตัว',
    'เริ่มจากหมุนเท้าหลักก่อน แล้วค่อยส่งสะโพก',
    'จุดพลาดที่เจอบ่อยคือเอนตัวไปหลังมากเกินไป',
    'ลองช้า ๆ สิบครั้งโดยยังไม่ต้องใช้แรง',
    'เมื่อจังหวะถูกแล้วค่อยเพิ่มความเร็ว',
    'เข้าเป้าให้โดนด้วยจุดเดิมทุกครั้ง',
    'สรุปคือฝึกจังหวะก่อนฝึกแรงเสมอ',
  ],
}

const COMMENTS = ['ชอบคลิปนี้มาก ดูแล้วอยากไปซ้อมเลย', 'พูดตรงใจแฟนมวยจริง ๆ', 'ขอตอนต่อไปด้วยครับ', 'ดูจบแล้วเข้าใจมวยมากขึ้น', 'ทีมงานตัดต่อดีมาก', 'เชียร์เสมอครับ']

// Evenly spaced markers: the mock has no real edit points, only a believable shape.
const spaced = (video: Video, count: number) => Array.from({ length: count }, (_, i) => Math.floor((toSeconds(video.length) * i) / count))

export const chaptersOf = (video: Video) => spaced(video, CHAPTERS[video.kind].length).map((at, i) => ({ at, title: CHAPTERS[video.kind][i] }))
export const transcriptOf = (video: Video) => spaced(video, LINES[video.kind].length).map((at, i) => ({ at, text: LINES[video.kind][i] }))

export const commentsOf = (video: Video) =>
  [0, 1, 2, 3, 4, 5].map((i) => {
    const key = `${video.id}:comment:${i}`
    return {
      id: key,
      user: crowdNames[between(`${key}:user`, 0, crowdNames.length - 1)],
      text: COMMENTS[between(`${key}:text`, 0, COMMENTS.length - 1)],
      likes: between(`${key}:likes`, 2, 480),
      hours: between(`${key}:hours`, 1, 200),
    }
  })

export const uploadedOf = (video: Video) => `${between(`${video.id}:uploaded`, 1, 60)} วันที่แล้ว`

// Same kind first, so autoplay stays on topic before moving to other shows.
export const upNext = (video: Video) => [...relatedVideos(video), ...videos.filter((v) => v.kind !== video.kind)]

export type Channel = { name: string; followers: number; href?: string; fighter?: Fighter; camp?: Camp }

export function channelOf(video: Video): Channel {
  const fighter = fighters.find((f) => f.id === video.fighterId)
  if (fighter) return { name: fighter.name, followers: between(`${fighter.id}:followers`, 12_000, 480_000), href: `/fighters/${fighter.id}`, fighter }
  const camp = camps.find((c) => c.id === video.campId)!
  return { name: camp.name, followers: between(`${camp.id}:followers`, 8_000, 190_000), camp }
}
