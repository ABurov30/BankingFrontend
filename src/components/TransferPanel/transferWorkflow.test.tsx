import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { store } from '@/app/store'
import { setAccounts } from '@/features/accounts/accountsSlice'
import { setCardsFromAccounts } from '@/features/cards/cardsSlice'
import { setCurrentUser } from '@/features/user/userSlice'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TransferForm } from './TransferForm'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'
const api = vi.hoisted(() => ({
  topUp: vi.fn(),
  withdraw: vi.fn(),
  transfer: vi.fn(),
  recipient: vi.fn(),
}))
vi.mock('@/shared/api/accountApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/accountApi')>()),
  useTopUpAccountMutation: () => [api.topUp, {}],
  useWithdrawAccountMutation: () => [api.withdraw, {}],
}))
vi.mock('@/shared/api/transactionApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/transactionApi')>()),
  useCreateTransactionMutation: () => [api.transfer, {}],
}))
vi.mock('@/shared/api/userApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/userApi')>()),
  useGetRecipientInfoMutation: () => [api.recipient, {}],
}))
const accounts: GetAccountWithCardsResponseDto[] = [
  {
    account: {
      accountId: 'a1',
      accountNumber: '111111',
      currency: 'USD',
      status: 'ACTIVE',
      availableBalanceMinorUnits: 50000,
    },
    cards: [
      { cardId: 'c1', accountId: 'a1', pan: '12344444', status: 'ACTIVE' },
    ],
  },
  {
    account: {
      accountId: 'a2',
      accountNumber: '222222',
      currency: 'USD',
      status: 'ACTIVE',
      availableBalanceMinorUnits: 20000,
    },
    cards: [
      { cardId: 'c2', accountId: 'a2', pan: '12345555', status: 'ACTIVE' },
    ],
  },
]
beforeEach(() => {
  for (const fn of Object.values(api))
    fn.mockReset().mockImplementation(() => ({
      unwrap: () => Promise.resolve({}),
    }))
  api.recipient.mockImplementation(() => ({
    unwrap: () =>
      Promise.resolve({
        userInfo: {
          email: 'recipient@example.test',
          firstName: 'Grace',
          lastName: 'Hopper',
        },
        accounts: [
          {
            accountId: 'r1',
            accountNumber: '333333',
            currency: 'EUR',
            status: 'ACTIVE',
          },
        ],
      }),
  }))
  store.dispatch(
    setCurrentUser({ email: 'me@example.test', userProfileId: 'p1' }),
  )
  store.dispatch(setAccounts(accounts))
  store.dispatch(setCardsFromAccounts(accounts))
})
afterEach(cleanup)
function own(operation: string) {
  renderWithProviders(<TransferForm />)
  fireEvent.click(screen.getByRole('button', { name: 'To your account' }))
  fireEvent.click(screen.getByRole('button', { name: operation }))
}
function submitAmount() {
  fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
    target: { value: '1234' },
  })
  fireEvent.submit(document.querySelector('form')!)
}
describe('money operation workflows', () => {
  it.each(['Top up', 'Withdraw'])(
    'submits %s with integer minor units and clears amount',
    async (operation) => {
      own(operation)
      fireEvent.click(screen.getByRole('button', { name: /111111/ }))
      fireEvent.click(screen.getByRole('option', { name: /222222/ }))
      submitAmount()
      const mutation = operation === 'Top up' ? api.topUp : api.withdraw
      await waitFor(() =>
        expect(mutation).toHaveBeenCalledWith({
          accountId: 'a2',
          minorUnits: 1234,
        }),
      )
      await waitFor(() =>
        expect(
          (screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement)
            .value,
        ).toBe(''),
      )
    },
  )
  it('preserves entered amount on balance update failure', async () => {
    api.topUp.mockImplementation(() => ({
      unwrap: () => Promise.reject({ data: { message: 'Insufficient funds' } }),
    }))
    own('Top up')
    submitAmount()
    await waitFor(() => expect(api.topUp).toHaveBeenCalled())
    expect(
      (screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement)
        .value,
    ).toBe('12.34')
  })
  it('requires confirmation and sends the selected source card', async () => {
    own('Between my accounts')
    fireEvent.click(screen.getByRole('button', { name: /Buro card/ }))
    fireEvent.click(screen.getByRole('option', { name: /5555/ }))
    submitAmount()
    await screen.findByRole('dialog')
    expect(api.transfer).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm transfer' }))
    await waitFor(() =>
      expect(api.transfer).toHaveBeenCalledWith({
        sourceAccountId: 'a2',
        sourceCardId: 'c2',
        targetAccountId: 'a1',
        currency: 'USD',
        minorUnits: 1234,
        idempotencyKey: expect.any(String),
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
  it('retains the idempotency key on retry and supports cancelling confirmation', async () => {
    api.transfer.mockImplementation(() => ({
      unwrap: () => Promise.reject({ data: { message: 'Try again' } }),
    }))
    own('Between my accounts')
    submitAmount()
    await screen.findByRole('dialog')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm transfer' }))
    await waitFor(() => expect(api.transfer).toHaveBeenCalledTimes(1))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm transfer' }))
    await waitFor(() => expect(api.transfer).toHaveBeenCalledTimes(2))
    expect(api.transfer.mock.calls[0]).toEqual(api.transfer.mock.calls[1])
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('looks up recipient and transfers to their active account', async () => {
    renderWithProviders(<TransferForm />)
    fireEvent.click(screen.getByRole('button', { name: 'To another person' }))
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'recipient@example.test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    await screen.findByText('Grace Hopper')
    expect(api.recipient).toHaveBeenCalledWith({
      email: 'recipient@example.test',
    })
    fireEvent.click(await screen.findByRole('button', { name: /333333/ }))
    fireEvent.click(screen.getByRole('option', { name: /333333/ }))
    submitAmount()
    await screen.findByRole('dialog')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm transfer' }))
    await waitFor(() =>
      expect(api.transfer).toHaveBeenCalledWith(
        expect.objectContaining({
          targetAccountId: 'r1',
          sourceCardId: 'c1',
          minorUnits: 1234,
        }),
      ),
    )
  })
  it.each(['invalid', 'missing', 'self', 'error'])(
    'rejects %s recipient and allows returning to targets',
    async (kind) => {
      if (kind === 'missing')
        api.recipient.mockImplementation(() => ({
          unwrap: () => Promise.resolve({}),
        }))
      if (kind === 'self')
        api.recipient.mockImplementation(() => ({
          unwrap: () =>
            Promise.resolve({ userInfo: { email: 'me@example.test' } }),
        }))
      if (kind === 'error')
        api.recipient.mockImplementation(() => ({
          unwrap: () => Promise.reject({ data: { message: 'Not found' } }),
        }))
      renderWithProviders(<TransferForm />)
      fireEvent.click(screen.getByRole('button', { name: 'To another person' }))
      fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
        target: { value: kind === 'invalid' ? 'bad' : 'me@example.test' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Search' }))
      if (kind !== 'invalid')
        await waitFor(() => expect(api.recipient).toHaveBeenCalled())
      else expect(api.recipient).not.toHaveBeenCalled()
      expect(api.transfer).not.toHaveBeenCalled()
      fireEvent.click(screen.getByRole('button', { name: 'Back' }))
      expect(
        screen.getByRole('button', { name: 'To your account' }),
      ).toBeTruthy()
    },
  )
})
