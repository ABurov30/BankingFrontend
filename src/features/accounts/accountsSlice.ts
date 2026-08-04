import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type {
  GetAccountResponseDto,
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'

type AccountsState = {
  isInitialized: boolean
  items: GetAccountWithCardsResponseDto[]
}

const initialState: AccountsState = {
  isInitialized: false,
  items: [],
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccounts(state) {
      state.isInitialized = false
      state.items = []
    },
    invalidateAccounts(state) {
      state.isInitialized = false
    },
    setAccounts(
      state,
      action: PayloadAction<GetAccountWithCardsResponseDto[]>,
    ) {
      state.isInitialized = true
      state.items = action.payload
    },
    updateAccount(state, action: PayloadAction<GetAccountResponseDto>) {
      const updatedAccount = action.payload

      state.items = state.items.map((accountWithCards) =>
        accountWithCards.account?.accountId === updatedAccount.accountId
          ? {
              ...accountWithCards,
              account: { ...accountWithCards.account, ...updatedAccount },
            }
          : accountWithCards,
      )
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

export const {
  clearAccounts,
  invalidateAccounts,
  setAccounts,
  updateAccount,
  updateAccountCard,
} = accountsSlice.actions
export const selectAccounts = (state: RootState) => state.accounts.items
export const selectAccountsInitialized = (state: RootState) =>
  state.accounts.isInitialized
export default accountsSlice.reducer
