import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const accounts = vi.hoisted(() => ({
  useEnsureAccountsLoaded: vi.fn(() => ({ isFetching: false })),
}))

vi.mock('@/features/accounts/useEnsureAccountsLoaded', () => accounts)

vi.mock('@/shared/api/healthApi', () => ({
  useGetServiceHealthQuery: () => ({
    data: {
      account: { data: { status: 'UP' } },
      auth: { data: { status: 'UP' } },
      card: { error: 'DOWN' },
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
}))

vi.mock('@/shared/api/notificationApi', () => ({
  useGetNotificationsQuery: () => ({
    data: [{ title: 'Transfer complete', body: 'Your transfer was accepted.' }],
  }),
}))

import HealthPage from './health/HealthPage'
import LoginPage from './login/LoginPage'
import NotificationsPage from './notifications/NotificationsPage'
import SignupPage from './signup/SignupPage'
import AccountsPage from './accounts/AccountsPage'
import CardsPage from './cards/CardsPage'
import { store } from '@/app/store'
import { clearAccounts } from '@/features/accounts/accountsSlice'
import { clearCards } from '@/features/cards/cardsSlice'
import { clearCurrentUser } from '@/features/user/userSlice'
import { setCurrentUser } from '@/features/user/userSlice'
import { renderWithProviders } from '@/test/renderWithProviders'

afterEach(cleanup)

describe('page states', () => {
  it('renders service health summary and refresh action', () => {
    renderWithProviders(<HealthPage />)
    expect(screen.getByText('Service health')).toBeTruthy()
    expect(screen.getByText('2/6')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Refresh/ }))
  })

  it('renders notification history', () => {
    renderWithProviders(<NotificationsPage />)
    expect(screen.getByText('Transfer complete')).toBeTruthy()
    expect(screen.getByText('Your transfer was accepted.')).toBeTruthy()
  })

  it('renders login and signup page shells', () => {
    renderWithProviders(<LoginPage />, '/login')
    expect(screen.getByText('Welcome back')).toBeTruthy()
    cleanup()
    renderWithProviders(<SignupPage />, '/signup')
    expect(screen.getAllByText('Create account').length).toBeGreaterThan(0)
  })

  it('renders empty accounts and cards pages', () => {
    store.dispatch(clearAccounts())
    store.dispatch(clearCards())
    store.dispatch(clearCurrentUser())
    renderWithProviders(
      <>
        <AccountsPage />
        <CardsPage />
      </>,
    )
    expect(screen.getByTestId('page-accounts')).toBeTruthy()
    expect(screen.getByTestId('page-cards')).toBeTruthy()
    expect(screen.getAllByText('No card data available.').length).toBeGreaterThan(0)
  })

  it('loads the signed-in user account snapshot for the cards page', () => {
    store.dispatch(
      setCurrentUser({ userProfileId: 'profile-1', role: 'USER' }),
    )

    renderWithProviders(<CardsPage />)

    expect(accounts.useEnsureAccountsLoaded).toHaveBeenLastCalledWith(
      'profile-1',
    )
  })
})
