// Run with `npm run check`. Fighter pages only make sense if every number agrees across pages.
import assert from 'node:assert/strict'
import { analyticsOf, archivedEvent, bouts, COUNTRIES, fighterByName, fighters, fightsOf, findFighter, opponentsOf } from '../lib/fighters.ts'
import { events, vodQueue } from '../lib/mock.ts'
import { channelOf, chaptersOf, commentsOf, fightClips, findVideo, highlights, relatedVideos, toSeconds, transcriptOf, upNext, videos } from '../lib/library.ts'

assert.equal(new Set(fighters.map((f) => f.id)).size, fighters.length, 'fighter ids must be unique')
assert.equal(new Set(bouts.map((b) => b.id)).size, bouts.length, 'bout ids must be unique')

for (const e of events) {
  for (const name of [e.red, e.blue]) {
    const fighter = fighterByName(name)
    assert.ok(fighter, `no profile for ${name}`)
    assert.equal(findFighter(fighter.id), fighter)
  }
}

for (const b of bouts) {
  assert.notEqual(b.redId, b.blueId, `${b.id} pairs a fighter with themselves`)
  const red = fightsOf(b.redId).find((f) => f.bout.id === b.id)
  const blue = fightsOf(b.blueId).find((f) => f.bout.id === b.id)
  assert.ok(red && blue, `${b.id} missing from a fighter's history`)
  const mirrored = { ชนะ: 'แพ้', แพ้: 'ชนะ', เสมอ: 'เสมอ' }
  assert.equal(blue.result, mirrored[red.result], `${b.id} results do not mirror`)
  assert.ok(b.endRound >= 1 && b.endRound <= b.rounds, `${b.id} ended outside the scheduled rounds`)
}

for (const f of fighters) {
  const fights = fightsOf(f.id)
  const count = (r) => fights.filter((x) => x.result === r).length
  assert.ok(f.wins >= count('ชนะ'), `${f.name} career wins below recent wins`)
  assert.ok(f.losses >= count('แพ้'), `${f.name} career losses below recent losses`)
  assert.ok(f.knockouts <= f.wins, `${f.name} has more knockouts than wins`)
  assert.equal(f.country, COUNTRIES[f.countryCode], `${f.name} country name does not match the flag`)

  const a = analyticsOf(f)
  assert.equal(a.methods.reduce((sum, m) => sum + m.value, 0), count('ชนะ'), `${f.name} win methods do not add up`)
  assert.ok(a.rank >= 1 && a.rank <= a.rankedFighters, `${f.name} rank out of range`)

  const met = opponentsOf(f.id).reduce((sum, o) => sum + o.wins + o.losses + o.draws, 0)
  assert.equal(met, fights.length, `${f.name} head-to-head does not match history`)
}

// Unapproved VOD must stay unreachable from every fighter page.
for (const v of vodQueue.filter((q) => q.status !== 'published')) {
  const bout = bouts.find((b) => b.eventId === v.eventId)
  if (bout) assert.equal(bout.hasVod, false, `${v.eventId} exposes an unapproved VOD`)
}
for (const b of bouts.filter((x) => x.hasVod && !x.eventId)) assert.ok(archivedEvent(b.id), `${b.id} VOD link has no page`)
for (const b of bouts.filter((x) => !x.hasVod)) assert.equal(archivedEvent(b.id), undefined, `${b.id} opens without approval`)

// Home page rows must only link to things that open, and never to an unapproved VOD.
assert.equal(new Set(videos.map((v) => v.id)).size, videos.length, 'video ids must be unique')
for (const v of videos) {
  assert.equal(findVideo(v.id), v)
  assert.ok(relatedVideos(v).every((r) => r.kind === v.kind && r.id !== v.id), `${v.id} related list is wrong`)
  for (const marks of [chaptersOf(v), transcriptOf(v)]) {
    assert.equal(marks[0].at, 0, `${v.id} markers must start at the beginning`)
    marks.forEach((m, i) => {
      assert.ok(m.at < toSeconds(v.length), `${v.id} marker runs past the end`)
      if (i) assert.ok(m.at > marks[i - 1].at, `${v.id} markers must increase`)
    })
  }
  assert.ok(channelOf(v).name, `${v.id} has no channel`)
  assert.equal(upNext(v).length, videos.length - 1, `${v.id} up next must hold every other video once`)
  assert.equal(upNext(v)[0].kind, v.kind, `${v.id} autoplay must stay on the same kind`)
  assert.ok(!upNext(v).includes(v), `${v.id} recommends itself`)
  assert.equal(new Set(commentsOf(v).map((c) => c.id)).size, commentsOf(v).length, `${v.id} comment ids repeat`)
}
for (const h of highlights) {
  assert.ok(h.bout.hasVod, `${h.title} links to a closed VOD`)
  assert.equal(h.winner.id, h.bout.winnerId, `${h.title} names the wrong winner`)
  assert.equal(h.bout.method, 'น็อก', `${h.title} is not a knockout`)
}
assert.ok(fightClips.every((c) => c.bout.hasVod), 'fight clip row shows a closed VOD')

console.log(`ok: ${videos.length} videos,`, `${highlights.length} highlights`)
console.log(`ok: ${fighters.length} fighters, ${bouts.length} bouts, all pages agree`)
