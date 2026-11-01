'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { MockPanel } from '@/components/MockPanel'

export default function RegisterPage() {
  const router = useRouter()
  const [result, setResult] = useState('ok')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (result === 'taken') return setError('อีเมลนี้มีบัญชีอยู่แล้ว เข้าสู่ระบบหรือใช้อีเมลอื่น')
    router.push('/')
  }

  return (
    <div className="auth panel">
      <h1>สมัครสมาชิก</h1>
      <form className="stack" onSubmit={submit}>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="field"><label htmlFor="name">ชื่อที่แสดง</label><input id="name" className="input" autoComplete="nickname" required /></div>
        <div className="field"><label htmlFor="email">อีเมล</label><input id="email" className="input" type="email" autoComplete="email" required /></div>
        <div className="field"><label htmlFor="password">รหัสผ่าน อย่างน้อย 8 ตัวอักษร</label><input id="password" className="input" type="password" autoComplete="new-password" minLength={8} required /></div>
        <button className="btn btn-lime">สมัครสมาชิก</button>
        <Link className="muted small" href="/login">มีบัญชีแล้ว เข้าสู่ระบบ</Link>
      </form>
      <MockPanel groups={[{
        label: 'ผลการสมัคร',
        value: result,
        onChange: (v) => { setResult(v); setError('') },
        options: [['ok', 'สำเร็จ'], ['taken', 'อีเมลซ้ำ']],
      }]} />
    </div>
  )
}
