'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { MockPanel } from '@/components/MockPanel'

export default function ResetPasswordPage() {
  const [link, setLink] = useState('valid')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (form.get('password') !== form.get('confirm')) return setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
    setError('')
    setDone(true)
  }

  return (
    <div className="auth panel">
      <h1>ตั้งรหัสผ่านใหม่</h1>
      {link === 'expired' && (
        <div className="stack">
          <p className="alert">ลิงก์นี้หมดอายุแล้ว ขอลิงก์ใหม่เพื่อตั้งรหัสผ่าน</p>
          <Link className="btn" href="/forgot-password">ขอลิงก์ใหม่</Link>
        </div>
      )}
      {link === 'valid' && done && (
        <div className="stack">
          <p className="tag tag-ok" role="status">ตั้งรหัสผ่านใหม่แล้ว</p>
          <Link className="btn btn-lime" href="/login">เข้าสู่ระบบ</Link>
        </div>
      )}
      {link === 'valid' && !done && (
        <form className="stack" onSubmit={submit}>
          {error && <p className="alert" role="alert">{error}</p>}
          <div className="field"><label htmlFor="password">รหัสผ่านใหม่ อย่างน้อย 8 ตัวอักษร</label><input id="password" name="password" className="input" type="password" autoComplete="new-password" minLength={8} required /></div>
          <div className="field"><label htmlFor="confirm">ยืนยันรหัสผ่านใหม่</label><input id="confirm" name="confirm" className="input" type="password" autoComplete="new-password" minLength={8} required /></div>
          <button className="btn btn-lime">ตั้งรหัสผ่านใหม่</button>
        </form>
      )}
      <MockPanel groups={[{ label: 'ลิงก์จากอีเมล', value: link, onChange: setLink, options: [['valid', 'ใช้ได้'], ['expired', 'หมดอายุ']] }]} />
    </div>
  )
}
