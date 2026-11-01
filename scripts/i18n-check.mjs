// Run with `npm run check`. Every Thai string must come out of translate() with no Thai left.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { analyticsOf, bouts, camps, COUNTRIES, fighters, fightsOf, giftsOf, STRIKES, titlesOf } from '../lib/fighters.ts'
import { chaptersOf, commentsOf, highlights, KIND_LABEL, transcriptOf, uploadedOf, videos } from '../lib/library.ts'
import { aiJobLabel, aiJobs, chatReports, chatSeed, creditLedger, crowdLines, crowdNames, entitlements, events, gifts, giftTransactions, products, rounds, streamLog, vodStatusLabel } from '../lib/mock.ts'
import { hasThai, translate } from '../lib/translations.ts'

const sources = new Set()
const add = (value) => {
  if (typeof value === 'string' && hasThai(value)) sources.add(value)
  else if (Array.isArray(value)) value.forEach(add)
  else if (value && typeof value === 'object') Object.values(value).forEach(add)
}

add([events, gifts, products, camps, rounds, chatSeed, crowdNames, crowdLines, chatReports, creditLedger, entitlements, giftTransactions, streamLog, aiJobs])
add([vodStatusLabel, aiJobLabel, KIND_LABEL, COUNTRIES, STRIKES.map((s) => [s.label, s.style])])
add(bouts.map((b) => [b.date, b.venue, b.division]))
add(highlights.map((h) => h.title))
for (const f of fighters) {
  const { camp, country, division, name, stance, style, bio } = f
  add([camp, country, division, name, stance, style, bio, titlesOf(f).map((t) => t.title), giftsOf(f).fans.map((x) => x.name)])
  add(`${f.wins}-${f.losses}-${f.draws} จาก ${analyticsOf(f).totalFights} ไฟต์`)
  add(`อันดับ ${analyticsOf(f).rank} จาก 6 ของ${division}`)
  add(fightsOf(f.id).slice(0, 2).map((x) => [`พบ ${x.opponent.name}`, x.bout.method, x.result]))
}
for (const v of videos) add([v.title, v.description, chaptersOf(v).map((c) => c.title), transcriptOf(v).map((l) => l.text), commentsOf(v).map((c) => [c.user, c.text]), uploadedOf(v)])

// Interface text: quoted strings and JSX text, with interpolations replaced by a sample number.
const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.tsx$/.test(name)) files.push(path)
  }
}
;['app', 'components'].forEach(walk)
for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/\$\{[^}]*\}/g, '5')
  for (const match of source.matchAll(/'([^'\n]*)'|`([^`\n]*)`/g)) add((match[1] ?? match[2]).trim())
  for (const match of source.replace(/\{[^{}\n]*\}/g, '5').matchAll(/>([^<>\n]*[ก-ฺเ-๛][^<>\n]*)</g)) add(match[1].trim())
}

// Page metadata, not screen text.
const ignored = (text) => text.startsWith('Mockup แพลตฟอร์ม')
const missing = [...sources].filter((text) => !ignored(text) && hasThai(translate(text)))
assert.deepEqual(missing, [], `${missing.length} strings still contain Thai`)

// Known translations the page relies on.
assert.equal(translate('ถ่ายทอดสด'), 'Live')
assert.equal(translate('ส. 7 พ.ย. 20:00 น.'), 'Sat 7 Nov 20:00')
assert.equal(translate('12 ก.ย. 2569, รุ่นไลท์เวต'), '12 Sep 2026, Lightweight')
assert.equal(translate('มวยไทย · รุ่นเฟเธอร์เวต · กำหนด 5 ยก'), 'Muay Thai · Featherweight · 5 rounds')
assert.equal(translate('2529'), '1986')
assert.equal(translate('พ.ศ. 2529'), '1986')
assert.equal(translate('ส่งนวมทองให้ ตะวันฉาย'), 'Sent Golden Glove to Tawanchai')

console.log(`ok: ${sources.size} Thai strings translate cleanly`)
