import { baseApi } from './baseApi'
import type { GetAllUserInfoResponse, GetUserInfoResponse } from './types'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserInfo: builder.query<GetAllUserInfoResponse, void>({
      query: () => '/user/manager/all-userinfo',
      providesTags: ['User'],
    }),
    getUserInfo: builder.query<GetUserInfoResponse, void>({
      query: () => '/user/userInfo',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetAllUserInfoQuery, useGetUserInfoQuery } = userApi
