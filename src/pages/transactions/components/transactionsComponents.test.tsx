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
})
