import { describe, expect, it } from 'vitest'

import { getVerificationState } from './verificationState'

describe('getVerificationState', () => {
  it('prioritizes missing required parameters', () => {
    expect(
      getVerificationState({
        hasRequiredParams: false,
        isError: false,
        isLoading: true,
        isSuccess: true,
      }),
    ).toMatchObject({ variant: 'error', titleKey: 'verificationFailed' })
  })

  it('returns success and loading states', () => {
    expect(
      getVerificationState({
        hasRequiredParams: true,
        isError: false,
        isLoading: false,
        isSuccess: true,
      }),
    ).toMatchObject({ variant: 'success' })
    expect(
      getVerificationState({
        hasRequiredParams: true,
        isError: false,
        isLoading: true,
        isSuccess: false,
      }),
    ).toMatchObject({ variant: 'loading', messageKey: 'confirmEmail' })
  })
})
