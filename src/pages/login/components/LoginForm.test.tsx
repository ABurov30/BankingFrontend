import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('calls Google login handler from the social sign-in button', () => {
    const onGoogleLogin = vi.fn()

    renderWithProviders(
      <LoginForm
        isGoogleLoginLoading={false}
        isLoading={false}
        onGoogleLogin={onGoogleLogin}
        onSubmit={vi.fn()}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Continue with Google' }),
    )

    expect(onGoogleLogin).toHaveBeenCalledOnce()
  })
})
