import { describe, expect, it } from 'vitest'

import {
  amountToMinorUnits,
  formatMinorUnitInput,
  minorUnitsToAmount,
  normalizeMinorUnits,
  parseMoneyAmountInput,
} from './moneyAmount'

describe('money amount helpers', () => {
  it('formats typed digits as a minor-unit money mask', () => {
    expect(formatMinorUnitInput('2')).toBe('00.02')
    expect(formatMinorUnitInput('20')).toBe('00.20')
    expect(formatMinorUnitInput('1234')).toBe('12.34')
    expect(formatMinorUnitInput('12.34')).toBe('12.34')
    expect(formatMinorUnitInput('')).toBe('')
  })

  it('parses whole and fractional amount input into amount and minor units', () => {
    expect(parseMoneyAmountInput('00.20')).toEqual({
      amount: 0.2,
      minorUnits: 20,
    })
    expect(parseMoneyAmountInput('00.02')).toEqual({
      amount: 0.02,
      minorUnits: 2,
    })
    expect(parseMoneyAmountInput('20.00')).toEqual({
      amount: 20,
      minorUnits: 2000,
    })
    expect(parseMoneyAmountInput('02.00')).toEqual({
      amount: 2,
      minorUnits: 200,
    })
    expect(parseMoneyAmountInput('12')).toEqual({
      amount: 12,
      minorUnits: 1200,
    })
    expect(parseMoneyAmountInput('12.3')).toEqual({
      amount: 12.3,
      minorUnits: 1230,
    })
    expect(parseMoneyAmountInput('12,34')).toEqual({
      amount: 12.34,
      minorUnits: 1234,
    })
    expect(parseMoneyAmountInput('12,')).toEqual({
      amount: 12,
      minorUnits: 1200,
    })
  })

  it('rejects invalid or sub-cent amount input', () => {
    expect(parseMoneyAmountInput('')).toBeNull()
    expect(parseMoneyAmountInput('0')).toBeNull()
    expect(parseMoneyAmountInput('12.345')).toBeNull()
    expect(parseMoneyAmountInput('12,345')).toBeNull()
    expect(parseMoneyAmountInput('12.3.4')).toBeNull()
  })

  it('allows zero only when requested', () => {
    expect(parseMoneyAmountInput('0.00', { allowZero: true })).toEqual({
      amount: 0,
      minorUnits: 0,
    })
  })

  it('converts minor units to major amount values for display', () => {
    expect(minorUnitsToAmount(12345)).toBe(123.45)
  })

  it('converts major amount values to minor units for API requests', () => {
    expect(amountToMinorUnits(0.2)).toBe(20)
    expect(amountToMinorUnits(20)).toBe(2000)
  })

  it('normalizes decimal limit payloads to integer minor units', () => {
    expect(normalizeMinorUnits(202.22)).toBe(20222)
    expect(normalizeMinorUnits(20222)).toBe(20222)
    expect(minorUnitsToAmount(202.22)).toBe(202.22)
  })
})
