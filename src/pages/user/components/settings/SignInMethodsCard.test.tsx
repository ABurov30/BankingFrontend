import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { SignInMethodsCard } from './SignInMethodsCard'

describe('SignInMethodsCard', () => {
  it('renders linked social accounts', () => {
    renderWithProviders(
      <SignInMethodsCard
        socialAccounts={[{ email: 'user@example.test', provider: 'GOOGLE' }]}
      />,
    )

    expect(screen.getByText('Google')).toBeTruthy()
    expect(screen.getByText('user@example.test')).toBeTruthy()
  })

  it('renders an empty state when there are no linked social accounts', () => {
    renderWithProviders(<SignInMethodsCard socialAccounts={[]} />)

    expect(screen.getByText('No linked sign-in methods.')).toBeTruthy()
  })
})
