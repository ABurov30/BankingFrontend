import { describe, expect, it } from 'vitest'

import { getApiErrorMessage } from './error'

describe('getApiErrorMessage', () => {
  it('uses an API message when present', () => {
    expect(getApiErrorMessage({ data: { message: 'Access denied' } })).toBe(
      'Access denied',
    )
  })

  it('joins an API error array', () => {
    expect(getApiErrorMessage({ data: { error: ['First', 'Second'] } })).toBe(
      'First\nSecond',
    )
  })

  it('returns a stable fallback for unknown errors', () => {
    expect(getApiErrorMessage(null)).toBe(
      'Unexpected server error. Please try again.',
    )
  })
})
