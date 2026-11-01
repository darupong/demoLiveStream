import { createMockStore } from './mockStore'

// Remembers whether the viewer collapsed the left rail to icons.
const collapsed = createMockStore<boolean>('ringside-rail-collapsed-v1', false)

export const useRailCollapsed = collapsed.use
export const setRailCollapsed = collapsed.set
