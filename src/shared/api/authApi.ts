import { baseApi } from './baseApi'
import type { LoginRequest, SignupRequest } from './types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/auth/login',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    signup: builder.mutation<void, SignupRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/auth/signup',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
})

export const { useLoginMutation, useSignupMutation } = authApi
