import { describe, expect, it } from 'vitest'

import {
  getCardDailyLimit,
  getCardDailyLimitMinorUnits,
  getCardLimitTotal,
  getCardMonthlyLimit,
  getCardMonthlyLimitMinorUnits,
  getCardSpendDailyLimit,
  getCardSpendMonthlyLimit,
  mapCardLimitResponse,
} from './cardLimits'

describe('card limit helpers', () => {
  it('normalizes card limits and spend values', () => {
    const card = {
      dailyLimitMinorUnits: 1250,
      monthlyLimitMinorUnits: 5000,
      spendDailyLimitMinorUnits: 250,
      spendMonthlyLimitMinorUnits: 1200,
    }

    expect(getCardDailyLimit(card)).toBe(1250)
    expect(getCardMonthlyLimit(card)).toBe(5000)
    expect(getCardSpendDailyLimit(card)).toBe(250)
    expect(getCardSpendMonthlyLimit(card)).toBe(1200)
    expect(getCardDailyLimitMinorUnits(card)).toBe(1250)
    expect(getCardMonthlyLimitMinorUnits(card)).toBe(5000)
    expect(getCardLimitTotal(card)).toBe(6250)
  })

  it('uses zero for missing or invalid values and preserves response identity', () => {
    const response = { dailyLimitMinorUnits: Number.NaN }

    expect(getCardDailyLimit()).toBe(0)
    expect(getCardMonthlyLimit({ monthlyLimitMinorUnits: Infinity })).toBe(0)
    expect(getCardLimitTotal(response)).toBe(0)
    expect(mapCardLimitResponse(response)).toBe(response)
  })
})
