import Link from 'next/link'
import type { ReactNode } from 'react'
import { BofNav } from '@/components/BofNav'
import { LanguageSwitch } from '@/components/LanguageSwitch'

export default function BofLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bof">
      <aside className="bof-side">
        <Link href="/bof" className="logo">LIVE<span>STREAM.</span> <small className="muted">BOF</small></Link>
        <BofNav />
        <Link href="/" className="muted small bof-exit">กลับหน้าผู้ชม</Link>
        <div className="bof-lang"><LanguageSwitch /></div>
      </aside>
      <main className="bof-main">{children}</main>
    </div>
  )
}
