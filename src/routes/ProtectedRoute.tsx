import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { PageLoader } from '@/components/PageLoader'
import { clearCurrentUser, setCurrentUser } from '@/features/user/userSlice'
import { useGetUserInfoQuery } from '@/shared/api/userApi'

export function ProtectedRoute() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: user, error, isLoading } = useGetUserInfoQuery()

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

  if (isLoading) {
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
