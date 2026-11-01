'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { MockPanel } from '@/components/MockPanel'

export default function LoginPage() {
  const router = useRouter()
  const [result, setResult] = useState('ok')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (result === 'wrong') return setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    router.push('/')
  }

  return (
    <div className="auth panel">
      <h1>เข้าสู่ระบบ</h1>
      <form className="stack" onSubmit={submit}>
        {result === 'expired' && <p className="alert" role="status">Session หมดอายุ เข้าสู่ระบบอีกครั้งเพื่อรับชมต่อ</p>}
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="field"><label htmlFor="email">อีเมล</label><input id="email" name="email" className="input" type="email" autoComplete="email" required /></div>
        <div className="field"><label htmlFor="password">รหัสผ่าน</label><input id="password" name="password" className="input" type="password" autoComplete="current-password" required /></div>
        <button className="btn btn-lime">เข้าสู่ระบบ</button>
        <div className="row between small">
          <Link className="muted" href="/forgot-password">ลืมรหัสผ่าน</Link>
          <Link className="lime" href="/register">สมัครสมาชิก</Link>
        </div>
      </form>
      <MockPanel groups={[{
        label: 'ผลการเข้าสู่ระบบ',
        value: result,
        onChange: (v) => { setResult(v); setError('') },
        options: [['ok', 'สำเร็จ'], ['wrong', 'รหัสผ่านผิด'], ['expired', 'Session หมดอายุ']],
      }]} />
    </div>
  )
}
