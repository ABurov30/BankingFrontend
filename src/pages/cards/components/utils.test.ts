import { describe, expect, it } from 'vitest'

import { getAccountName, getExpiryLabel } from './utils'

describe('card utilities', () => {
  it('formats expiry dates and missing values', () => {
    expect(getExpiryLabel('2026-12-01T00:00:00.000Z')).toBe('12/26')
    expect(getExpiryLabel()).toBe('--/--')
  })

  it('creates a linked-account label', () => {
    expect(getAccountName()).toBe('Linked account')
    expect(getAccountName({ account: { type: 'CREDIT' } })).toBe(
      'Credit account',
    )
  })
})
