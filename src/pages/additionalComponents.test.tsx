import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Activity } from 'lucide-react'

import { HealthCard } from './health/components/HealthCard'
import { SignupForm } from './signup/components/SignupForm'
import { VerificationPanel } from './user-verify/components/VerificationPanel'
import { UserAccountsSection } from './user-details/components/UserAccountsSection'
import { UserCardItem } from './user-details/components/UserCardItem'
import { UserDetailsHeader } from './user-details/components/UserDetailsHeader'
import { CardStatus, AccountCurrency, AccountStatus } from '@/shared/api/enums'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import { renderWithProviders } from '@/test/renderWithProviders'

const card = {
  cardId: 'card-1',
  pan: '4111 **** 1111',
  status: CardStatus.ACTIVE,
  spendDailyLimit: 1000,
  spendMonthlyLimit: 5000,
} as GetCardByAccountIdResponseDto

describe('additional page components', () => {
  it('renders healthy, failed, loading, and serialized health cards', () => {
    renderWithProviders(
      <>
        <HealthCard icon={Activity} isLoading name="Auth" />
        <HealthCard icon={Activity} isLoading={false} name="Card" result={{ data: 'UP' }} />
        <HealthCard icon={Activity} isLoading={false} name="User" result={{ error: 'DOWN' }} />
        <HealthCard icon={Activity} isLoading={false} name="Account" result={{ data: { status: 'UP' } }} />
      </>,
    )

    expect(screen.getByText('UP')).toBeTruthy()
    expect(screen.getByText('{"status":"DOWN"}')).toBeTruthy()
    expect(screen.getByText('{"status":"UP"}')).toBeTruthy()
    expect(screen.getAllByText('Auth').length).toBeGreaterThan(0)
  })

  it('submits signup values and toggles password visibility', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<SignupForm isLoading={false} onSubmit={onSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: 'Ada' } })
    fireEvent.change(inputs[1], { target: { value: 'Lovelace' } })
    fireEvent.change(inputs[2], { target: { value: 'ada@example.com' } })
    const password = document.querySelector('input[type="password"]') as HTMLInputElement
    fireEvent.change(password, { target: { value: 'StrongPassword1!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password.type).toBe('text')
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.submit(screen.getByRole('button', { name: 'Create account' }).closest('form') as HTMLFormElement)

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
        termsAccepted: true,
      }),
    )
  })

  it('renders verification states and API error', () => {
    renderWithProviders(
      <>
        <VerificationPanel error={undefined} hasRequiredParams={false} isError={false} isLoading={false} isSuccess={false} />
        <VerificationPanel error={{ data: { message: 'Invalid code' } }} hasRequiredParams isError isLoading={false} isSuccess={false} />
        <VerificationPanel error={undefined} hasRequiredParams isError={false} isLoading={false} isSuccess />
      </>,
    )

    expect(screen.getAllByText('Verification failed').length).toBeGreaterThan(0)
    expect(screen.getByText('Invalid code')).toBeTruthy()
    expect(screen.getByText('Email verified')).toBeTruthy()
  })

  it('renders user account and card actions', () => {
    const onFreezeAccount = vi.fn()
    const onUnfreezeAccount = vi.fn()
    const onUpdateCardStatus = vi.fn()
    renderWithProviders(
      <>
        <UserDetailsHeader onBack={vi.fn()} user={{ email: 'ada@example.com', firstName: 'Ada', lastName: 'Lovelace', role: 'USER', status: 'ACTIVE' }} />
        <UserCardItem accountStatus={AccountStatus.ACTIVE} card={card} currency={AccountCurrency.USD} isUpdating={false} onUpdateStatus={onUpdateCardStatus} />
        <UserAccountsSection accounts={[{ account: { accountId: 'account-1', accountNumber: '123', currency: AccountCurrency.USD, status: AccountStatus.ACTIVE, type: 'CHECKING' }, cards: [card] }]} isLoading={false} isUpdatingAccount={false} isUpdatingCard={false} onFreezeAccount={onFreezeAccount} onUnfreezeAccount={onUnfreezeAccount} onUpdateCardStatus={onUpdateCardStatus} />
      </>,
    )

    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    fireEvent.click(screen.getAllByRole('button', { name: 'Freeze' })[0])
    expect(onUpdateCardStatus).toHaveBeenCalled()
    fireEvent.click(screen.getAllByRole('button', { name: 'Freeze' })[1])
    expect(onFreezeAccount).toHaveBeenCalledWith('account-1')
  })
})
