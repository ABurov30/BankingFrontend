import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { Filters } from './Filters'
import { TransactionsTable } from './TransactionsTable'

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
    renderWithProviders(
      <TransactionsTable
        transactions={[
          {
            amount: 123.45,
            createdAt: '2026-08-11T12:00:00Z',
            currency: 'USD',
            sourceAccount: { accountNumber: '4081781000000001' },
            status: 'COMPLETED',
            targetAccount: { accountNumber: '4081781000000002' },
          },
        ]}
      />,
    )

    expect(screen.getByText('4081781000000001')).toBeTruthy()
    expect(screen.getByText('To: 4081781000000002')).toBeTruthy()
    expect(screen.getByText('COMPLETED')).toBeTruthy()
    expect(screen.getByText('USD 123.45')).toBeTruthy()
  })
})
