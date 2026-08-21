import type {
  GetCardByAccountIdResponseDto,
  UpdateCardResponseDto,
} from '@/shared/api/types'
import { amountToMinorUnits, minorUnitsToAmount } from './moneyAmount'

type CardLimitFields = GetCardByAccountIdResponseDto &
  Partial<UpdateCardResponseDto>

function amountOrZero(value?: number) {
  return Number.isFinite(value) ? (value ?? 0) : 0
}

function limitAmount(majorUnits?: number, minorUnits?: number) {
  if (Number.isFinite(majorUnits)) {
    return majorUnits ?? 0
  }

  return minorUnitsToAmount(minorUnits)
}

export function getCardDailyLimit(card?: CardLimitFields) {
  return limitAmount(card?.dailyLimit, card?.dailyLimitMinorUnits)
}

export function getCardMonthlyLimit(card?: CardLimitFields) {
  return limitAmount(card?.monthlyLimit, card?.monthlyLimitMinorUnits)
}

export function getCardSpendDailyLimit(card?: CardLimitFields) {
  return limitAmount(card?.spendDailyLimit, card?.spendDailyLimitMinorUnits)
}

export function getCardSpendMonthlyLimit(card?: CardLimitFields) {
  return limitAmount(card?.spendMonthlyLimit, card?.spendMonthlyLimitMinorUnits)
}

export function getCardDailyLimitMinorUnits(card?: CardLimitFields) {
  return amountToMinorUnits(getCardDailyLimit(card))
}

export function getCardMonthlyLimitMinorUnits(card?: CardLimitFields) {
  return amountToMinorUnits(getCardMonthlyLimit(card))
}

export function mapCardLimitResponse(card: UpdateCardResponseDto) {
  return {
    ...card,
    dailyLimit: limitAmount(undefined, card.dailyLimitMinorUnits),
    monthlyLimit: limitAmount(undefined, card.monthlyLimitMinorUnits),
    spendDailyLimit: limitAmount(undefined, card.spendDailyLimitMinorUnits),
    spendMonthlyLimit: limitAmount(undefined, card.spendMonthlyLimitMinorUnits),
  }
}

export function getCardLimitTotal(card: CardLimitFields) {
  return (
    amountOrZero(getCardDailyLimit(card)) +
    amountOrZero(getCardMonthlyLimit(card))
  )
}
