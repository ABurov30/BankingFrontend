import { describe, expect, it } from 'vitest'

import { formatMoney } from './formatMoney'

describe('formatMoney', () => {
  it('formats an amount with the currency symbol and two fraction digits', () => {
    expect(formatMoney(1234.5, 'USD')).toBe('$ 1,234.50')
  })

  it('uses zero and USD when values are omitted', () => {
    expect(formatMoney()).toBe('$ 0.00')
  })
})
