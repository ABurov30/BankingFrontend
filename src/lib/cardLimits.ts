import type {
  GetCardByAccountIdResponseDto,
  UpdateCardResponseDto,
} from '@/shared/api/types'
import { normalizeMinorUnits } from './moneyAmount'

type CardLimitFields = GetCardByAccountIdResponseDto &
  Partial<UpdateCardResponseDto>

function amountOrZero(value?: number) {
  return Number.isFinite(value) ? (value ?? 0) : 0
}

function limitMinorUnits(minorUnits?: number) {
  return normalizeMinorUnits(minorUnits)
}

export function getCardDailyLimit(card?: CardLimitFields) {
  return limitMinorUnits(card?.dailyLimitMinorUnits)
}

export function getCardMonthlyLimit(card?: CardLimitFields) {
  return limitMinorUnits(card?.monthlyLimitMinorUnits)
}

export function getCardSpendDailyLimit(card?: CardLimitFields) {
  return limitMinorUnits(card?.spendDailyLimitMinorUnits)
}

export function getCardSpendMonthlyLimit(card?: CardLimitFields) {
  return limitMinorUnits(card?.spendMonthlyLimitMinorUnits)
}

export function getCardDailyLimitMinorUnits(card?: CardLimitFields) {
  return getCardDailyLimit(card)
}

export function getCardMonthlyLimitMinorUnits(card?: CardLimitFields) {
  return getCardMonthlyLimit(card)
}

export function mapCardLimitResponse(card: UpdateCardResponseDto) {
  return card
}

export function getCardLimitTotal(card: CardLimitFields) {
  return (
    amountOrZero(getCardDailyLimit(card)) +
    amountOrZero(getCardMonthlyLimit(card))
  )
}
