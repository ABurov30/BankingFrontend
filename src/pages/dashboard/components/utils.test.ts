import { describe, expect, it } from 'vitest'

import { getAccountName } from './utils'

describe('dashboard helpers', () => {
  it('formats account type labels', () => {
    expect(getAccountName()).toBe('Account')
    expect(getAccountName('CHECKING')).toBe('Checking account')
  })
})
