import { useSyncExternalStore } from 'react'

// Browser-only state shared between tabs, so a mock action on one page shows on another.
// ponytail: localStorage stand-in, replace with the real API and WebSocket push.
export function createMockStore<T>(key: string, initial: T) {
  let current: T | undefined
  const listeners = new Set<() => void>()

  function load(): T {
    try {
      const saved = localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : initial
    } catch {
      return initial
    }
  }

  function get() {
    current ??= load()
    return current
  }

  function subscribe(listener: () => void) {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      current = load()
      listener()
    }
    listeners.add(listener)
    addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      removeEventListener('storage', onStorage)
    }
  }

  function set(next: T) {
    current = next
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // Private windows can refuse storage; the change still applies to this tab.
    }
    listeners.forEach((l) => l())
  }

  return { get, set, use: () => useSyncExternalStore(subscribe, get, () => initial) }
}
