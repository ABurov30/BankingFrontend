import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { AccountCurrency } from '@/shared/api/enums'
import { AccountsPagination } from './AccountsPagination'
import { DropdownField } from './DropdownField'
import { FilterButton } from './FilterButton'

describe('account controls', () => {
  it('opens a dropdown and selects an option', () => {
    const onSelect = vi.fn()
    renderWithProviders(
      <DropdownField
        isOpen
        label="Currency"
        onOpenChange={vi.fn()}
        onSelect={onSelect}
        options={[AccountCurrency.USD, AccountCurrency.EUR]}
        renderOption={(value) => `$ ${value}`}
        value={AccountCurrency.USD}
      />,
    )

    expect(screen.getByRole('listbox')).toBeTruthy()
    fireEvent.click(screen.getByRole('option', { name: '$ EUR' }))
    expect(onSelect).toHaveBeenCalledWith(AccountCurrency.EUR)
  })

  it('toggles filter options and closes after selection', () => {
    const onSelect = vi.fn()
    renderWithProviders(
      <FilterButton
        label="Status"
        onSelect={onSelect}
        options={['ALL', 'ACTIVE']}
        value="ALL"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Status/ }))
    fireEvent.click(screen.getByRole('option', { name: 'ACTIVE' }))
    expect(onSelect).toHaveBeenCalledWith('ACTIVE')
  })

  it('moves between pages and clamps boundaries', () => {
    const onPageChange = vi.fn()
    renderWithProviders(
      <AccountsPagination
        currentPage={2}
        labels={{
          nextPage: 'Next',
          of: 'of',
          previousPage: 'Previous',
          showing: 'Showing',
          totalAccounts: 'accounts',
        }}
        onPageChange={onPageChange}
        totalAccounts={25}
        totalPages={3}
        visibleAccountsEnd={20}
        visibleAccountsStart={11}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange.mock.calls).toEqual([[1], [3], [3]])
  })
})
