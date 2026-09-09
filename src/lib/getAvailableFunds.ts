import type { GetAccountResponseDto } from '@/shared/api/types'

type AccountBalance = Pick<
  GetAccountResponseDto,
  'availableBalanceMinorUnits' | 'reservedBalanceMinorUnits'
>

/** Returns available account funds in minor units. */
export function getAvailableFunds(account?: AccountBalance | null) {
  if (account?.availableBalanceMinorUnits == null) {
    return undefined
  }

  return (
    account.availableBalanceMinorUnits - (account.reservedBalanceMinorUnits ?? 0)
  )
}
