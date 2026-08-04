import { invalidateAccounts } from '@/features/accounts/accountsSlice'
import {
  syncAccountUpdate,
  syncAccountsSnapshot,
} from '@/features/accounts/syncAccounts'

import { baseApi } from './baseApi'
import type { RootState } from '@/app/store'
import type {
  CreateAccountRequest,
  CreateAccountResponse,
  GetAccountsWithCardsByOwnerIdResponse,
  GetAllAccountsWithCardsResponse,
  UpdateAccountBalanceRequest,
  UpdateAccountBalanceResponse,
} from './types'

type AccountActionArgs = {
  accountId: string
  ownerUserId?: string
}

async function refreshAccounts({
  dispatch,
  ownerUserId,
}: {
  dispatch: typeof import('@/app/store').store.dispatch
  ownerUserId?: string
}) {
  if (!ownerUserId) return

  const request = dispatch(
    accountApi.endpoints.getAccountsWithCardsByOwnerId.initiate(ownerUserId, {
      forceRefetch: true,
    }),
  )

  try {
    await request.unwrap()
  } finally {
    request.unsubscribe()
  }
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation<
      CreateAccountResponse,
      CreateAccountRequest
    >({
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshAccounts({
            dispatch,
            ownerUserId: (getState() as RootState).user.currentUser
              ?.userProfileId,
          })
        } catch {
          // The mutation error is exposed to the caller.
        }
      },
      query: (body) => ({
        body,
        method: 'POST',
        url: '/account/create',
      }),
      invalidatesTags: ['Account'],
    }),
    topUpAccount: builder.mutation<
      UpdateAccountBalanceResponse,
      UpdateAccountBalanceRequest
    >({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          syncAccountUpdate(dispatch, data)
        } catch {
          // RTK Query exposes the failed mutation to the caller.
        }
      },
      query: (body) => ({
        body,
        method: 'POST',
        url: '/account/topUp',
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    withdrawAccount: builder.mutation<
      UpdateAccountBalanceResponse,
      UpdateAccountBalanceRequest
    >({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          syncAccountUpdate(dispatch, data)
        } catch {
          // RTK Query exposes the failed mutation to the caller.
        }
      },
      query: (body) => ({
        body,
        method: 'POST',
        url: '/account/withdraw',
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    freezeAccount: builder.mutation<void, AccountActionArgs>({
      async onQueryStarted({ ownerUserId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshAccounts({ dispatch, ownerUserId })
        } catch {
          // The mutation error is exposed to the caller.
        }
      },
      query: ({ accountId }) => ({
        method: 'PUT',
        url: `/account/freeze/${accountId}`,
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    unfreezeAccount: builder.mutation<void, AccountActionArgs>({
      async onQueryStarted({ ownerUserId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshAccounts({ dispatch, ownerUserId })
        } catch {
          // The mutation error is exposed to the caller.
        }
      },
      query: ({ accountId }) => ({
        method: 'PUT',
        url: `/account/unfreeze/${accountId}`,
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    getAccountsWithCardsByOwnerId: builder.query<
      GetAccountsWithCardsByOwnerIdResponse,
      string
    >({
      async onQueryStarted(
        ownerUserId,
        { dispatch, getState, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled
          const currentUser = (getState() as RootState).user.currentUser

          if (currentUser?.userProfileId === ownerUserId) {
            syncAccountsSnapshot(dispatch, data)
          }
        } catch {
          // Keep the previous redux state until a successful refetch replaces it.
        }
      },
      query: (ownerUserId) => `/account/accounts/${ownerUserId}`,
      providesTags: ['Account', 'Card'],
    }),
    getAllAccountsWithCards: builder.query<
      GetAllAccountsWithCardsResponse,
      void
    >({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          syncAccountsSnapshot(dispatch, data)
        } catch {
          // Keep the previous redux state until a successful refetch replaces it.
        }
      },
      query: () => '/account/manager/all-accounts',
      providesTags: ['Account', 'Card'],
    }),
  }),
})

export const {
  useCreateAccountMutation,
  useFreezeAccountMutation,
  useGetAccountsWithCardsByOwnerIdQuery,
  useGetAllAccountsWithCardsQuery,
  useLazyGetAccountsWithCardsByOwnerIdQuery,
  useTopUpAccountMutation,
  useUnfreezeAccountMutation,
  useWithdrawAccountMutation,
} = accountApi
