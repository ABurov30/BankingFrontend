import { fireEvent, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { AccountCurrency, CardStatus } from '@/shared/api/enums'
import { IssueCardDialog } from './IssueCardDialog'
import { CardsList } from './CardsList'
import { CardsPageHeader } from './CardsPageHeader'
import { PaymentCard } from './PaymentCard'
import { LimitActions } from './limits/LimitActions'
import { LimitItem } from './limits/LimitItem'
import type { LimitsFormValues } from './limits/types'

const account = {
  account: {
    accountId: 'account-1',
    accountNumber: '1234567890',
    balance: 10000,
    currency: AccountCurrency.USD,
    type: 'CHECKING' as const,
    status: 'ACTIVE' as const,
  },
  cards: [],
}

const card = {
  accountId: 'account-1',
  cardId: 'card-1',
  pan: '1234567890123456',
  status: CardStatus.ACTIVE,
  dailyLimitMinorUnits: 10000,
  monthlyLimitMinorUnits: 50000,
  spendDailyLimitMinorUnits: 1000,
  spendMonthlyLimitMinorUnits: 5000,
}

const t = (key: string) => key

describe('card components', () => {
  it('changes card status through the status menu', () => {
    const onUpdateStatus = vi.fn()
    renderWithProviders(
      <PaymentCard
        account={account}
        card={card}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /ACTIVE/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'BLOCKED' }))
    expect(onUpdateStatus).toHaveBeenCalledWith(card, CardStatus.BLOCKED)
  })

  it('renders card list loading, empty and populated states', () => {
    const onUpdateStatus = vi.fn()
    renderWithProviders(
      <CardsList
        cards={[]}
        emptyLabel="No cards"
        isLoading
        onUpdateStatus={onUpdateStatus}
      />,
    )
    expect(
      document.querySelectorAll('[class*="skeleton"]').length,
    ).toBeGreaterThan(0)

    renderWithProviders(
      <CardsList
        cards={[]}
        emptyLabel="No cards"
        isLoading={false}
        onUpdateStatus={onUpdateStatus}
      />,
    )
    expect(screen.getByText('No cards')).toBeTruthy()

    renderWithProviders(
      <CardsList
        cards={[{ account, card }]}
        emptyLabel="No cards"
        isLoading={false}
        onUpdateStatus={onUpdateStatus}
      />,
    )
    expect(screen.getAllByText(/Buro card/).length).toBeGreaterThan(0)
  })

  it('selects a card issue account and submits', async () => {
    const onSubmit = vi.fn()
    const onClose = vi.fn()
    renderWithProviders(
      <IssueCardDialog
        accounts={[account]}
        isCreatingCard={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /CHECKING/ }))
    expect(screen.getByRole('listbox')).toBeTruthy()
    fireEvent.click(screen.getAllByRole('option').at(-1)!)
    const forms = document.querySelectorAll('form')
    fireEvent.submit(forms[forms.length - 1])
    await waitFor(() =>
      expect(onSubmit.mock.calls[0]?.[0]).toEqual({ accountId: 'account-1' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('handles status filters and issue action', () => {
    const onCreateCard = vi.fn()
    const onFilter = vi.fn()
    renderWithProviders(
      <CardsPageHeader
        isCreatingCard={false}
        labels={{ cards: 'Cards', issueCard: 'Issue card', issuing: 'Issuing' }}
        onCreateCard={onCreateCard}
        onStatusFilterChange={onFilter}
        statusFilter={CardStatus.ACTIVE}
        statusFilters={[CardStatus.ACTIVE, CardStatus.BLOCKED]}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'BLOCKED' }))
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Issue card' }).at(-1)!,
    )
    expect(onFilter).toHaveBeenCalledWith(CardStatus.BLOCKED)
    expect(onCreateCard).toHaveBeenCalledOnce()
  })
})

function LimitItemHarness() {
  const { register } = useForm<LimitsFormValues>()
  return (
    <LimitItem
      colorClassName="fill"
      currency={AccountCurrency.USD}
      disabled={false}
      fieldName="dailyLimit"
      isEditing
      label="Daily"
      register={register}
      t={t}
      value="$ 10.00"
      width="25%"
    />
  )
}

describe('card limits controls', () => {
  it('edits a limit and exposes limit actions', () => {
    const onCancel = vi.fn()
    const onEdit = vi.fn()
    renderWithProviders(
      <>
        <LimitItemHarness />
        <LimitActions
          hasCard
          isDirty
          isEditing={false}
          isUpdating={false}
          onCancel={onCancel}
          onEdit={onEdit}
          t={t}
        />
      </>,
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } })
    expect(screen.getByRole('textbox')).toHaveProperty('value', '12.34')
    fireEvent.click(screen.getByRole('button', { name: 'editLimits' }))
    expect(onEdit).toHaveBeenCalledOnce()
  })
})
