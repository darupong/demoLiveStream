'use client'

import { Locale, setLocale, useLocale } from '@/lib/localeStore'
import { Flag } from './Flag'

const LANGUAGES: { id: Locale; code: 'TH' | 'GB'; label: string; name: string }[] = [
  { id: 'th', code: 'TH', label: 'TH', name: 'ภาษาไทย' },
  { id: 'en', code: 'GB', label: 'EN', name: 'English' },
]

export function LanguageSwitch() {
  const locale = useLocale()
  return (
    <div className="lang-switch" role="group" aria-label="เลือกภาษา">
      {LANGUAGES.map((l) => (
        <button key={l.id} aria-pressed={locale === l.id} aria-label={l.name} title={l.name} onClick={() => setLocale(l.id)}>
          <Flag code={l.code} size={21} />
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  )
}
