import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { AccountCurrency } from '@/shared/api/enums'
import { AccountsGrid } from './AccountsGrid'
import { ActivityCard } from './ActivityCard'
import { BalanceHero } from './BalanceHero'
import { LimitsCard } from './LimitsCard'
import { NotificationsCard } from './NotificationsCard'
import { SpendingCard } from './SpendingCard'

const accounts = [
  {
    account: {
      accountId: 'account-1',
      accountNumber: '1234567890',
      balance: 12345,
      currency: AccountCurrency.USD,
      type: 'CHECKING' as const,
      status: 'ACTIVE' as const,
    },
    cards: [],
  },
  {
    account: {
      accountId: 'account-2',
      currency: AccountCurrency.EUR,
      type: 'SAVINGS' as const,
      status: 'FROZEN' as const,
    },
    cards: [],
  },
]

describe('dashboard components', () => {
  it('renders loading and populated account grids', () => {
    renderWithProviders(<AccountsGrid accounts={[]} isLoading />)
    expect(
      document.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThan(0)

    renderWithProviders(<AccountsGrid accounts={accounts} />)
    expect(screen.getByText('Checking account')).toBeTruthy()
    expect(screen.getByText('Savings account')).toBeTruthy()
    expect(screen.getByText(/•• 7890/)).toBeTruthy()
  })

  it('renders balance, limits and opens transfer panel', () => {
    renderWithProviders(
      <>
        <BalanceHero accounts={accounts} isFetching={false} />
        <LimitsCard
          account={accounts[0]}
          card={{
            dailyLimitMinorUnits: 10000,
            monthlyLimitMinorUnits: 50000,
          }}
        />
      </>,
    )

    expect(screen.getByText(/Total balance/)).toBeTruthy()
    expect(screen.getByText('Daily limit')).toBeTruthy()
    fireEvent.click(screen.getByTestId('dashboard-transfer-button'))
  })

  it('renders empty dashboard cards', () => {
    renderWithProviders(
      <>
        <ActivityCard />
        <SpendingCard />
        <NotificationsCard />
      </>,
    )

    expect(screen.getByText('Recent activity')).toBeTruthy()
    expect(screen.getByText('Spending this week')).toBeTruthy()
    expect(screen.getByText('Notifications')).toBeTruthy()
  })
})
