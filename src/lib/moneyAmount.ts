export type ParsedMoneyAmount = {
  amount: number
  minorUnits: number
}

type ParseMoneyAmountOptions = {
  allowZero?: boolean
}

const moneyAmountPattern = /^\d+(?:[,.]\d{0,2})?$/

export function formatMinorUnitInput(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const minorUnits = Number(digits)

  if (!Number.isSafeInteger(minorUnits)) {
    return value
  }

  const wholeUnits = Math.floor(minorUnits / 100)
  const fractionUnits = minorUnits % 100

  return `${String(wholeUnits).padStart(2, '0')}.${String(fractionUnits).padStart(2, '0')}`
}

export function parseMoneyAmountInput(
  value: string,
  { allowZero = false }: ParseMoneyAmountOptions = {},
): ParsedMoneyAmount | null {
  const normalizedValue = value.trim().replace(',', '.')

  if (!moneyAmountPattern.test(normalizedValue)) {
    return null
  }

  const [wholePart, fractionPart = ''] = normalizedValue.split('.')
  const wholeUnits = Number(wholePart)
  const fractionUnits = Number(fractionPart.padEnd(2, '0'))

  if (
    !Number.isSafeInteger(wholeUnits) ||
    !Number.isSafeInteger(fractionUnits)
  ) {
    return null
  }

  const minorUnits = wholeUnits * 100 + fractionUnits

  if (
    !Number.isSafeInteger(minorUnits) ||
    minorUnits < 0 ||
    (!allowZero && minorUnits === 0)
  ) {
    return null
  }

  return {
    amount: minorUnits / 100,
    minorUnits,
  }
}

export function amountToMinorUnits(amount = 0) {
  if (!Number.isFinite(amount)) {
    return 0
  }

  return Math.round(amount * 100)
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

export function minorUnitsToAmount(minorUnits = 0) {
  return normalizeMinorUnits(minorUnits) / 100
}
