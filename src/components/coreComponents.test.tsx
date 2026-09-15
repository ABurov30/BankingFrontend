import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccessDenied } from './AccessDenied'
import { DashboardBankCardVisual, CardsBankCardVisual } from './BankCardVisual'
import { Button } from './Button'
import { PageLoader } from './PageLoader'
import { ToastViewport } from './ToastViewport'
import { showToast } from '@/features/toast/toastSlice'
import { store } from '@/app/store'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('core UI components', () => {
  it('renders button variants and slot content', () => {
    renderWithProviders(
      <>
        <Button variant="destructive">Delete</Button>
        <Button asChild>
          <a href="/accounts">Accounts</a>
        </Button>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Accounts' })).toBeTruthy()
  })

  it('renders card variants, fallback values and expiry labels', () => {
    renderWithProviders(
      <>
        <DashboardBankCardVisual
          card={{
            status: 'ACTIVE',
            pan: '1234567890123456',
            expiresAt: '2030-03-01',
          }}
          holderName="Test User"
        />
        <CardsBankCardVisual
          card={{ status: 'FROZEN', expiresAt: 'invalid' }}
        />
      </>,
    )

    expect(screen.getAllByText('DEBIT')).toHaveLength(2)
    expect(screen.getByText('Test User')).toBeTruthy()
    expect(screen.getByText('•••• •••• •••• 3456')).toBeTruthy()
    expect(screen.getAllByText('--/--')).toHaveLength(1)
  })

  it('renders access denied and navigates back to dashboard', () => {
    renderWithProviders(<AccessDenied />)

    fireEvent.click(screen.getByRole('button', { name: 'Back to Dashboard' }))
    expect(window.location.pathname).toBe('/')
  })

  it('renders loader and toast lifecycle controls', () => {
    renderWithProviders(<PageLoader />)
    expect(screen.getAllByText('buro').length).toBeGreaterThan(0)

    store.dispatch(
      showToast({ message: 'Saved', title: 'Success', variant: 'success' }),
    )
    renderWithProviders(<ToastViewport />)
    expect(screen.getByText('Saved')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    )
  })
})
