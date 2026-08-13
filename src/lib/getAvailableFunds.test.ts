import { describe, expect, it } from 'vitest'

import { getAvailableFunds } from './getAvailableFunds'

describe('getAvailableFunds', () => {
  it('subtracts reserved funds from the account balance', () => {
    expect(
      getAvailableFunds({ availableBalance: 1_000, reservedBalance: 125.5 }),
    ).toBe(874.5)
  })

  it('treats an omitted reserved balance as zero', () => {
    expect(getAvailableFunds({ availableBalance: 1_000 })).toBe(1_000)
  })

  it('preserves an unavailable balance', () => {
    expect(getAvailableFunds()).toBeUndefined()
  })
})
