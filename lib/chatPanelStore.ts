import { createMockStore } from './mockStore'

// Remembers whether the viewer collapsed the chat panel.
const collapsed = createMockStore<boolean>('ringside-chat-collapsed-v1', false)

export const useChatCollapsed = collapsed.use
export const setChatCollapsed = collapsed.set
