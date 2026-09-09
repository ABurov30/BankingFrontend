import { describe, expect, it } from 'vitest'

import { formatMoney } from './formatMoney'

describe('formatMoney', () => {
  it('formats minor units with the currency symbol and configured fraction digits', () => {
    expect(formatMoney(123450, 'USD')).toBe('$ 1,234.50')
  })

  it('uses zero and USD when values are omitted', () => {
    expect(formatMoney()).toBe('$ 0.00')
  })
})
