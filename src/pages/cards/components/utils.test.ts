import { describe, expect, it } from 'vitest'

import { getAccountName, getExpiryLabel } from './utils'

describe('card helpers', () => {
  it('formats expiry dates and missing values', () => {
    expect(getExpiryLabel()).toBe('--/--')
    expect(getExpiryLabel('2030-03-01T00:00:00.000Z')).toMatch(/03\/30/)
  })

  it('formats linked account names', () => {
    expect(getAccountName()).toBe('Linked account')
    expect(getAccountName({ account: { type: 'SAVINGS' } })).toBe(
      'Savings account',
    )
  })
})
