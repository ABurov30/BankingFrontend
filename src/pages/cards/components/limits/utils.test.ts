import { describe, expect, it } from 'vitest'

import { getLimitUsageWidth, getLimitValue } from './utils'

describe('card limit utilities', () => {
  it('normalizes missing limits', () => {
    expect(getLimitValue()).toBe(0)
    expect(getLimitValue(250)).toBe(250)
  })

  it('calculates spent limit width safely', () => {
    expect(getLimitUsageWidth(25, 100)).toBe('25%')
    expect(getLimitUsageWidth(150, 100)).toBe('100%')
    expect(getLimitUsageWidth(-20, 100)).toBe('0%')
    expect(getLimitUsageWidth(50, 0)).toBe('0%')
    expect(getLimitUsageWidth()).toBe('0%')
  })
})
