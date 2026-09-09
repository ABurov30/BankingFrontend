import { describe, expect, it } from 'vitest'

import { getAvailableFunds } from './getAvailableFunds'

describe('getAvailableFunds', () => {
  it('subtracts reserved minor units from the account balance', () => {
    expect(
      getAvailableFunds({
        availableBalanceMinorUnits: 100_000,
        reservedBalanceMinorUnits: 12_550,
      }),
    ).toBe(87_450)
  })

  it('treats an omitted reserved balance as zero', () => {
    expect(getAvailableFunds({ availableBalanceMinorUnits: 100_000 })).toBe(
      100_000,
    )
  })

  it('preserves an unavailable balance', () => {
    expect(getAvailableFunds()).toBeUndefined()
  })
})
