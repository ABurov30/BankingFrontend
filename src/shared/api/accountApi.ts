import { invalidateAccounts } from '@/features/accounts/accountsSlice'
import {
  syncAccountUpdate,
  syncAccountsSnapshot,
} from '@/features/accounts/syncAccounts'

import { baseApi } from './baseApi'
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
}

async function refreshOwnAccounts({
  dispatch,
}: {
  dispatch: typeof import('@/app/store').store.dispatch
}) {
  const request = dispatch(
    accountApi.endpoints.getOwnAccountsWithCards.initiate(undefined, {
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshOwnAccounts({ dispatch })
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshOwnAccounts({ dispatch })
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshOwnAccounts({ dispatch })
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
    freezeAccountByManager: builder.mutation<void, AccountActionArgs>({
      query: ({ accountId }) => ({
        method: 'PUT',
        url: `/account/manager/freeze/${accountId}`,
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    unfreezeAccountByManager: builder.mutation<void, AccountActionArgs>({
      query: ({ accountId }) => ({
        method: 'PUT',
        url: `/account/manager/unfreeze/${accountId}`,
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    getOwnAccountsWithCards: builder.query<
      GetAccountsWithCardsByOwnerIdResponse,
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
      query: () => '/account/accounts/me',
      providesTags: ['Account', 'Card'],
    }),
    getAccountsWithCardsByOwnerId: builder.query<
      GetAccountsWithCardsByOwnerIdResponse,
      string
    >({
      query: (ownerUserId) => `/account/manager/accounts/${ownerUserId}`,
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
  useFreezeAccountByManagerMutation,
  useGetOwnAccountsWithCardsQuery,
  useGetAccountsWithCardsByOwnerIdQuery,
  useGetAllAccountsWithCardsQuery,
  useLazyGetAccountsWithCardsByOwnerIdQuery,
  useTopUpAccountMutation,
  useUnfreezeAccountMutation,
  useUnfreezeAccountByManagerMutation,
  useWithdrawAccountMutation,
} = accountApi
