'use client'

import { useState } from 'react'
import { events, products } from '@/lib/mock'
import { pinProduct, toggleProductLink, useEventProducts } from '@/lib/productStore'

const selectable = events.filter((e) => e.status === 'live' || e.status === 'upcoming')

export default function BofProducts() {
  const [eventId, setEventId] = useState(selectable[0].id)
  const { linked, pinnedId } = useEventProducts(eventId)
  return (
    <>
      <div className="bof-head">
        <h1 className="bof-title">สินค้า Popup</h1>
        <select className="input" style={{ maxWidth: 320 }} aria-label="เลือกรายการ" value={eventId} onChange={(e) => setEventId(e.target.value)}>
          {selectable.map((e) => <option key={e.id} value={e.id}>{e.red} vs {e.blue}</option>)}
        </select>
      </div>
      <p className="muted small" style={{ marginBottom: 12 }}>ตั้งค่าแยกต่อรายการ และปักได้ครั้งละ 1 สินค้า เปิดหน้า Live ของรายการนี้ไว้อีกแท็บแล้วการ์ดสินค้าจะเปลี่ยนทันที</p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>สินค้า</th><th>ร้าน</th><th>ราคา</th><th>แสดงในรายการนี้</th><th>ปักบนหน้า Live</th></tr></thead>
          <tbody>
            {products.map((p) => {
              const shown = linked.includes(p.id)
              const isPinned = pinnedId === p.id
              return (
                <tr key={p.id}>
                  <td>{p.icon} {p.name}</td>
                  <td>{p.seller}</td>
                  <td>{p.price.toLocaleString()} บาท</td>
                  <td>
                    <label className="row">
                      <input type="checkbox" checked={shown} onChange={() => toggleProductLink(eventId, p.id)} />
                      <span className="small">{shown ? 'แสดง' : 'ซ่อน'}</span>
                    </label>
                  </td>
                  <td>
                    <button className={`btn btn-sm ${isPinned ? 'btn-lime' : ''}`} disabled={!shown} aria-pressed={isPinned} onClick={() => pinProduct(eventId, isPinned ? undefined : p.id)}>
                      {isPinned ? '📌 เลิกปัก' : 'ปักสินค้า'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
