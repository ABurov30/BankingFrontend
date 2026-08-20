import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api'

export function getApiEndpointUrl(path: `/${string}`) {
  const baseUrl = apiBaseUrl.endsWith('/')
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl

  return `${baseUrl}${path}`
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
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

function isCurrentUserInfoRequest(args: string | FetchArgs) {
  return getRequestUrl(args) === '/user/user-info'
}

type ApiRequest = string | FetchArgs
type ApiBaseQuery = BaseQueryFn<ApiRequest, unknown, FetchBaseQueryError>
type SessionExpiredHandler = (api: BaseQueryApi) => void

function redirectToLogin(api: BaseQueryApi) {
  api.dispatch({ type: 'accounts/clearAccounts' })
  api.dispatch({ type: 'cards/clearCards' })
  api.dispatch({ type: 'user/clearCurrentUser' })

  if (window.location.pathname !== '/login') {
    window.location.replace('/login')
  }
}

/**
 * Creates a query wrapper that lets concurrent 401 responses share one refresh
 * request. Each original request is retried once after a successful refresh.
 */
export function createBaseQueryWithAuthRecovery(
  query: ApiBaseQuery,
  onSessionExpired: SessionExpiredHandler = redirectToLogin,
): ApiBaseQuery {
  let refreshPromise: Promise<boolean> | null = null
  let sessionExpiryHandled = false

  const handleSessionExpired = (api: BaseQueryApi) => {
    if (sessionExpiryHandled) return

    sessionExpiryHandled = true
    onSessionExpired(api)
  }

  const refreshSession = (
    api: BaseQueryApi,
    extraOptions: Record<string, unknown>,
  ) => {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const result = await query(
            {
              method: 'POST',
              url: '/auth/refresh',
            },
            api,
            extraOptions,
          )

          return !result.error
        } catch {
          return false
        } finally {
          refreshPromise = null
        }
      })()
    }

    return refreshPromise
  }

  return async (args, api, extraOptions) => {
    let result = await query(args, api, extraOptions)

    if (!result.error) {
      sessionExpiryHandled = false
    }

    if (result.error?.status === 401 && shouldTryRefresh(args)) {
      const isSessionRefreshed = await refreshSession(api, extraOptions)

      if (isSessionRefreshed) {
        result = await query(args, api, extraOptions)
        if (!result.error) {
          sessionExpiryHandled = false
        }
      } else {
        handleSessionExpired(api)
      }
    }

    if (result.error && isCurrentUserInfoRequest(args)) {
      handleSessionExpired(api)
    } else if (result.error?.status === 401) {
      handleSessionExpired(api)
    }

    return result
  }
}

const baseQueryWithUnauthorizedRedirect =
  createBaseQueryWithAuthRecovery(rawBaseQuery)

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
