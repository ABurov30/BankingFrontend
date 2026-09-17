import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { store } from '@/app/store'
import { setAccounts } from '@/features/accounts/accountsSlice'
import { setCardsFromAccounts } from '@/features/cards/cardsSlice'
import { setCurrentUser } from '@/features/user/userSlice'
import {
  AccountCurrency,
  AccountStatus,
  AccountType,
  CardStatus,
} from '@/shared/api/enums'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TransferForm } from './TransferForm'

const sourceAccount = {
  accountId: 'account-1',
  accountNumber: '1111',
  balance: 15000,
  currency: AccountCurrency.USD,
  status: AccountStatus.ACTIVE,
  type: AccountType.CHECKING,
}
const destinationAccount = {
  accountId: 'account-2',
  accountNumber: '2222',
  balance: 0,
  currency: AccountCurrency.USD,
  status: AccountStatus.ACTIVE,
  type: AccountType.SAVINGS,
}
const card = {
  cardId: 'card-1',
  pan: '4111 **** 1111',
  status: CardStatus.ACTIVE,
  spendDailyLimit: 1000,
  spendMonthlyLimit: 5000,
}

beforeEach(() => {
  cleanup()
  const accounts = [
    { account: sourceAccount, cards: [card] },
    { account: destinationAccount, cards: [] },
  ]
  store.dispatch(setAccounts(accounts))
  store.dispatch(setCardsFromAccounts(accounts))
  store.dispatch(
    setCurrentUser({
      email: 'me@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      userProfileId: 'user-1',
    } as never),
  )
})

describe('TransferForm', () => {
  it('opens own operation form and validates an empty amount', async () => {
    renderWithProviders(<TransferForm />)
    fireEvent.click(screen.getByRole('button', { name: 'To your account' }))
    fireEvent.click(screen.getByRole('button', { name: 'Top up' }))

    expect(screen.getByText('Select account')).toBeTruthy()
    fireEvent.submit(document.querySelector('form') as HTMLFormElement)
    await waitFor(() =>
      expect(screen.getByText('Enter a valid amount.')).toBeTruthy(),
    )
  })

  it('renders withdrawal and between-account forms and navigates back', () => {
    renderWithProviders(<TransferForm />)
    fireEvent.click(screen.getByRole('button', { name: 'To your account' }))
    fireEvent.click(screen.getByRole('button', { name: 'Withdraw' }))
    expect(screen.getByRole('button', { name: 'Withdraw' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    fireEvent.click(screen.getByRole('button', { name: 'Between my accounts' }))
    expect(screen.getByText('To account')).toBeTruthy()
  })

  it('opens external transfer form and validates recipient email', () => {
    renderWithProviders(<TransferForm />)
    fireEvent.click(screen.getByRole('button', { name: 'To another person' }))
    expect(screen.getByText('Email address')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByText('Enter the recipient email.')).toBeTruthy()
  })
})
