import { PiggyBank, Store, WalletCards } from 'lucide-react'

import { formatMoney } from '@/lib/formatMoney'
import { AccountCurrency, AccountStatus, AccountType } from '@/shared/api/enums'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'
import styles from '../styles.module.css'
import type { AccountRowModel } from './types'

function maskAccountNumber(accountNumber?: string) {
  if (!accountNumber) {
    return 'Account number pending'
  }

  return `•• ${accountNumber.slice(-4)}`
}

function getAccountIcon(type?: string) {
  if (type === AccountType.SAVINGS) {
    return PiggyBank
  }

  if (type === AccountType.CREDIT) {
    return Store
  }

  return WalletCards
}

function getIconClassName(type?: string) {
  if (type === AccountType.SAVINGS) {
    return styles['accounts__filter-button--idle']
  }

  if (type === AccountType.CREDIT) {
    return styles['accounts__icon-banking']
  }

  return styles['accounts__filter-button']
}

function getStatusClassName(status?: string) {
  if (status === AccountStatus.ACTIVE) {
    return styles['accounts__filter-button--active']
  }

  return styles['accounts__icon-card']
}

export function mapAccountRow({
  account,
}: GetAccountWithCardsResponseDto): AccountRowModel | null {
  if (!account?.accountId) {
    return null
  }

  const type = account.type ?? AccountType.CHECKING
  const status = account.status ?? AccountStatus.ACTIVE

  return {
    account: `${type.charAt(0)}${type.slice(1).toLowerCase()} account`,
    accountId: account.accountId,
    balance: formatMoney(account.availableBalance, account.currency),
    currency: account.currency ?? AccountCurrency.USD,
    enabled: status === AccountStatus.ACTIVE,
    icon: getAccountIcon(type),
    iconClassName: getIconClassName(type),
    muted: status !== AccountStatus.ACTIVE,
    number: maskAccountNumber(account.accountNumber),
    status,
    statusClassName: getStatusClassName(status),
    type,
  }
}

export function isAccountRowModel(
  account: AccountRowModel | null,
): account is AccountRowModel {
  return account !== null
}
