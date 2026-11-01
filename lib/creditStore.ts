import { fighterByName } from './fighters'
import { createMockStore } from './mockStore'
import { creditLedger, Gift, LedgerEntry } from './mock'

// One ledger drives the Live page, the profile, and BOF, so balance and history always agree.
const store = createMockStore<LedgerEntry[]>('ringside-mock-ledger-v2', creditLedger)

export const useLedger = store.use

export const balanceOf = (ledger: LedgerEntry[]) => ledger.at(-1)?.balance ?? 0

export function spendCredit(gift: Gift, to: string, eventId: string) {
  const ledger = store.get()
  const time = `${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`
  store.set([
    ...ledger,
    {
      id: `TX-${Date.now()}`,
      time,
      label: `ส่ง${gift.name}ให้ ${to}`,
      change: -gift.credit,
      balance: balanceOf(ledger) - gift.credit,
      gift: gift.name,
      fighter: to,
      to: fighterByName(to)?.camp ?? to,
      eventId,
    },
  ])
}
