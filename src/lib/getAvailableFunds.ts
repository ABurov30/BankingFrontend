import type { GetAccountResponseDto } from '@/shared/api/types'

type AccountBalance = Pick<
  GetAccountResponseDto,
  'availableBalance' | 'reservedBalance'
>

/** Returns the amount currently available to use on an account. */
export function getAvailableFunds(account?: AccountBalance | null) {
  if (account?.availableBalance == null) {
    return undefined
  }

  return account.availableBalance - (account.reservedBalance ?? 0)
}
