import { describe, expect, it } from 'vitest'

import reducer, {
  clearAccounts,
  invalidateAccounts,
  setAccounts,
  updateAccountCard,
} from './accountsSlice'

const accounts = [
  {
    account: { accountId: 'account-1', accountNumber: '1000' },
    cards: [{ cardId: 'card-1', status: 'ACTIVE' as const }],
  },
]

describe('accountsSlice', () => {
  it('stores account snapshots and resets initialization when invalidated', () => {
    const loaded = reducer(undefined, setAccounts(accounts))
    expect(loaded).toMatchObject({ isInitialized: true, items: accounts })
    expect(reducer(loaded, invalidateAccounts()).isInitialized).toBe(false)
    expect(reducer(loaded, clearAccounts())).toEqual({
      isInitialized: false,
      items: [],
    })
  })

  it('updates a nested card without changing the other account data', () => {
    const loaded = reducer(undefined, setAccounts(accounts))
    const updated = reducer(
      loaded,
      updateAccountCard({ cardId: 'card-1', status: 'FROZEN' }),
    )

    expect(updated.items[0].cards?.[0].status).toBe('FROZEN')
  })
})
