import { describe, expect, it, vi } from 'vitest'

import {
  syncAccountUpdate,
  syncAccountsSnapshot,
  syncCardUpdate,
} from './syncAccounts'

describe('account and card synchronization', () => {
  it('dispatches both projections for an accounts snapshot', () => {
    const dispatch = vi.fn()
    const snapshot = [{ account: { accountId: 'account-1' }, cards: [] }]

    syncAccountsSnapshot(dispatch, snapshot)

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[0][0].type).toBe('accounts/setAccounts')
    expect(dispatch.mock.calls[1][0].type).toBe('cards/setCardsFromAccounts')
  })

  it('dispatches account and card updates', () => {
    const dispatch = vi.fn()
    const account = { accountId: 'account-1', balance: 100 }
    const card = { cardId: 'card-1', status: 'FROZEN' as const }

    syncAccountUpdate(dispatch, account)
    syncCardUpdate(dispatch, card)

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'accounts/updateAccount',
      'cards/updateCardAccount',
      'accounts/updateAccountCard',
    ])
  })
})
