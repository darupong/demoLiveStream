import type { ReactNode } from 'react'
import { ChannelRail } from '@/components/ChannelRail'
import { Navbar } from '@/components/Navbar'

export default function ViewerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="nav-wrap"><Navbar /></div>
      <div className="shell">
        <ChannelRail />
        <div className="shell-main">
          <main className="page">{children}</main>
          <footer className="footer">
            <span>LIVESTREAM mockup ข้อมูลทั้งหมดเป็นข้อมูลจำลอง</span>
          </footer>
        </div>
      </div>
    </>
  )
}
