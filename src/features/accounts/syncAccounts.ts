import type { AppDispatch } from '@/app/store'
import type {
  GetAccountResponseDto,
  GetAccountsWithCardsByOwnerIdResponse,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { setAccounts, updateAccount, updateAccountCard } from './accountsSlice'
import {
  setCardsFromAccounts,
  updateCardAccount,
} from '@/features/cards/cardsSlice'

/** Keeps the account and card projections in Redux in sync with an API snapshot. */
export function syncAccountsSnapshot(
  dispatch: AppDispatch,
  accounts: GetAccountsWithCardsByOwnerIdResponse,
) {
  dispatch(setAccounts(accounts))
  dispatch(setCardsFromAccounts(accounts))
}

export function syncAccountUpdate(
  dispatch: AppDispatch,
  account: GetAccountResponseDto,
) {
  dispatch(updateAccount(account))
  dispatch(updateCardAccount(account))
}

export function syncCardUpdate(
  dispatch: AppDispatch,
  card: GetCardByAccountIdResponseDto,
) {
  dispatch(updateAccountCard(card))
}
