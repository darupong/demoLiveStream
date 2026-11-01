'use client'

import { useEffect, useState } from 'react'

// Ticks once a second. Starts null so the server and first client render match.
export function useNow() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}
