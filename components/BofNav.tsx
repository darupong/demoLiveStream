'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  ['/bof', 'ภาพรวม'],
  ['/bof/events', 'รายการถ่ายทอด'],
  ['/bof/vod', 'อนุมัติ VOD'],
  ['/bof/scores', 'คะแนน AI'],
  ['/bof/moderation', 'ดูแลแชท'],
  ['/bof/entitlements', 'สิทธิ์รับชม'],
  ['/bof/gifts', 'ธุรกรรมของขวัญ'],
  ['/bof/products', 'สินค้า Popup'],
]

export function BofNav() {
  const path = usePathname()
  return (
    <nav className="bof-nav" aria-label="เมนู Back Office">
      {links.map(([href, label]) => {
        const active = href === '/bof' ? path === href : path.startsWith(href)
        return <Link key={href} href={href} aria-current={active ? 'page' : undefined}>{label}</Link>
      })}
    </nav>
  )
}
