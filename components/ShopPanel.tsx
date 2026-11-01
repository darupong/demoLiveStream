'use client'

import { useEventProducts } from '@/lib/productStore'

export type ShopState = 'ready' | 'loading' | 'empty' | 'error'

export const shopOptions: [ShopState, string][] = [
  ['ready', 'มีสินค้า'],
  ['loading', 'กำลังโหลด'],
  ['empty', 'ไม่มีสินค้า'],
  ['error', 'โหลดไม่สำเร็จ'],
]

// Rendered inline under the player so it never covers the controls, score, chat, or gifts.
export function ShopPanel({ eventId, state, onRetry }: { eventId: string; state: ShopState; onRetry: () => void }) {
  const { shown, pinnedId } = useEventProducts(eventId)
  const sorted = [...shown].sort((a, b) => Number(b.id === pinnedId) - Number(a.id === pinnedId))
  return (
    <section className="panel stack" aria-label="ร้านค้า">
      <h2>สินค้าจากรายการนี้</h2>
      {state === 'loading' && <div className="shimmer" role="status" aria-label="กำลังโหลดสินค้า" />}
      {state === 'error' && (
        <div className="row">
          <p className="muted">โหลดสินค้าไม่สำเร็จ</p>
          <button className="btn btn-sm" onClick={onRetry}>ลองอีกครั้ง</button>
        </div>
      )}
      {(state === 'empty' || (state === 'ready' && sorted.length === 0)) && <p className="muted">รายการนี้ยังไม่มีสินค้า</p>}
      {state === 'ready' && sorted.length > 0 && (
        <div className="products">
          {sorted.map((p) => (
            <a key={p.id} className="product" href={p.href} target="_blank" rel="noreferrer">
              <div className="product-art" aria-hidden="true">{p.icon}</div>
              <b>{p.name}</b>
              <span className="muted small">{p.seller}</span>
              <span className="lime">{p.price.toLocaleString()} บาท</span>
              {p.id === pinnedId && <span className="tag tag-lime">📌 ปักอยู่</span>}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
