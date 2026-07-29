import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'

type AccountsState = {
  items: GetAccountWithCardsResponseDto[]
}

const initialState: AccountsState = {
  items: [],
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccounts(state) {
      state.items = []
    },
    setAccounts(
      state,
      action: PayloadAction<GetAccountWithCardsResponseDto[]>,
    ) {
      state.items = action.payload
    },
    updateAccountCard(
      state,
      action: PayloadAction<GetCardByAccountIdResponseDto>,
    ) {
      const updatedCard = action.payload

      state.items = state.items.map((accountWithCards) => ({
        ...accountWithCards,
        cards: accountWithCards.cards?.map((card) =>
          card.cardId === updatedCard.cardId
            ? { ...card, ...updatedCard }
            : card,
        ),
      }))
    },
  },
})

export const { clearAccounts, setAccounts, updateAccountCard } =
  accountsSlice.actions
export const selectAccounts = (state: RootState) => state.accounts.items
export default accountsSlice.reducer
