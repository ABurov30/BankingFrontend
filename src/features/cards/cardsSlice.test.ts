import { describe, expect, it } from 'vitest'

import reducer, {
  clearCards,
  setCardsFromAccounts,
  updateCard,
} from './cardsSlice'

const accounts = [
  {
    account: { accountId: 'account-1' },
    cards: [
      { cardId: 'card-1', status: 'ACTIVE' as const },
      { cardId: 'card-2', status: 'BLOCKED' as const },
    ],
  },
]

describe('cardsSlice', () => {
  it('derives card entries from accounts', () => {
    const state = reducer(undefined, setCardsFromAccounts(accounts))

    expect(state.isInitialized).toBe(true)
    expect(state.items).toHaveLength(2)
    expect(state.items[0].account).toEqual(accounts[0])
  })

  it('updates a card and clears the snapshot', () => {
    const loaded = reducer(undefined, setCardsFromAccounts(accounts))
    const updated = reducer(
      loaded,
      updateCard({ cardId: 'card-2', status: 'FROZEN' }),
    )

    expect(updated.items[1].card.status).toBe('FROZEN')
    expect(reducer(updated, clearCards())).toEqual({
      isInitialized: false,
      items: [],
    })
  })
})
