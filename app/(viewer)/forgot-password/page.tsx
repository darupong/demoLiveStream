'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="auth panel">
      <h1>ลืมรหัสผ่าน</h1>
      {sent
        ? (
          <div className="stack">
            <p className="muted">ถ้าอีเมลนี้มีบัญชีอยู่ ลิงก์ตั้งรหัสผ่านใหม่จะถูกส่งไปที่กล่องจดหมาย</p>
            <Link className="lime small" href="/reset-password">เปิดลิงก์จากอีเมล (ตัวอย่าง)</Link>
          </div>
        )
        : (
          <form className="stack" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div className="field"><label htmlFor="email">อีเมล</label><input id="email" className="input" type="email" autoComplete="email" required /></div>
            <button className="btn btn-lime">ส่งลิงก์ตั้งรหัสผ่านใหม่</button>
          </form>
        )}
      <p style={{ marginTop: 16 }}><Link className="muted small" href="/login">กลับไปเข้าสู่ระบบ</Link></p>
    </div>
  )
}
