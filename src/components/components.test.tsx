import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'
import { PageLoader } from './PageLoader'
import { Skeleton } from './Skeleton'
import { TransferPanel } from './TransferPanel'
import { Typography } from './Typography'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('shared visual components', () => {
  it('renders button variants and handles interactions', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} size="sm" variant="destructive">
        Delete
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders typography with the requested element', () => {
    render(
      <Typography as="h1" mode="title">
        Heading
      </Typography>,
    )

    expect(screen.getByRole('heading', { name: 'Heading' })).toBeTruthy()
  })

  it('shows panel content and skeleton dimensions', () => {
    renderWithProviders(<TransferPanel />)
    expect(screen.getByRole('dialog', { name: 'Transfer panel' })).toBeTruthy()

    const { container: skeletonContainer } = render(
      <Skeleton height={24} radius={8} width={120} />,
    )
    expect(
      skeletonContainer.querySelector('span')?.getAttribute('style'),
    ).toContain('height: 24px')
  })

  it('renders the application loader', () => {
    render(<PageLoader />)
    expect(screen.getByText('buro')).toBeTruthy()
  })
})
