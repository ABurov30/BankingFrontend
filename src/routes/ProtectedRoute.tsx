import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { PageLoader } from '@/components/PageLoader'
import {
  clearCurrentUser,
  selectCurrentUser,
  setCurrentUser,
} from '@/features/user/userSlice'
import { useGetUserInfoQuery } from '@/shared/api/userApi'

export function ProtectedRoute() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const currentUser = useAppSelector(selectCurrentUser)
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserInfoQuery(undefined, { skip: Boolean(currentUser) })

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user))
    }
  }, [dispatch, user])

  useEffect(() => {
    if (isUnauthorizedError(error)) {
      dispatch(clearCurrentUser())
    }
  }, [dispatch, error])

  if (!currentUser && isLoading) {
    return <PageLoader />
  }

  if (isUnauthorizedError(error)) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

function isUnauthorizedError(error: unknown): error is FetchBaseQueryError {
  return isFetchBaseQueryError(error) && error.status === 401
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}
