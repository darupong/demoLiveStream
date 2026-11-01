// All data here is fictional. Nothing in this mockup talks to a real service.

// 'ended' = broadcast over but VOD not approved, so viewers must not see it in VOD lists.
export type EventStatus = 'live' | 'upcoming' | 'ended' | 'vod'

export type FightEvent = {
  id: string
  red: string
  blue: string
  division: string
  rounds: number
  status: EventStatus
  date: string
  venue: string
  viewers?: string
  price: number
}

export const events: FightEvent[] = [
  { id: 'tawanchai-petchmuangthai', red: 'ตะวันฉาย', blue: 'เพชรเมืองไทย', division: 'รุ่นเฟเธอร์เวต', rounds: 5, status: 'live', date: 'วันนี้ 20:00 น.', venue: 'สนามมวยเวทีกลาง', viewers: '2.4K', price: 199 },
  { id: 'saifah-daabthong', red: 'สายฟ้าเหนือ', blue: 'ดาบทอง', division: 'รุ่นไลท์เวต', rounds: 5, status: 'live', date: 'วันนี้ 19:00 น.', venue: 'สนามมวยเวทีกลาง', viewers: '860', price: 149 },
  { id: 'payak-lekkai', red: 'พยัคฆ์ลำพูน', blue: 'เหล็กไหล', division: 'รุ่นแบนตัมเวต', rounds: 5, status: 'upcoming', date: 'ส. 7 พ.ย. 20:00 น.', venue: 'สนามมวยเวทีกลาง', price: 199 },
  { id: 'kongpob-singthong', red: 'ก้องภพ', blue: 'สิงห์ทอง', division: 'รุ่นเวลเตอร์เวต', rounds: 5, status: 'upcoming', date: 'อา. 8 พ.ย. 19:30 น.', venue: 'สนามมวยริมน้ำ', price: 149 },
  { id: 'narai-prabtong', red: 'นารายณ์น้อย', blue: 'ปราบทอง', division: 'รุ่นฟลายเวต', rounds: 3, status: 'upcoming', date: 'ส. 14 พ.ย. 18:00 น.', venue: 'สนามมวยริมน้ำ', price: 99 },
  { id: 'rungrit-chaiyo', red: 'รุ่งฤทธิ์', blue: 'ไชโย', division: 'รุ่นไลท์เวต', rounds: 5, status: 'vod', date: 'ส. 24 ต.ค.', venue: 'สนามมวยเวทีกลาง', price: 99 },
  { id: 'phayu-sonkhla', red: 'พายุใต้', blue: 'สอนกล้า', division: 'รุ่นเฟเธอร์เวต', rounds: 5, status: 'vod', date: 'อา. 18 ต.ค.', venue: 'สนามมวยริมน้ำ', price: 99 },
  { id: 'duangdee-mekkhala', red: 'ดวงดี', blue: 'เมฆขลา', division: 'รุ่นแบนตัมเวต', rounds: 3, status: 'vod', date: 'ส. 10 ต.ค.', venue: 'สนามมวยเวทีกลาง', price: 79 },
  { id: 'chaiyon-phetdam', red: 'ชัยยนต์', blue: 'เพชรดำ', division: 'รุ่นไลท์เวต', rounds: 5, status: 'ended', date: 'ส. 31 ต.ค.', venue: 'สนามมวยเวทีกลาง', price: 149 },
  { id: 'thongdee-kraisorn', red: 'ทองดี', blue: 'ไกรสร', division: 'รุ่นฟลายเวต', rounds: 3, status: 'ended', date: 'ศ. 30 ต.ค.', venue: 'สนามมวยริมน้ำ', price: 99 },
  { id: 'wirat-samart', red: 'วิรัช', blue: 'สามารถน้อย', division: 'รุ่นเฟเธอร์เวต', rounds: 5, status: 'ended', date: 'อา. 1 พ.ย.', venue: 'สนามมวยริมน้ำ', price: 149 },
  { id: 'anan-khemmarat', red: 'อนันต์', blue: 'เขมราฐ', division: 'รุ่นแบนตัมเวต', rounds: 5, status: 'ended', date: 'พฤ. 29 ต.ค.', venue: 'สนามมวยเวทีกลาง', price: 99 },
]

export const findEvent = (id: string) => events.find((e) => e.id === id)

// Thai leading vowels are written before the consonant, so skip them for initials.
export const initial = (name: string) => name.replace(/^[เแโใไ]/, '')[0]

