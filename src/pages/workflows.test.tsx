import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { store } from '@/app/store'
import { setCurrentUser, clearCurrentUser } from '@/features/user/userSlice'
import { setAccounts } from '@/features/accounts/accountsSlice'
import { setCardsFromAccounts } from '@/features/cards/cardsSlice'
import { renderWithProviders } from '@/test/renderWithProviders'
import DashboardPage from './dashboard/DashboardPage'
import UserPage from './user/UserPage'
import UsersPage from './users/UsersPage'
import UserDetailsPage from './user-details/UserDetailsPage'
import AccountsPage from './accounts/AccountsPage'
import UserVerifyPage from './user-verify/UserVerifyPage'
import type {
  GetAccountWithCardsResponseDto,
  UserInfo,
} from '@/shared/api/types'

const api = vi.hoisted(() => ({
  mutate: vi.fn(),
  refetch: vi.fn(),
  loading: false,
  users: [] as UserInfo[],
  accounts: [] as GetAccountWithCardsResponseDto[],
}))
vi.mock('@/features/accounts/useEnsureAccountsLoaded', () => ({
  useEnsureAccountsLoaded: () => ({ isFetching: api.loading }),
}))
vi.mock('@/shared/api/userApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/userApi')>()),
  useGetAllUserInfoQuery: () => ({ data: api.users, isLoading: api.loading }),
  useGetUserInfoByManagerQuery: () => ({
    data: api.users[0],
    isLoading: api.loading,
  }),
}))
vi.mock('@/shared/api/authApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/authApi')>()),
  useLogoutMutation: () => [api.mutate, {}],
  useBlockUserByManagerMutation: () => [api.mutate, {}],
  useUnlockUserByManagerMutation: () => [api.mutate, {}],
  useVerifyUserByManagerMutation: () => [api.mutate, {}],
  useChangeAuthUserRoleMutation: () => [api.mutate, {}],
  useVerifyUserMutation: () => [api.mutate, {}],
}))
vi.mock('@/shared/api/accountApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/accountApi')>()),
  useGetAccountsWithCardsByOwnerIdQuery: () => ({
    data: api.accounts,
    refetch: api.refetch,
    isFetching: api.loading,
  }),
  useFreezeAccountByManagerMutation: () => [api.mutate, {}],
  useUnfreezeAccountByManagerMutation: () => [api.mutate, {}],
  useCreateAccountMutation: () => [api.mutate, {}],
  useFreezeAccountMutation: () => [api.mutate, {}],
  useUnfreezeAccountMutation: () => [api.mutate, {}],
}))
vi.mock('@/shared/api/cardApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/cardApi')>()),
  useUpdateCardMutation: () => [api.mutate, {}],
}))
const user: UserInfo = {
  authUserId: 'auth-1',
  userProfileId: 'profile-1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.test',
  role: 'ADMIN',
  status: 'ACTIVE',
}
const accounts: GetAccountWithCardsResponseDto[] = [
  {
    account: {
      accountId: 'a1',
      accountNumber: '111111',
      currency: 'USD',
      status: 'ACTIVE',
      type: 'CHECKING',
      availableBalanceMinorUnits: 50000,
    },
    cards: [
      {
        cardId: 'c1',
        accountId: 'a1',
        pan: '1111222233334444',
        status: 'ACTIVE',
        dailyLimitMinorUnits: 1000,
      },
      {
        cardId: 'c2',
        accountId: 'a1',
        pan: '1111222233335555',
        status: 'ACTIVE',
        dailyLimitMinorUnits: 2000,
      },
      {
        cardId: 'c3',
        accountId: 'a1',
        status: 'ACTIVE',
        dailyLimitMinorUnits: 100,
      },
    ],
  },
  {
    account: {
      accountId: 'a2',
      accountNumber: '222222',
      currency: 'EUR',
      status: 'FROZEN',
      type: 'SAVINGS',
    },
    cards: [],
  },
]
beforeEach(() => {
  api.mutate
    .mockReset()
    .mockImplementation(() => ({ unwrap: () => Promise.resolve({}) }))
  api.refetch.mockReset()
  api.loading = false
  api.users = [user]
  api.accounts = accounts
  store.dispatch(setCurrentUser(user))
  store.dispatch(setAccounts(accounts))
  store.dispatch(setCardsFromAccounts(accounts))
})
afterEach(cleanup)

