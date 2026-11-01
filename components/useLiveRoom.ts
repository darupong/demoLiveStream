'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { balanceOf, spendCredit, useLedger } from '@/lib/creditStore'
import { BIG_GIFT_CREDIT, chatSeed, crowdLines, crowdNames, Gift, gifts } from '@/lib/mock'

export type ChatState = 'ok' | 'failed' | 'limited' | 'blocked' | 'guest' | 'no-rights'

export const chatOptions: [ChatState, string][] = [
  ['ok', 'ส่งได้ปกติ'],
  ['failed', 'ส่งไม่สำเร็จ'],
  ['limited', 'ส่งถี่เกินกำหนด'],
  ['blocked', 'ถูกบล็อก'],
  ['guest', 'ยังไม่ Login'],
  ['no-rights', 'ไม่มีสิทธิ์แชท'],
]

export type ChatMessage = { id: number; user: string; text: string; gift?: boolean }
export type GiftBanner = { id: number; user: string; gift: Gift; to: string; count: number; big: boolean; expires: number }
export type Cheer = { id: number; side: 'red' | 'blue'; left: number; expires: number }

const ME = 'ฟ้า'
const BANNER_MS = 3200
const CHEER_MS = 1700
const MAX_MESSAGES = 60
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

// Simulates the room: real sends go through here, and fake viewers keep it busy.
export function useLiveRoom(eventId: string, redName: string, blueName: string, active: boolean, chatState: ChatState) {
  const credit = balanceOf(useLedger())
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed)
  const [banners, setBanners] = useState<GiftBanner[]>([])
  const [floats, setFloats] = useState<Cheer[]>([])
  const [cheers, setCheers] = useState({ red: 1284, blue: 1102 })
  const [error, setError] = useState('')
  const [short, setShort] = useState<Gift | null>(null)
  const nextId = useRef(100)

  const addMessage = useCallback((user: string, text: string, gift = false) => {
    setMessages((list) => [...list.slice(-MAX_MESSAGES), { id: nextId.current++, user, text, gift }])
  }, [])

  const addGift = useCallback((user: string, gift: Gift, to: string) => {
    const expires = Date.now() + BANNER_MS
    setBanners((list) => {
      const same = list.find((b) => b.user === user && b.gift.id === gift.id && b.to === to)
      if (same) return list.map((b) => (b === same ? { ...b, count: b.count + 1, expires } : b))
      return [...list.slice(-2), { id: nextId.current++, user, gift, to, count: 1, big: gift.credit >= BIG_GIFT_CREDIT, expires }]
    })
  }, [])

  const addCheer = useCallback((side: 'red' | 'blue') => {
    setCheers((c) => ({ ...c, [side]: c[side] + 1 }))
    setFloats((list) => [...list.slice(-14), { id: nextId.current++, side, left: Math.random() * 44, expires: Date.now() + CHEER_MS }])
  }, [])

  useEffect(() => {
    if (!active) return
    const chat = setInterval(() => addMessage(pick(crowdNames), pick(crowdLines)), 2300)
    const gift = setInterval(() => {
      const [user, item, to] = [pick(crowdNames), pick(gifts.slice(0, 3)), pick([redName, blueName])]
      addGift(user, item, to)
      addMessage(user, `ส่ง ${item.icon} ${item.name} ให้ ${to}`, true)
    }, 5200)
    const cheer = setInterval(() => addCheer(pick(['red', 'blue'] as const)), 1100)
    return () => {
      clearInterval(chat)
      clearInterval(gift)
      clearInterval(cheer)
    }
  }, [active, redName, blueName, addMessage, addGift, addCheer])

  useEffect(() => setError(''), [chatState])

  useEffect(() => {
    const sweep = setInterval(() => {
      const now = Date.now()
      setBanners((list) => (list.some((b) => b.expires <= now) ? list.filter((b) => b.expires > now) : list))
      setFloats((list) => (list.some((c) => c.expires <= now) ? list.filter((c) => c.expires > now) : list))
    }, 250)
    return () => clearInterval(sweep)
  }, [])

  function send(text: string) {
    const clean = text.trim()
    if (!clean) return false
    if (chatState === 'failed') return setError('ส่งข้อความไม่สำเร็จ กดส่งอีกครั้ง'), false
    if (chatState === 'limited') return setError('ส่งข้อความถี่เกินไป รอ 10 วินาทีแล้วส่งใหม่'), false
    setError('')
    addMessage(ME, clean)
    return true
  }

  function sendGift(gift: Gift, to: string) {
    if (gift.credit > credit) return setShort(gift)
    setShort(null)
    spendCredit(gift, to, eventId)
    addGift(ME, gift, to)
    addMessage(ME, `ส่ง ${gift.icon} ${gift.name} ให้ ${to}`, true)
  }

  return { messages, banners, floats, cheers, credit, error, short, send, sendGift, cheer: addCheer, clearShort: () => setShort(null) }
}

export type LiveRoom = ReturnType<typeof useLiveRoom>