export const rounds = [
  { round: 1, red: 10, blue: 9, recap: 'มุมแดงคุมระยะด้วยเตะซ้าย มุมน้ำเงินตอบกลับช้า' },
  { round: 2, red: 10, blue: 9, recap: 'มุมแดงเข้าคลุกได้แต้มจากเข่า มุมน้ำเงินเริ่มเดินหน้าปลายยก' },
]

export const chatSeed = [
  { id: 1, user: 'แฟนมวยโคราช', text: 'เตะซ้ายตะวันฉายคมมาก' },
  { id: 2, user: 'ป๋าเล็ก', text: 'ยกนี้เพชรเมืองไทยต้องเดินหน้าแล้ว' },
  { id: 3, user: 'มุมแดงจัดไป', text: 'สู้ ๆ ตะวันฉาย!' },
]

export type Gift = { id: string; name: string; icon: string; credit: number }

export const gifts: Gift[] = [
  { id: 'g1', name: 'ดอกไม้', icon: '🌹', credit: 5 },
  { id: 'g2', name: 'ดาว', icon: '⭐', credit: 10 },
  { id: 'g3', name: 'พวงมาลัย', icon: '🌼', credit: 50 },
  { id: 'g4', name: 'นวมทอง', icon: '🥊', credit: 200 },
  { id: 'g5', name: 'เข็มขัดแชมป์', icon: '🏆', credit: 2000 },
]

export const BIG_GIFT_CREDIT = 200

export const crowdNames = ['แฟนมวยโคราช', 'ป๋าเล็ก', 'มุมแดงจัดไป', 'น้องเมย์', 'ลุงสมาน', 'เซียนมวยบางนา', 'พี่หนุ่ม', 'ฟ้าใส']

export const crowdLines = ['เตะสวยมาก', 'เข่าเข้าเต็ม ๆ', 'ยกนี้สนุก', 'สู้ ๆ', 'คมจริง', 'ใครจะชนะ', 'จังหวะดีมาก', 'หมัดหนัก', 'เชียร์สุดใจ']

export type Product = { id: string; name: string; seller: string; price: number; icon: string; href: string }

export const products: Product[] = [
  { id: 'p1', name: 'กางเกงมวยตะวันฉาย', seller: 'ค่ายสิงห์ล้านนา', price: 890, icon: '🩳', href: 'https://example.com/shop/p1' },
  { id: 'p2', name: 'นวมซ้อม 12 ออนซ์', seller: 'ร้านอุปกรณ์มวย', price: 1590, icon: '🥊', href: 'https://example.com/shop/p2' },
  { id: 'p3', name: 'เสื้อค่ายเพชรอีสาน', seller: 'ค่ายเพชรอีสาน', price: 450, icon: '👕', href: 'https://example.com/shop/p3' },
  { id: 'p4', name: 'ผ้าพันมือ', seller: 'ร้านอุปกรณ์มวย', price: 190, icon: '🧤', href: 'https://example.com/shop/p4' },
  { id: 'p5', name: 'เสื้อค่ายกรุงธน', seller: 'ค่ายกรุงธน', price: 420, icon: '🎽', href: 'https://example.com/shop/p5' },
]

export const eventProducts: Record<string, string[]> = {
  'tawanchai-petchmuangthai': ['p1', 'p2', 'p3'],
  'saifah-daabthong': ['p2', 'p5'],
}

export const pinnedProducts: Record<string, string> = {
  'tawanchai-petchmuangthai': 'p1',
  'saifah-daabthong': 'p5',
}

export type LedgerEntry = {
  id: string
  time: string
  label: string
  change: number
  balance: number
  gift?: string
  fighter?: string
  to?: string
  eventId?: string
}

export const creditLedger: LedgerEntry[] = [
  { id: 'TOP-1001', time: '1 พ.ย. 18:30 น.', label: 'เติม Credit จากระบบภายนอก', change: 1500, balance: 1500 },
  { id: 'TX-5521', time: '1 พ.ย. 20:41 น.', label: 'ส่งนวมทองให้ ตะวันฉาย', change: -200, balance: 1300, gift: 'นวมทอง', fighter: 'ตะวันฉาย', to: 'ค่ายสิงห์ล้านนา', eventId: 'tawanchai-petchmuangthai' },
  { id: 'TX-5522', time: '1 พ.ย. 20:43 น.', label: 'ส่งพวงมาลัยให้ เพชรเมืองไทย', change: -50, balance: 1250, gift: 'พวงมาลัย', fighter: 'เพชรเมืองไทย', to: 'ค่ายเพชรอีสาน', eventId: 'tawanchai-petchmuangthai' },
]

export type VodStatus = 'preparing' | 'failed' | 'review' | 'published'

