import { fireEvent, screen } from '@testing-library/react'
import { Landmark } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { AccountsTable } from './AccountsTable'

describe('AccountsTable', () => {
  it('renders account metadata and freezes the selected account', () => {
    const onFreeze = vi.fn()

    renderWithProviders(
      <AccountsTable
        accounts={[
          {
            account: 'Checking account',
            accountId: 'account-1',
            balance: '$ 200.00',
            currency: '$',
            enabled: true,
            icon: Landmark,
            iconClassName: '',
            number: '•• 0001',
            status: 'ACTIVE',
            statusClassName: '',
            type: 'CHECKING',
          },
        ]}
        onFreeze={onFreeze}
        onUnfreeze={vi.fn()}
      />,
    )

    expect(screen.getByText('Checking account')).toBeTruthy()
    expect(screen.getByText('$ 200.00')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Freeze' }))
    expect(onFreeze).toHaveBeenCalledWith('account-1')
  })
})
