import type { AppDispatch } from '@/app/store'
import { AuthUserStatus } from '@/shared/api/enums'

import { baseApi } from './baseApi'
import { userApi } from './userApi'
import type {
  BlockUserByManagerRequest,
  ChangeAuthUserRoleRequest,
  ChangePasswordRequest,
  LoginRequest,
  SignupRequest,
  UnlockUserByManagerRequest,
  VerifyUserRequest,
} from './types'

function patchManagedUserStatus(
  dispatch: AppDispatch,
  authUserId: string,
  status: AuthUserStatus,
) {
  return dispatch(
    userApi.util.updateQueryData('getAllUserInfo', undefined, (users) => {
      const user = users.find(
        (item) =>
          item.authUserId === authUserId || item.userProfileId === authUserId,
      )

      if (user) user.status = status
    }),
  )
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUserByManager: builder.mutation<void, BlockUserByManagerRequest>({
      async onQueryStarted({ authUserId }, { dispatch, queryFulfilled }) {
        const patch = authUserId
          ? patchManagedUserStatus(dispatch, authUserId, AuthUserStatus.BLOCKED)
          : undefined

        try {
          await queryFulfilled
        } catch {
          patch?.undo()
        }
      },
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/auth/manager/block-user',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    changeAuthUserRole: builder.mutation<void, ChangeAuthUserRoleRequest>({
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/auth/admin/change-auth-user-role',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/auth/change-password',
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<void, LoginRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/auth/login',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        method: 'DELETE',
        url: '/auth/logout',
      }),
      invalidatesTags: ['Auth', 'User', 'Account', 'Card', 'Transaction'],
    }),
    refresh: builder.mutation<void, void>({
      query: () => ({
        method: 'POST',
        url: '/auth/refresh',
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: builder.mutation<void, SignupRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: '/auth/signup',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    unlockUserByManager: builder.mutation<void, UnlockUserByManagerRequest>({
      async onQueryStarted({ authUserId }, { dispatch, queryFulfilled }) {
        const patch = authUserId
          ? patchManagedUserStatus(dispatch, authUserId, AuthUserStatus.ACTIVE)
          : undefined

        try {
          await queryFulfilled
        } catch {
          patch?.undo()
        }
      },
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/auth/manager/unlock-user',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    verifyUser: builder.mutation<void, VerifyUserRequest>({
      query: (body) => ({
        body,
        method: 'PUT',
        url: '/auth/verify-user',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    verifyUserByManager: builder.mutation<void, string>({
      async onQueryStarted(authUserId, { dispatch, queryFulfilled }) {
        const patch = patchManagedUserStatus(
          dispatch,
          authUserId,
          AuthUserStatus.ACTIVE,
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      query: (authUserId) => ({
        method: 'PUT',
        url: `/auth/manager/verify-user/${authUserId}`,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
})

export const {
  useBlockUserByManagerMutation,
  useChangeAuthUserRoleMutation,
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useSignupMutation,
  useUnlockUserByManagerMutation,
  useVerifyUserByManagerMutation,
  useVerifyUserMutation,
} = authApi
