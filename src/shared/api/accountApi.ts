import { setAccounts } from '@/features/accounts/accountsSlice'
import { setCardsFromAccounts } from '@/features/cards/cardsSlice'

import { baseApi } from './baseApi'
import type {
  CreateAccountRequest,
  CreateAccountResponse,
  GetAccountsWithCardsByOwnerIdResponse,
  GetAllAccountsWithCardsResponse,
} from './types'

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation<
      CreateAccountResponse,
      CreateAccountRequest
    >({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/account/create',
      }),
      invalidatesTags: ['Account'],
    }),
    freezeAccount: builder.mutation<void, string>({
      query: (accountId) => ({
        method: 'PUT',
        url: `/account/freeze/${accountId}`,
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    getAccountsWithCardsByOwnerId: builder.query<
      GetAccountsWithCardsByOwnerIdResponse,
      string
    >({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAccounts(data))
          dispatch(setCardsFromAccounts(data))
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
          dispatch(setAccounts(data))
          dispatch(setCardsFromAccounts(data))
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
} = accountApi
