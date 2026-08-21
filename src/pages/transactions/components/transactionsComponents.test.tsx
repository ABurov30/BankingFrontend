import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { Filters } from './Filters'
import { TransactionsTable } from './TransactionsTable'

afterEach(() => {
  cleanup()
})

describe('transaction components', () => {
  it('renders transaction filter options', () => {
    renderWithProviders(<Filters />)

    expect(screen.getByRole('button', { name: 'All' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Date range' })).toBeTruthy()
  })

  it('renders an explicit empty transaction state', () => {
    renderWithProviders(<TransactionsTable />)

    expect(screen.getByText('No transaction data available.')).toBeTruthy()
  })

  it('renders transactions returned by the API', () => {
    const handleTrackTransaction = vi.fn()

    renderWithProviders(
      <TransactionsTable
        onTrackTransaction={handleTrackTransaction}
        transactions={[
          {
            createdAt: '2026-08-11T12:00:00Z',
            currency: 'USD',
            minorUnits: 12345,
            sourceAccount: { accountNumber: '4081781000000001' },
            status: 'COMPLETED',
            targetAccount: { accountNumber: '4081781000000002' },
            transactionId: '11111111-1111-1111-1111-111111111111',
          },
        ]}
      />,
    )

    expect(screen.getByText('4081781000000001')).toBeTruthy()
    expect(screen.getByText('To: 4081781000000002')).toBeTruthy()
    expect(screen.getByText('COMPLETED')).toBeTruthy()
    expect(screen.getByText('$ 123.45')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Отслеживать' })).toBeTruthy()
  })

  it('calls the track handler for a transaction row', () => {
    const handleTrackTransaction = vi.fn()

    renderWithProviders(
      <TransactionsTable
        onTrackTransaction={handleTrackTransaction}
        transactions={[
          {
            createdAt: '2026-08-11T12:00:00Z',
            currency: 'USD',
            minorUnits: 12345,
            status: 'FUNDS_RESERVED',
            transactionId: '11111111-1111-1111-1111-111111111111',
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Отслеживать' }))

    expect(handleTrackTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: '11111111-1111-1111-1111-111111111111',
      }),
    )
  })
})
