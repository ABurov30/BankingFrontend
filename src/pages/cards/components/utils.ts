export { formatMoney } from '@/lib/formatMoney'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'

export function getExpiryLabel(expiresAt?: string) {
  if (!expiresAt) {
    return '--/--'
  }

  const date = new Date(expiresAt)
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getFullYear(),
  ).slice(-2)}`
}

export function getAccountName(account?: GetAccountWithCardsResponseDto) {
  const type = account?.account?.type

  if (!type) {
    return 'Linked account'
  }

  return `${type.charAt(0)}${type.slice(1).toLowerCase()} account`
}
