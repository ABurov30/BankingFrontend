import { baseApi } from './baseApi'
import type {
  GetAllUserInfoWithAuthInfoResponse,
  GetUserInfoByManagerResponse,
  GetUserInfoWithAuthInfoResponse,
  UserInfo,
} from './types'

function normalizeUser(response: GetUserInfoWithAuthInfoResponse): UserInfo {
  const { role, status, userInfo } = response

  return {
    ...userInfo,
    authUserId: userInfo?.autUserId,
    role,
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
    getUserInfoByManager: builder.query<UserInfo, { authUserId: string }>({
      query: ({ authUserId }) => `/user/manager/user-info/${authUserId}`,
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
} = userApi
