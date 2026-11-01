import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties, ReactNode } from 'react'
import { FighterAvatar } from '@/components/FighterAvatar'
import { FighterGifts } from '@/components/FighterGifts'
import { FightRings, RoundRings, StatRing, StrikeMix, WinMethods } from '@/components/FighterRings'
import { Flag } from '@/components/Flag'
import { Ring } from '@/components/Ring'
import { analyticsOf, campOf, Fighter, findFighter, nextFightOf, opponentsOf, productsOf, Result, teammatesOf, titlesOf, vodHref } from '@/lib/fighters'

const RESULT_TONE: Record<Result, string> = { ชนะ: 'tag-ok', แพ้: 'tag-bad', เสมอ: '' }

function ResultTag({ result }: { result: Result }) {
  return <span className={`tag ${RESULT_TONE[result]}`}>{result}</span>
}

function Block({ title, className, children }: { title?: string; className: string; children: ReactNode }) {
  return (
    <section className={`b ${className}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}

function TaleRow({ label, left, right }: { label: string; left: ReactNode; right: ReactNode }) {
  return (
    <tr>
      <td>{left}</td>
      <th scope="row">{label}</th>
      <td>{right}</td>
    </tr>
  )
}

function NextFight({ fighter }: { fighter: Fighter }) {
  const next = nextFightOf(fighter)
  if (!next) return <p className="muted">ยังไม่มีตารางชกครั้งถัดไป รายการใหม่จะแสดงที่นี่เมื่อประกาศ</p>
  const { event, opponent, record } = next
  const me = analyticsOf(fighter)
  const them = analyticsOf(opponent)
  return (
    <>
      <div className="tale-head">
        <div><FighterAvatar fighter={fighter} size={64} /><b><Flag code={fighter.countryCode} size={24} /> {fighter.name}</b></div>
        <div className="tale-vs">
          <span className="vs">VS</span>
          <small className="muted">{event.date}</small>
          <Link className="btn btn-sm btn-lime" href={event.status === 'live' ? `/live/${event.id}` : `/events/${event.id}`}>{event.status === 'live' ? 'ดูถ่ายทอดสด' : 'ดูรายการ'}</Link>
        </div>
        <Link href={`/fighters/${opponent.id}`}><FighterAvatar fighter={opponent} size={64} /><b>{opponent.name} <Flag code={opponent.countryCode} size={24} /></b></Link>
      </div>
      <table className="tale">
        <tbody>
          <TaleRow label="ชนะ-แพ้-เสมอ" left={`${fighter.wins}-${fighter.losses}-${fighter.draws}`} right={`${opponent.wins}-${opponent.losses}-${opponent.draws}`} />
          <TaleRow label="อัตราชนะ" left={`${me.winRate}%`} right={`${them.winRate}%`} />
          <TaleRow label="คะแนน AI เฉลี่ย" left={me.averageScore} right={them.averageScore} />
          <TaleRow label="ส่วนสูง / ช่วงแขน" left={`${fighter.heightCm} / ${fighter.reachCm}`} right={`${opponent.heightCm} / ${opponent.reachCm}`} />
        </tbody>
      </table>
      <p className="muted small">
        {record ? `เคยเจอกัน ${record.wins + record.losses + record.draws} ครั้ง ${fighter.name} ชนะ ${record.wins} แพ้ ${record.losses} เสมอ ${record.draws}` : 'ทั้งคู่ยังไม่เคยเจอกันในไฟต์ล่าสุด'}
      </p>
    </>
  )
}

export default async function FighterPage({ params }: { params: Promise<{ id: string }> }) {
  const fighter = findFighter((await params).id)
  if (!fighter) notFound()

  const a = analyticsOf(fighter)
  const camp = campOf(fighter)
  const teammates = teammatesOf(fighter)
  const opponents = opponentsOf(fighter.id)
  const vods = a.fights.filter((f) => f.bout.hasVod)
  const shop = productsOf(fighter)
  const titles = titlesOf(fighter)
  const next = nextFightOf(fighter)
  const ringFights = a.fights.map((f) => ({ key: f.bout.id, date: f.bout.date, opponent: f.opponent.name, result: f.result, score: f.aiScore }))

  return (
    <div className="fighter-page">
      <nav className="crumbs" aria-label="เส้นทาง">
        <Link href="/fighters">นักมวย</Link><span>/</span><b>{fighter.name}</b>
      </nav>

      <div className="bento">
        <header className="b b-hero w6 h2" style={{ '--camp': camp.color } as CSSProperties}>
          <FighterAvatar fighter={fighter} size={168} />
          <div className="b-hero-copy">
            <p className="eyebrow">อันดับ {a.rank} จาก {a.rankedFighters} ของ{fighter.division}</p>
            <h1>{fighter.name}</h1>
            <p className="fp-country"><Flag code={fighter.countryCode} size={54} /><b>{fighter.country}</b></p>
            <p className="muted small">{fighter.camp} · {fighter.style} · {fighter.stance}</p>
            <div className="fp-form" aria-label="ผล 5 ไฟต์ล่าสุด">
              {a.form.map((r, i) => <ResultTag key={i} result={r} />)}
            </div>
            {next && (
              <Link className="btn btn-sm btn-lime" href={next.event.status === 'live' ? `/live/${next.event.id}` : `/events/${next.event.id}`}>
                {next.event.status === 'live' ? 'กำลังชกอยู่ ดูสด' : `ชกครั้งถัดไป ${next.event.date}`}
              </Link>
            )}
          </div>
        </header>

        <Block className="w3">
          <StatRing title="อัตราชนะ" percent={a.winRate} value={`${a.winRate}%`} note={`${fighter.wins}-${fighter.losses}-${fighter.draws} จาก ${a.totalFights} ไฟต์`} />
        </Block>
        <Block className="w3">
          <StatRing title="อัตราชนะน็อก" percent={a.knockoutRate} value={`${a.knockoutRate}%`} note={`${fighter.knockouts} ครั้งจากการชนะ`} />
        </Block>
        <Block className="w3">
          <StatRing title="คะแนน AI เฉลี่ย" percent={a.averageScore} value={`${a.averageScore}`} note={`เฉลี่ยในรุ่น ${a.divisionScore}`} />
        </Block>
        <Block className="w3 b-form">
          <h2>ฟอร์มตอนนี้</h2>
          <p className="b-big">{a.streak.result} {a.streak.length}</p>
          <p className="muted small">ไฟต์ติดต่อกัน</p>
        </Block>

        <Block title="วิธีการชนะ" className="w3 h2"><WinMethods methods={a.methods} /></Block>
        <Block title="อาวุธที่ออกเข้าเป้า" className="w3 h2"><StrikeMix strikes={a.strikes} division={a.divisionStrikes} /></Block>
        <Block title="แรงที่สุดยกไหน" className="w3 h2"><RoundRings rounds={a.rounds} /></Block>
        <Block title={`ผล ${ringFights.length} ไฟต์ล่าสุด`} className="w3 h2">
          <FightRings fights={ringFights} />
          <p className="muted small">ตัวเลขคือคะแนน AI ซ้ายบนคือไฟต์ล่าสุด</p>
        </Block>

        <Block title="ของขวัญจากผู้ชม" className="w6 h3"><FighterGifts fighter={fighter} /></Block>
        <Block title="ไฟต์ถัดไป" className="w6 h3"><NextFight fighter={fighter} /></Block>

        <Block title="ประวัติการชก" className="w7 h3 b-scroll">
          <div className="b-list">
            <table className="table">
              <thead><tr><th>วันที่</th><th>คู่ชก</th><th>ผล</th><th>วิธี</th><th>ยก</th><th>AI</th><th>คลิป</th></tr></thead>
              <tbody>
                {a.fights.map((f) => (
                  <tr key={f.bout.id}>
                    <td>{f.bout.date}</td>
                    <td><Link href={`/fighters/${f.opponent.id}`}><Flag code={f.opponent.countryCode} size={21} /> {f.opponent.name}</Link></td>
                    <td><ResultTag result={f.result} /></td>
                    <td>{f.bout.method}</td>
                    <td>{f.bout.endRound}/{f.bout.rounds}</td>
                    <td>{f.aiScore}</td>
                    <td>{f.bout.hasVod ? <Link href={vodHref(f.bout)}>ดูคลิป</Link> : <span className="muted">ยังไม่เปิด</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="คู่ที่เคยเจอ" className="w5 h3 b-scroll">
          <ul className="b-list b-people">
            {opponents.map((o) => (
              <li key={o.opponent.id}>
                <Link href={`/fighters/${o.opponent.id}`}>
                  <FighterAvatar fighter={o.opponent} size={40} />
                  <span><b>{o.opponent.name}</b><small className="muted">ล่าสุด {o.last.bout.date}</small></span>
                  <span className="b-h2h small">ชนะ {o.wins} แพ้ {o.losses} เสมอ {o.draws}</span>
                  <Flag code={o.opponent.countryCode} size={27} />
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="ดูย้อนหลัง" className="w8 h2">
          {vods.length === 0 && <p className="muted">ยังไม่มีคลิปย้อนหลังที่เปิดให้รับชม</p>}
          <div className="b-vods">
            {vods.map((f) => (
              <Link key={f.bout.id} href={vodHref(f.bout)}>
                <div className="b-vod-art"><Ring /><span className="tag">{f.result}</span></div>
                <b className="small">พบ {f.opponent.name}</b>
                <small className="muted">{f.bout.date}</small>
              </Link>
            ))}
          </div>
        </Block>

        <Block title="ตำแหน่งและรางวัล" className="w4 h2">
          <ul className="fighter-fights">
            {titles.map((t) => <li key={t.title}><span>{t.title}</span><span className="muted small">{t.year}</span></li>)}
          </ul>
          {shop.map((p) => (
            <a key={p.id} className="btn btn-sm" href={p.href} target="_blank" rel="noreferrer">{p.icon} {p.name} {p.price.toLocaleString()} บาท</a>
          ))}
        </Block>

        <Block title={camp.name} className="w5 h2">
          <p className="muted small">{camp.about}</p>
          <dl className="facts small">
            <div><dt>จังหวัด</dt><dd>{camp.province}</dd></div>
            <div><dt>ก่อตั้ง</dt><dd>พ.ศ. {camp.founded}</dd></div>
            <div><dt>หัวหน้าเทรนเนอร์</dt><dd>{camp.headTrainer}</dd></div>
          </dl>
        </Block>

        <Block title="เพื่อนร่วมค่าย" className="w4 h2">
          <ul className="b-mates">
            {teammates.map((t) => (
              <li key={t.id}>
                <Link href={`/fighters/${t.id}`}>
                  <FighterAvatar fighter={t} size={40} />
                  <span><b className="small">{t.name}</b><small className="muted">{t.wins}-{t.losses}-{t.draws}</small></span>
                  <Flag code={t.countryCode} size={24} />
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="ข้อมูลร่างกาย" className="w3 h2">
          <dl className="facts small">
            <div><dt>อายุ</dt><dd>{fighter.age} ปี</dd></div>
            <div><dt>ส่วนสูง</dt><dd>{fighter.heightCm} ซม.</dd></div>
            <div><dt>ช่วงแขน</dt><dd>{fighter.reachCm} ซม.</dd></div>
            <div><dt>การยืน</dt><dd>{fighter.stance.split(' ')[0]}</dd></div>
          </dl>
        </Block>
      </div>
      <p className="muted small">ข้อมูลทั้งหมดในหน้านี้เป็นข้อมูลจำลอง ระบบจริงต้องใช้ผลจากระบบ AI คะแนน</p>
    </div>
  )
}
