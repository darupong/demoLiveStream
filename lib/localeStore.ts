import { createMockStore } from './mockStore'
import { LOCALE_KEY } from './translations'

export type Locale = 'th' | 'en'

const store = createMockStore<Locale>(LOCALE_KEY, 'th')

export const useLocale = store.use
export const setLocale = store.set
