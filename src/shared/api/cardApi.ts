import { updateAccountCard } from '@/features/accounts/accountsSlice'
import { updateCard as updateCardState } from '@/features/cards/cardsSlice'

import { baseApi } from './baseApi'
import type {
  CreateCardRequest,
  CreateCardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
} from './types'

export const cardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCard: builder.mutation<CreateCardResponse, CreateCardRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/card/create',
      }),
      invalidatesTags: ['Account', 'Card'],
    }),
    updateCard: builder.mutation<UpdateCardResponse, UpdateCardRequest>({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateAccountCard(data))
          dispatch(updateCardState(data))
        } catch {
          // RTK Query exposes the failed mutation to the caller.
        }
      },
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/card/update',
      }),
      invalidatesTags: ['Card'],
    }),
  }),
})

export const { useCreateCardMutation, useUpdateCardMutation } = cardApi
