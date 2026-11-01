'use client'

import { useState } from 'react'
import { useEventProducts } from '@/lib/productStore'
import { Cheer, GiftBanner } from './useLiveRoom'

export function GiftBanners({ banners }: { banners: GiftBanner[] }) {
  const big = banners.findLast((b) => b.big)
  return (
    <>
      {big && <div className="gift-burst" key={big.id} aria-hidden="true">{big.gift.icon}</div>}
      <ul className="gift-banners" aria-live="polite">
        {banners.map((b) => (
          <li key={b.id} className={b.big ? 'gift-banner big' : 'gift-banner'}>
            <span className="gift-banner-icon" aria-hidden="true">{b.gift.icon}</span>
            <span>
              <b>{b.user}</b>
              <small>ส่ง{b.gift.name}ให้ {b.to}</small>
            </span>
            {/* Keyed on the count so each combo tap replays the pop. */}
            <i key={b.count}>×{b.count}</i>
          </li>
        ))}
      </ul>
    </>
  )
}

export function CheerFloats({ floats }: { floats: Cheer[] }) {
  return (
    <div className="cheer-floats" aria-hidden="true">
      {floats.map((c) => (
        <span key={c.id} className={c.side} style={{ left: c.left }}>♥</span>
      ))}
    </div>
  )
}

export function PinnedProduct({ eventId }: { eventId: string }) {
  const { shown, pinnedId } = useEventProducts(eventId)
  const [closed, setClosed] = useState<string | null>(null)
  const product = shown.find((p) => p.id === pinnedId)
  if (!product) return null
  if (closed === product.id) {
    return <button className="pin pin-reopen" onClick={() => setClosed(null)}>📌 เปิดสินค้าที่ปักไว้</button>
  }
  return (
    <div className="pin">
      <a href={product.href} target="_blank" rel="noreferrer" aria-label={`ซื้อ ${product.name} ราคา ${product.price.toLocaleString()} บาท เปิดในแท็บใหม่`}>
        <span className="pin-art" aria-hidden="true">{product.icon}</span>
        <span className="pin-copy">
          <small>📌 สินค้าที่ปักไว้</small>
          <b>{product.name}</b>
          <span className="lime">{product.price.toLocaleString()} บาท</span>
        </span>
        <span className="pin-buy">ซื้อ</span>
      </a>
      <button className="pin-close" aria-label="ปิดสินค้าที่ปักไว้" onClick={() => setClosed(product.id)}>×</button>
    </div>
  )
}
