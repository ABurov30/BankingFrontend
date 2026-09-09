import { baseApi } from './baseApi'
import type {
  GetAllUserInfoWithAuthInfoResponse,
  GetUserInfoByManagerResponse,
  GetRecipientInfoRequest,
  GetRecipientInfoResponse,
  GetUserInfoWithAuthInfoResponse,
  UserInfo,
} from './types'

function normalizeUser(response: GetUserInfoWithAuthInfoResponse): UserInfo {
  const { role, socialAccounts, status, userInfo } = response

  return {
    ...userInfo,
    authUserId: userInfo?.autUserId,
    role,
    socialAccounts,
    status,
  }
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserInfo: builder.query<UserInfo[], void>({
      query: () => '/user/manager/all-user-info',
      providesTags: ['User'],
      transformResponse: (response: GetAllUserInfoWithAuthInfoResponse) =>
        response.map(normalizeUser),
    }),
    getUserInfo: builder.query<UserInfo, void>({
      query: () => '/user/user-info',
      providesTags: ['User'],
      transformResponse: normalizeUser,
    }),
    getRecipientInfo: builder.mutation<
      GetRecipientInfoResponse,
      GetRecipientInfoRequest
    >({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/user/recipient-info',
      }),
    }),
    getUserInfoByManager: builder.query<UserInfo, { userId: string }>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/user/manager/user-info',
      }),
      providesTags: ['User'],
      transformResponse: (response: GetUserInfoByManagerResponse) =>
        normalizeUser(response),
    }),
  }),
})

export const {
  useGetAllUserInfoQuery,
  useGetUserInfoByManagerQuery,
  useGetUserInfoQuery,
  useGetRecipientInfoMutation,
} = userApi
