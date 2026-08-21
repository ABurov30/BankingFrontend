import { amountToMinorUnits, formatMinorUnitInput } from '@/lib/moneyAmount'

export function getLimitValue(value?: number) {
  return Number.isFinite(value) ? value ?? 0 : 0
}

export function getLimitInputValue(value = 0) {
  return formatMinorUnitInput(String(Math.max(0, amountToMinorUnits(value))))
}

export function getLimitUsageWidth(spent?: number, limit?: number) {
  const limitValue = Math.max(0, getLimitValue(limit))

  if (limitValue <= 0) {
    return '0%'
  }

  const spentValue = Math.max(0, getLimitValue(spent))
  const percent = Math.min((spentValue / limitValue) * 100, 100)

  return `${percent}%`
}
