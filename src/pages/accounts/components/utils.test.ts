import { describe, expect, it } from 'vitest'

import { isAccountRowModel, mapAccountRow } from './utils'

describe('account row mapping', () => {
  it('rejects an account without an identifier', () => {
    expect(mapAccountRow({ account: { accountNumber: '1234' } })).toBeNull()
  })

  it('maps account values for the table', () => {
    const row = mapAccountRow({
      account: {
        accountId: 'account-1',
        accountNumber: '4081781000000001',
        availableBalance: 12.5,
        currency: 'USD',
        status: 'FROZEN',
        type: 'SAVINGS',
      },
    })

    expect(isAccountRowModel(row)).toBe(true)
    expect(row).toMatchObject({
      account: 'Savings account',
      balance: 'USD 12.50',
      enabled: false,
      number: '•• 0001',
    })
  })
})
