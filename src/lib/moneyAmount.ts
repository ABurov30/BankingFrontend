import {
  AccountCurrency,
  AccountCurrencyMinorUnit,
  type AccountCurrency as AccountCurrencyValue,
} from '@/shared/api/enums'

export type ParsedMoneyAmount = {
  amount: number
  minorUnits: number
}

type ParseMoneyAmountOptions = {
  allowZero?: boolean
  currency?: AccountCurrencyValue
}

export function formatMinorUnitInput(
  value: string,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const digits = value.replace(/\D/g, '')
  const minorUnit = getCurrencyMinorUnit(currency)

  if (!digits) {
    return ''
  }

  const minorUnits = Number(digits)

  if (!Number.isSafeInteger(minorUnits)) {
    return value
  }

  const factor = getMinorUnitFactor(currency)
  const wholeUnits = Math.floor(minorUnits / factor)
  const fractionUnits = minorUnits % factor

  if (minorUnit === 0) {
    return String(wholeUnits)
  }

  return `${String(wholeUnits).padStart(2, '0')}.${String(fractionUnits).padStart(minorUnit, '0')}`
}

export function parseMoneyAmountInput(
  value: string,
  {
    allowZero = false,
    currency = AccountCurrency.USD,
  }: ParseMoneyAmountOptions = {},
): ParsedMoneyAmount | null {
  const normalizedValue = value.trim().replace(',', '.')
  const minorUnit = getCurrencyMinorUnit(currency)
  const moneyAmountPattern = getMoneyAmountPattern(minorUnit)

  if (!moneyAmountPattern.test(normalizedValue)) {
    return null
  }

  const [wholePart, fractionPart = ''] = normalizedValue.split('.')
  const wholeUnits = Number(wholePart)
  const fractionUnits = Number(fractionPart.padEnd(minorUnit, '0'))

  if (
    !Number.isSafeInteger(wholeUnits) ||
    !Number.isSafeInteger(fractionUnits)
  ) {
    return null
  }

  const factor = getMinorUnitFactor(currency)
  const minorUnits = wholeUnits * factor + fractionUnits

  if (
    !Number.isSafeInteger(minorUnits) ||
    minorUnits < 0 ||
    (!allowZero && minorUnits === 0)
  ) {
    return null
  }

  return {
    amount: minorUnits / factor,
    minorUnits,
  }
}

export function amountToMinorUnits(
  amount = 0,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  if (!Number.isFinite(amount)) {
    return 0
  }

  return Math.round(amount * getMinorUnitFactor(currency))
}

export function normalizeMinorUnits(value = 0) {
  if (!Number.isFinite(value)) {
    return 0
  }

  if (Number.isInteger(value)) {
    return value
  }

  return amountToMinorUnits(value)
}

export function minorUnitsToAmount(
  minorUnits = 0,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  return normalizeMinorUnits(minorUnits) / getMinorUnitFactor(currency)
}

export function getCurrencyMinorUnit(
  currency: AccountCurrencyValue = AccountCurrency.USD,
): number {
  return AccountCurrencyMinorUnit[currency]
}

export function getMoneyAmountInputPattern(
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const minorUnit = getCurrencyMinorUnit(currency)

  if (minorUnit === 0) {
    return '[0-9]+'
  }

  return `[0-9]+[.][0-9]{${minorUnit}}`
}

export function getMoneyAmountInputPlaceholder(
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const minorUnit = getCurrencyMinorUnit(currency)

  if (minorUnit === 0) {
    return '0'
  }

  return `0.${'0'.repeat(minorUnit)}`
}

function getMinorUnitFactor(currency: AccountCurrencyValue) {
  return 10 ** getCurrencyMinorUnit(currency)
}

function getMoneyAmountPattern(minorUnit: number) {
  if (minorUnit === 0) {
    return /^\d+$/
  }

  return new RegExp(`^\\d+(?:[,.]\\d{0,${minorUnit}})?$`)
}
