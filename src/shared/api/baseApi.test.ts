import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { describe, expect, it, vi } from 'vitest'

import { createBaseQueryWithAuthRecovery } from './baseApi'

type Request = string | FetchArgs
type Query = BaseQueryFn<Request, unknown, FetchBaseQueryError>

const api = {
  abort: vi.fn(),
  dispatch: vi.fn(),
  endpoint: 'test',
  extra: undefined,
  forced: false,
  getState: () => ({}),
  signal: new AbortController().signal,
  type: 'query',
} as unknown as BaseQueryApi

function getUrl(request: Request) {
  return typeof request === 'string' ? request : request.url
}

function unauthorizedResult() {
  return { error: { status: 401 } as FetchBaseQueryError }
}

function serverErrorResult() {
  return { error: { status: 500 } as FetchBaseQueryError }
}

function notFoundResult() {
  return { error: { status: 404 } as FetchBaseQueryError }
}

describe('createBaseQueryWithAuthRecovery', () => {
  it('shares one refresh request across concurrent unauthorized requests', async () => {
    let refreshCalls = 0
    const attempts = new Map<string, number>()
    const query: Query = async (request) => {
      const url = getUrl(request)

      if (url === '/auth/refresh') {
        refreshCalls += 1
        await Promise.resolve()
        return { data: undefined }
      }

      const attempt = (attempts.get(url) ?? 0) + 1
      attempts.set(url, attempt)
      return attempt === 1 ? unauthorizedResult() : { data: { url } }
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    const [first, second] = await Promise.all([
      recoveredQuery('/account/one', api, {}),
      recoveredQuery('/account/two', api, {}),
    ])

    expect(refreshCalls).toBe(1)
    expect(first).toEqual({ data: { url: '/account/one' } })
    expect(second).toEqual({ data: { url: '/account/two' } })
    expect(onSessionExpired).not.toHaveBeenCalled()
  })

  it('handles an unsuccessful shared refresh only once', async () => {
    let refreshCalls = 0
    const query: Query = async (request) => {
      if (getUrl(request) === '/auth/refresh') {
        refreshCalls += 1
        return unauthorizedResult()
      }

      return unauthorizedResult()
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    await Promise.all([
      recoveredQuery('/account/one', api, {}),
      recoveredQuery('/account/two', api, {}),
    ])

    expect(refreshCalls).toBe(1)
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('does not refresh an unauthorized refresh request', async () => {
    const query: Query = async () => unauthorizedResult()
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    await recoveredQuery('/auth/refresh', api, {})

    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('redirects to login without refresh when current user info returns server error', async () => {
    let refreshCalls = 0
    const query: Query = async (request) => {
      if (getUrl(request) === '/auth/refresh') {
        refreshCalls += 1
        return { data: undefined }
      }

      return serverErrorResult()
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    await recoveredQuery('/user/user-info', api, {})

    expect(refreshCalls).toBe(0)
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('redirects to login without refresh when current user info returns not found', async () => {
    let refreshCalls = 0
    const query: Query = async (request) => {
      if (getUrl(request) === '/auth/refresh') {
        refreshCalls += 1
        return { data: undefined }
      }

      return notFoundResult()
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    await recoveredQuery('/user/user-info', api, {})

    expect(refreshCalls).toBe(0)
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('redirects to login when refreshed current user info still returns server error', async () => {
    let refreshCalls = 0
    let userInfoCalls = 0
    const query: Query = async (request) => {
      const url = getUrl(request)

      if (url === '/auth/refresh') {
        refreshCalls += 1
        return { data: undefined }
      }

      if (url === '/user/user-info') {
        userInfoCalls += 1
        return userInfoCalls === 1 ? unauthorizedResult() : serverErrorResult()
      }

      return { data: undefined }
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    await recoveredQuery('/user/user-info', api, {})

    expect(refreshCalls).toBe(1)
    expect(userInfoCalls).toBe(2)
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('keeps the session when refreshed current user info succeeds', async () => {
    let refreshCalls = 0
    let userInfoCalls = 0
    const query: Query = async (request) => {
      const url = getUrl(request)

      if (url === '/auth/refresh') {
        refreshCalls += 1
        return { data: undefined }
      }

      if (url === '/user/user-info') {
        userInfoCalls += 1
        return userInfoCalls === 1
          ? unauthorizedResult()
          : { data: { userProfileId: 'user-1' } }
      }

      return { data: undefined }
    }
    const onSessionExpired = vi.fn()
    const recoveredQuery = createBaseQueryWithAuthRecovery(
      query,
      onSessionExpired,
    )

    const result = await recoveredQuery('/user/user-info', api, {})

    expect(refreshCalls).toBe(1)
    expect(userInfoCalls).toBe(2)
    expect(result).toEqual({ data: { userProfileId: 'user-1' } })
    expect(onSessionExpired).not.toHaveBeenCalled()
  })
})
