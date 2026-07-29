import type { LucideIcon } from 'lucide-react'

import type {
  AccountCurrency,
  AccountStatus,
  AccountType,
} from '@/shared/api/enums'
import type { CreateAccountRequest } from '@/shared/api/types'

export type CreateAccountFormValues = Pick<
  CreateAccountRequest,
  'currency' | 'type'
>

export type AccountRowModel = {
  account: string
  accountId: string
  balance: string
  currency: string
  icon: LucideIcon
  iconClassName: string
  number: string
  status: string
  statusClassName: string
  type: string
  enabled: boolean
  muted?: boolean
}

export type AccountFilterValue = 'ALL'
export type AccountStatusFilter = AccountStatus | AccountFilterValue
export type AccountTypeFilter = AccountType | AccountFilterValue
export type AccountCurrencyFilter = AccountCurrency | AccountFilterValue

export type AccountFilters = {
  currency: AccountCurrencyFilter
  status: AccountStatusFilter
  type: AccountTypeFilter
}
