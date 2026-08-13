import { invalidateAccounts } from '@/features/accounts/accountsSlice'

import { accountApi } from './accountApi'
import { baseApi } from './baseApi'
import type { RootState } from '@/app/store'
import type {
  CreateTransactionRequest,
  GetTransactionsByUserIdResponse,
} from './types'

async function refreshOwnAccounts({
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

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsByUserId: builder.query<
      GetTransactionsByUserIdResponse,
      string
    >({
      query: (userId) => `/transaction/user/${userId}`,
      providesTags: ['Transaction'],
    }),
    createTransaction: builder.mutation<void, CreateTransactionRequest>({
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshOwnAccounts({
            dispatch,
            ownerUserId: (getState() as RootState).user.currentUser
              ?.userProfileId,
          })
        } catch {
          // RTK Query exposes the failed mutation to the caller.
        }
      },
      query: (body) => ({
        body,
        method: 'POST',
        url: '/transaction/creat-transaction',
      }),
      invalidatesTags: ['Account', 'Card', 'Transaction'],
    }),
  }),
})

export const { useCreateTransactionMutation, useGetTransactionsByUserIdQuery } =
  transactionApi
