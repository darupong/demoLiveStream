import { createMockStore } from './mockStore'
import { eventProducts, pinnedProducts, products } from './mock'

// Per event: which products appear in that event's shop, and which one is pinned.
type ProductState = { links: Record<string, string[]>; pinned: Record<string, string | undefined> }

const store = createMockStore<ProductState>('ringside-mock-products-v2', { links: eventProducts, pinned: pinnedProducts })

export function useEventProducts(eventId: string) {
  const { links, pinned } = store.use()
  const linked = links[eventId] ?? []
  return { linked, pinnedId: pinned[eventId], shown: products.filter((p) => linked.includes(p.id)) }
}

export function pinProduct(eventId: string, id: string | undefined) {
  const state = store.get()
  store.set({ ...state, pinned: { ...state.pinned, [eventId]: id } })
}

export function toggleProductLink(eventId: string, id: string) {
  const state = store.get()
  const linked = state.links[eventId] ?? []
  const remove = linked.includes(id)
  store.set({
    links: { ...state.links, [eventId]: remove ? linked.filter((x) => x !== id) : [...linked, id] },
    pinned: { ...state.pinned, [eventId]: remove && state.pinned[eventId] === id ? undefined : state.pinned[eventId] },
  })
}
