import { invalidateAccounts } from '@/features/accounts/accountsSlice'
import { syncCardUpdate } from '@/features/accounts/syncAccounts'
import { updateCard as updateCardState } from '@/features/cards/cardsSlice'
import { mapCardLimitResponse } from '@/lib/cardLimits'

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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(invalidateAccounts())
        } catch {
          // The mutation error is exposed to the caller.
        }
      },
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
          const card = mapCardLimitResponse(data)
          syncCardUpdate(dispatch, card)
          dispatch(updateCardState(card))
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
