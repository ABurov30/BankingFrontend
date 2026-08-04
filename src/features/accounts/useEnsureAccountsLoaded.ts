import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setAccounts, selectAccountsInitialized } from './accountsSlice'
import {
  selectCardsInitialized,
  setCardsFromAccounts,
} from '@/features/cards/cardsSlice'
import { useGetAccountsWithCardsByOwnerIdQuery } from '@/shared/api/accountApi'

/** Loads the shared accounts/cards snapshot once per authenticated session. */
export function useEnsureAccountsLoaded(ownerUserId?: string) {
  const dispatch = useAppDispatch()
  const areAccountsInitialized = useAppSelector(selectAccountsInitialized)
  const areCardsInitialized = useAppSelector(selectCardsInitialized)
  const shouldLoad =
    Boolean(ownerUserId) && (!areAccountsInitialized || !areCardsInitialized)
  const query = useGetAccountsWithCardsByOwnerIdQuery(
    shouldLoad ? ownerUserId! : skipToken,
  )

  // A cached RTK Query response may be reused after the Redux slices are reset.
  // Synchronize it explicitly so the slices remain the page data source.
  useEffect(() => {
    if (shouldLoad && query.data) {
      dispatch(setAccounts(query.data))
      dispatch(setCardsFromAccounts(query.data))
    }
  }, [dispatch, query.data, shouldLoad])

  return {
    ...query,
    isInitialLoading: shouldLoad && query.isFetching,
  }
}
