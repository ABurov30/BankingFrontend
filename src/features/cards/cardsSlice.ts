import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type {
  GetAccountResponseDto,
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'

export type CardWithAccount = {
  account: GetAccountWithCardsResponseDto
  card: GetCardByAccountIdResponseDto
}

type CardsState = {
  isInitialized: boolean
  items: CardWithAccount[]
}

const initialState: CardsState = {
  isInitialized: false,
  items: [],
}

function mapCards(accounts: GetAccountWithCardsResponseDto[]) {
  return accounts.flatMap((account) =>
    (account.cards ?? []).map((card) => ({
      account,
      card,
    })),
  )
}

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    clearCards(state) {
      state.isInitialized = false
      state.items = []
    },
    setCardsFromAccounts(
      state,
      action: PayloadAction<GetAccountWithCardsResponseDto[]>,
    ) {
      state.isInitialized = true
      state.items = mapCards(action.payload)
    },
    updateCardAccount(state, action: PayloadAction<GetAccountResponseDto>) {
      const updatedAccount = action.payload

      state.items = state.items.map((item) =>
        item.account.account?.accountId === updatedAccount.accountId
          ? {
              ...item,
              account: {
                ...item.account,
                account: { ...item.account.account, ...updatedAccount },
              },
            }
          : item,
      )
    },
    updateCard(state, action: PayloadAction<GetCardByAccountIdResponseDto>) {
      const updatedCard = action.payload

      state.items = state.items.map((item) =>
        item.card.cardId === updatedCard.cardId
          ? { ...item, card: { ...item.card, ...updatedCard } }
          : item,
      )
    },
  },
})

export const {
  clearCards,
  setCardsFromAccounts,
  updateCard,
  updateCardAccount,
} = cardsSlice.actions
export const selectCards = (state: RootState) => state.cards.items
export const selectCardsInitialized = (state: RootState) =>
  state.cards.isInitialized
export default cardsSlice.reducer
