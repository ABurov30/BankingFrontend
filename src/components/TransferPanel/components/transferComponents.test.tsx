import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { Field } from './Field'
import { OperationTab } from './OperationTab'
import {
  OwnAccountOperationTabs,
  TransferTargetTabs,
} from './TransferStageTabs'
import { TransferPanelHeader } from './TransferPanelHeader'
import { TransferSubmitBlock } from './TransferSubmitBlock'

const t = (key: string) => key

describe('transfer panel presentational components', () => {
  it('renders and handles target and operation tabs', () => {
    const target = vi.fn()
    const operation = vi.fn()
    renderWithProviders(
      <>
        <TransferTargetTabs onSelectTarget={target} t={t} />
        <OwnAccountOperationTabs onSelectOperation={operation} t={t} />
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'toYourAccount' }))
    fireEvent.click(screen.getByRole('button', { name: 'toAnotherPerson' }))
    fireEvent.click(screen.getByRole('button', { name: 'topUp' }))
    fireEvent.click(screen.getByRole('button', { name: 'withdraw' }))
    fireEvent.click(screen.getByRole('button', { name: 'betweenMyAccounts' }))

    expect(target).toHaveBeenNthCalledWith(1, 'OWN_ACCOUNT')
    expect(target).toHaveBeenNthCalledWith(2, 'ANOTHER_PERSON')
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('renders a field and submit state', () => {
    renderWithProviders(
      <>
        <Field label="Amount">content</Field>
        <TransferSubmitBlock
          disabled={false}
          isSubmitting={false}
          operation="TOP_UP"
          t={t}
        />
        <TransferSubmitBlock disabled isSubmitting operation="WITHDRAW" t={t} />
      </>,
    )

    expect(screen.getByText('Amount')).toBeTruthy()
    expect(
      screen.getAllByRole('button', { name: 'topUp' }).length,
    ).toBeGreaterThan(0)
    expect(
      (screen.getByRole('button', { name: 'processing' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
  })

  it('handles transfer panel header actions', () => {
    const onBack = vi.fn()
    const onClose = vi.fn()
    renderWithProviders(
      <TransferPanelHeader
        backLabel="Back"
        canGoBack
        closeLabel="Close"
        onBack={onBack}
        onClose={onClose}
        title="Transfer"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onBack).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders operation tab active state', () => {
    const onClick = vi.fn()
    renderWithProviders(
      <OperationTab active icon={null} label="Active" onClick={onClick} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Active' }))
    expect(
      screen
        .getByRole('button', { name: 'Active' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(onClick).toHaveBeenCalledOnce()
  })
})