export const vodStatusLabel: Record<VodStatus, string> = {
  preparing: 'กำลังเตรียมไฟล์',
  failed: 'เตรียมไฟล์ไม่สำเร็จ',
  review: 'รอตรวจ',
  published: 'เผยแพร่แล้ว',
}

export const vodQueue: { eventId: string; status: VodStatus; files: { vid: string; length: string }[] }[] = [
  { eventId: 'rungrit-chaiyo', status: 'published', files: [{ vid: 'v0a12f', length: '1:12:40' }] },
  { eventId: 'phayu-sonkhla', status: 'published', files: [{ vid: 'v0b90a', length: '0:41:08' }, { vid: 'v0b90b', length: '0:28:04' }] },
  { eventId: 'duangdee-mekkhala', status: 'published', files: [{ vid: 'v0c77e', length: '0:48:21' }] },
  { eventId: 'chaiyon-phetdam', status: 'review', files: [{ vid: 'v0d31c', length: '0:41:08' }, { vid: 'v0d32d', length: '0:27:55' }] },
  { eventId: 'thongdee-kraisorn', status: 'review', files: [{ vid: 'v0e11b', length: '0:46:30' }] },
  { eventId: 'wirat-samart', status: 'preparing', files: [] },
  { eventId: 'anan-khemmarat', status: 'failed', files: [] },
]

export type AiJobStatus = 'waiting' | 'processing' | 'failed' | 'done'

export const aiJobLabel: Record<AiJobStatus, string> = {
  waiting: 'รอคิว',
  processing: 'กำลังประมวลผล',
  failed: 'ล้มเหลว',
  done: 'เสร็จแล้ว',
}

export const aiJobs: { id: string; eventId: string; round: number; status: AiJobStatus; raw: string }[] = [
  { id: 'j1', eventId: 'tawanchai-petchmuangthai', round: 1, status: 'done', raw: '{ "event": "tawanchai-petchmuangthai", "round": 1, "red": 10, "blue": 9 }' },
  { id: 'j2', eventId: 'tawanchai-petchmuangthai', round: 2, status: 'done', raw: '{ "event": "tawanchai-petchmuangthai", "round": 2, "red": 10, "blue": 9 }' },
  { id: 'j3', eventId: 'saifah-daabthong', round: 3, status: 'failed', raw: '{ "error": "timeout", "message": "ไม่ได้รับผลภายในเวลาที่กำหนด" }' },
  { id: 'j4', eventId: 'saifah-daabthong', round: 4, status: 'processing', raw: '' },
]

export const chatReports = [
  { id: 'r1', user: 'สายบู๊', text: 'ข้อความโฆษณาเว็บพนัน', reason: 'สแปม', eventId: 'tawanchai-petchmuangthai' },
  { id: 'r2', user: 'คนดูเงียบ', text: 'ข้อความด่าทอนักมวย', reason: 'คำหยาบ', eventId: 'tawanchai-petchmuangthai' },
  { id: 'r3', user: 'ลุงแดง', text: 'ส่งข้อความซ้ำ 12 ครั้ง', reason: 'ก่อกวน', eventId: 'saifah-daabthong' },
]

export const entitlements = [
  { user: 'fah@example.com', eventId: 'tawanchai-petchmuangthai', grantedAt: '1 พ.ย. 18:42 น.', ref: 'PAY-10293' },
  { user: 'fah@example.com', eventId: 'rungrit-chaiyo', grantedAt: '24 ต.ค. 19:10 น.', ref: 'PAY-10102' },
  { user: 'somchai@example.com', eventId: 'tawanchai-petchmuangthai', grantedAt: '1 พ.ย. 19:02 น.', ref: 'PAY-10301' },
  { user: 'nid@example.com', eventId: 'saifah-daabthong', grantedAt: '1 พ.ย. 18:15 น.', ref: 'PAY-10288' },
]

export const giftTransactions = [
  { id: 'TX-5520', user: 'somchai@example.com', gift: 'พวงมาลัย', credit: 50, to: 'ค่ายเพชรอีสาน', eventId: 'tawanchai-petchmuangthai', time: '20:38 น.' },
  { id: 'TX-5519', user: 'nid@example.com', gift: 'ดาว', credit: 10, to: 'ค่ายกรุงธน', eventId: 'saifah-daabthong', time: '20:33 น.' },
]

export const streamLog = [
  { time: '19:58:02', text: 'ได้รับสัญญาณจาก OBS (push_start)' },
  { time: '20:14:37', text: 'สัญญาณขาดช่วง (push_end) เริ่มนับเวลารอ 60 วินาที' },
  { time: '20:14:52', text: 'สัญญาณกลับมา (push_start)' },
]
