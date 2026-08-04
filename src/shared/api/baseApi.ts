import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? '/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

function getRequestUrl(args: string | FetchArgs) {
  return typeof args === 'string' ? args : args.url
}

function shouldTryRefresh(args: string | FetchArgs) {
  const url = getRequestUrl(args)
  return !['/auth/login', '/auth/logout', '/auth/refresh'].includes(url)
}

function redirectToLogin(api: Parameters<typeof rawBaseQuery>[1]) {
  api.dispatch({ type: 'accounts/clearAccounts' })
  api.dispatch({ type: 'cards/clearCards' })
  api.dispatch({ type: 'user/clearCurrentUser' })

  if (window.location.pathname !== '/login') {
    window.location.replace('/login')
  }
}

const baseQueryWithUnauthorizedRedirect: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && shouldTryRefresh(args)) {
    const refreshResult = await rawBaseQuery(
      {
        method: 'POST',
        url: '/auth/refresh',
      },
      api,
      extraOptions,
    )

    if (!refreshResult.error) {
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      redirectToLogin(api)
    }
  } else if (result.error?.status === 401) {
    redirectToLogin(api)
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithUnauthorizedRedirect,
  tagTypes: [
    'Auth',
    'User',
    'Account',
    'Card',
    'Transaction',
    'Notification',
    'Health',
  ],
  endpoints: () => ({}),
})
