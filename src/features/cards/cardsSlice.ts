import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'

export type CardWithAccount = {
  account: GetAccountWithCardsResponseDto
  card: GetCardByAccountIdResponseDto
}

type CardsState = {
  items: CardWithAccount[]
}

const initialState: CardsState = {
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
      state.items = []
    },
    setCardsFromAccounts(
      state,
      action: PayloadAction<GetAccountWithCardsResponseDto[]>,
    ) {
      state.items = mapCards(action.payload)
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

export const { clearCards, setCardsFromAccounts, updateCard } =
  cardsSlice.actions
export const selectCards = (state: RootState) => state.cards.items
export default cardsSlice.reducer
