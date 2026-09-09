import { invalidateAccounts } from '@/features/accounts/accountsSlice'

import { accountApi } from './accountApi'
import { baseApi } from './baseApi'
import type {
  CreateTransactionRequest,
  CreateTransactionResponseDto,
  GetTransactionsByMeResponse,
} from './types'

async function refreshOwnAccounts({ dispatch }: {
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

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query<GetTransactionsByMeResponse, void>({
      query: () => '/transaction/user/me',
      providesTags: ['Transaction'],
    }),
    createTransaction: builder.mutation<
      CreateTransactionResponseDto,
      CreateTransactionRequest
    >({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
          await refreshOwnAccounts({ dispatch })
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

export const { useCreateTransactionMutation, useGetMyTransactionsQuery } =
  transactionApi