describe('banking page workflows', () => {
  it('highlights the highest-limit active card and clears session on logout', async () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByTestId('page-dashboard').textContent).toContain('5555')
    fireEvent.click(screen.getByTestId('profile-menu-button'))
    fireEvent.click(screen.getByTestId('logout-menu-item'))
    await waitFor(() => expect(store.getState().user.currentUser).toBeNull())
    expect(store.getState().accounts.items).toEqual([])
    expect(store.getState().cards.items).toEqual([])
  })
  it('renders loading dashboard and profile then populated profile', () => {
    api.loading = true
    store.dispatch(setAccounts([]))
    store.dispatch(setCardsFromAccounts([]))
    store.dispatch(clearCurrentUser())
    const view = renderWithProviders(
      <>
        <DashboardPage />
        <UserPage />
      </>,
    )
    expect(view.container.querySelector('[aria-hidden="true"]')).toBeTruthy()
    view.unmount()
    store.dispatch(setCurrentUser(user))
    renderWithProviders(<UserPage />)
    expect(screen.getAllByText(user.email!).length).toBeGreaterThan(0)
    expect(screen.getByText('profile-1')).toBeTruthy()
  })
  it('changes managed user role and status through table controls', async () => {
    renderWithProviders(<UsersPage />)
    fireEvent.click(screen.getByRole('button', { name: 'ADMIN' }))
    fireEvent.click(screen.getByRole('option', { name: 'MANAGER' }))
    await waitFor(() =>
      expect(api.mutate).toHaveBeenCalledWith({
        authUserId: 'auth-1',
        role: 'MANAGER',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'ACTIVE' }))
    fireEvent.click(screen.getByRole('option', { name: 'BLOCKED' }))
    await waitFor(() =>
      expect(api.mutate).toHaveBeenCalledWith({ authUserId: 'auth-1' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'BLOCKED' }))
    fireEvent.click(screen.getByRole('option', { name: 'ACTIVE' }))
    await waitFor(() => expect(api.mutate).toHaveBeenCalledTimes(3))
  })
  it('verifies pending users and handles mutation errors', async () => {
    api.users = [{ ...user, status: 'PENDING' }]
    api.mutate.mockImplementation(() => ({
      unwrap: () => Promise.reject({ data: { message: 'Denied' } }),
    }))
    renderWithProviders(<UsersPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Pending' }))
    fireEvent.click(screen.getByRole('option', { name: 'VERIFIED' }))
    await waitFor(() => expect(api.mutate).toHaveBeenCalledWith('auth-1'))
    fireEvent.click(screen.getByRole('button', { name: 'ADMIN' }))
    fireEvent.click(screen.getByRole('option', { name: 'USER' }))
    await waitFor(() => expect(api.mutate).toHaveBeenCalledTimes(2))
  })
  it('freezes and unfreezes managed accounts and cards and refreshes the snapshot', async () => {
    renderWithProviders(<UserDetailsPage />)
    const freeze = screen.getAllByRole('button', { name: 'Freeze' })
    fireEvent.click(freeze[0])
    await waitFor(() => expect(api.refetch).toHaveBeenCalledTimes(1))
    fireEvent.click(screen.getByRole('button', { name: 'Unfreeze' }))
    await waitFor(() => expect(api.refetch).toHaveBeenCalledTimes(2))
    fireEvent.click(freeze[1])
    await waitFor(() =>
      expect(api.mutate).toHaveBeenCalledWith(
        expect.objectContaining({ cardId: 'c1', status: 'FROZEN' }),
      ),
    )
    await waitFor(() => expect(api.refetch).toHaveBeenCalledTimes(3))
    fireEvent.click(screen.getByRole('button', { name: /Back to users/i }))
  })
  it('keeps managed snapshot when account/card updates fail', async () => {
    api.mutate.mockImplementation(() => ({
      unwrap: () => Promise.reject({ data: { message: 'Denied' } }),
    }))
    renderWithProviders(<UserDetailsPage />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Freeze' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Unfreeze' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Freeze' })[1])
    await waitFor(() => expect(api.mutate).toHaveBeenCalledTimes(3))
    expect(api.refetch).not.toHaveBeenCalled()
  })
  it('opens account creation and freezes/unfreezes own accounts', async () => {
    renderWithProviders(<AccountsPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Freeze' }))
    fireEvent.click(screen.getByRole('button', { name: 'Unfreeze' }))
    await waitFor(() => expect(api.mutate).toHaveBeenCalledTimes(2))
    fireEvent.click(screen.getByTestId('accounts-create-button'))
    expect(screen.getByTestId('create-account-dialog')).toBeTruthy()
    fireEvent.submit(
      within(screen.getByTestId('create-account-dialog'))
        .getByTestId('create-account-submit')
        .closest('form')!,
    )
    await waitFor(() =>
      expect(screen.queryByTestId('create-account-dialog')).toBeNull(),
    )
    expect(api.mutate).toHaveBeenCalledWith({
      currency: 'USD',
      type: 'CHECKING',
    })
  })
  it('submits verification query parameters once', async () => {
    renderWithProviders(<UserVerifyPage />, '/verify?userId=auth-1&code=abc')
    await waitFor(() =>
      expect(api.mutate).toHaveBeenCalledWith({
        authUserId: 'auth-1',
        verificationCode: 'abc',
      }),
    )
    expect(api.mutate).toHaveBeenCalledTimes(1)
  })
  it('handles invalid verification and missing parameters', async () => {
    api.mutate.mockImplementation(() => ({
      unwrap: () => Promise.reject({ data: { message: 'Invalid' } }),
    }))
    const view = renderWithProviders(
      <UserVerifyPage />,
      '/verify?authUserId=a&verificationCode=b',
    )
    await waitFor(() => expect(api.mutate).toHaveBeenCalledTimes(1))
    view.unmount()
    renderWithProviders(<UserVerifyPage />)
    expect(screen.getAllByText('Verification failed').length).toBeGreaterThan(0)
    expect(api.mutate).toHaveBeenCalledTimes(1)
  })
})
