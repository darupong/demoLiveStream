import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import type { ReactNode } from 'react'
import { Translator } from '@/components/Translator'
import { LOCALE_KEY } from '@/lib/translations'
import './globals.css'

const font = Noto_Sans_Thai({ subsets: ['thai', 'latin'] })

export const metadata: Metadata = { title: 'LIVESTREAM', description: 'Mockup แพลตฟอร์มรับชมมวยไทย Live และ VOD' }

// Runs before first paint so English readers never see a flash of Thai.
const hideUntilTranslated = `try{if(localStorage.getItem('${LOCALE_KEY}')==='"en"')document.documentElement.classList.add('i18n-wait')}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={font.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: hideUntilTranslated }} />
      </head>
      <body>
        {children}
        <Translator />
      </body>
    </html>
  )
}
