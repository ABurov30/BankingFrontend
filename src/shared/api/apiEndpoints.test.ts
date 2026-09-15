import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { store } from '@/app/store'
import { baseApi } from './baseApi'
import { accountApi } from './accountApi'
import { authApi } from './authApi'
import { cardApi } from './cardApi'
import { healthApi } from './healthApi'
import { notificationApi } from './notificationApi'
import { transactionApi } from './transactionApi'
import { userApi } from './userApi'

const userResponse = {
  role: 'USER',
  socialAccounts: [],
  status: 'ACTIVE',
  userInfo: { autUserId: 'auth-1', userProfileId: 'profile-1' },
}

function responseFor(url: string) {
  if (url.endsWith('/user/user-info')) return userResponse
  if (url.includes('/user/manager/user-info')) return userResponse
  if (url.includes('/user/manager/all-user-info')) return []
  if (url.includes('/account/')) return []
  if (url.includes('/transaction/user/me')) return []
  if (url.includes('/notification/notifications')) return []
  return {}
}

async function run(
  endpoint: { initiate: (arg: never) => unknown },
  arg: unknown,
) {
  return (
    store.dispatch(endpoint.initiate(arg as never) as never) as {
      unwrap: () => Promise<unknown>
    }
  ).unwrap()
}

describe('RTK Query endpoint contracts', () => {
  beforeEach(() => {
    const NativeRequest = globalThis.Request
    vi.stubGlobal(
      'Request',
      class TestRequest extends NativeRequest {
        constructor(input: RequestInfo | URL, init?: RequestInit) {
          super(
            typeof input === 'string' && input.startsWith('/')
              ? `http://localhost:5173${input}`
              : input,
            init,
          )
        }
      },
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = input instanceof Request ? input.url : String(input)
        return new Response(JSON.stringify(responseFor(url)), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        })
      }),
    )
  })

  afterEach(() => {
    store.dispatch(baseApi.util.resetApiState())
    vi.unstubAllGlobals()
  })

  it('executes authentication endpoints with their request contracts', async () => {
    await run(authApi.endpoints.login, {
      email: 'test@example.com',
      password: 'secret',
    })
    await run(authApi.endpoints.logout, undefined)
    await run(authApi.endpoints.refresh, undefined)
    await run(authApi.endpoints.signup, { email: 'new@example.com' })
    await run(authApi.endpoints.changePassword, {
      oldPassword: 'old',
      newPassword: 'new',
    })
    await run(authApi.endpoints.changeAuthUserRole, {
      authUserId: 'auth-1',
      role: 'USER',
    })
    await run(authApi.endpoints.blockUserByManager, { authUserId: 'auth-1' })
    await run(authApi.endpoints.unlockUserByManager, { authUserId: 'auth-1' })
    await run(authApi.endpoints.verifyUser, {
      authUserId: 'auth-1',
      verificationCode: 'code',
    })
    await run(authApi.endpoints.verifyUserByManager, 'auth-1')

    expect(globalThis.fetch).toHaveBeenCalled()
  })

  it('executes account, card and transaction endpoints', async () => {
    await run(accountApi.endpoints.getOwnAccountsWithCards, undefined)
    await run(accountApi.endpoints.getAccountsWithCardsByOwnerId, 'profile-1')
    await run(accountApi.endpoints.getAllAccountsWithCards, undefined)
    await run(accountApi.endpoints.createAccount, {
      currency: 'USD',
      type: 'CHECKING',
    })
    await run(accountApi.endpoints.topUpAccount, {
      accountId: 'account-1',
      amount: 100,
    })
    await run(accountApi.endpoints.withdrawAccount, {
      accountId: 'account-1',
      amount: 25,
    })
    await run(accountApi.endpoints.freezeAccount, { accountId: 'account-1' })
    await run(accountApi.endpoints.unfreezeAccount, { accountId: 'account-1' })
    await run(accountApi.endpoints.freezeAccountByManager, {
      accountId: 'account-1',
    })
    await run(accountApi.endpoints.unfreezeAccountByManager, {
      accountId: 'account-1',
    })
    await run(cardApi.endpoints.createCard, { accountId: 'account-1' })
    await run(cardApi.endpoints.updateCard, {
      accountId: 'account-1',
      cardId: 'card-1',
    })
    await run(transactionApi.endpoints.getMyTransactions, undefined)
    await run(transactionApi.endpoints.createTransaction, {
      sourceCardId: 'card-1',
    })

    expect(globalThis.fetch).toHaveBeenCalled()
  })

  it('executes user, notification and health endpoints', async () => {
    const user = await run(userApi.endpoints.getUserInfo, undefined)
    expect(user).toMatchObject({ authUserId: 'auth-1', role: 'USER' })
    await run(userApi.endpoints.getAllUserInfo, undefined)
    await run(userApi.endpoints.getUserInfoByManager, { userId: 'auth-1' })
    await run(userApi.endpoints.getRecipientInfo, {
      email: 'recipient@example.com',
    })
    await run(notificationApi.endpoints.getNotifications, undefined)
    await run(notificationApi.endpoints.markNotificationsAsReaded, {
      notificationIds: [],
    })
    const health = await run(healthApi.endpoints.getServiceHealth, undefined)

    expect(Object.keys(health as object)).toHaveLength(6)
  })
})
