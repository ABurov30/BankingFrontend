import { Landmark, WalletCards } from 'lucide-react'

import { Skeleton } from '@/components/Skeleton'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import { cn } from '@/lib/utils'
import { AccountCurrency, AccountStatus, AccountType } from '@/shared/api/enums'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'
import styles from '../styles.module.css'
import { formatMoney, getAccountName } from './utils'

function getAccountAccent(type?: string) {
  return type === AccountType.SAVINGS
    ? styles['dashboard__account-accent--savings']
    : styles['dashboard__account-accent--checking']
}

export function AccountsGrid({
  accounts,
  isLoading = false,
}: {
  accounts: GetAccountWithCardsResponseDto[]
  isLoading?: boolean
}) {
  if (isLoading && accounts.length === 0) {
    return (
      <div className={styles['dashboard__accounts-grid']}>
        {Array.from({ length: 2 }, (_, index) => (
          <article className={styles['dashboard__account-card']} key={index}>
            <div className={styles['dashboard__card-header']}>
              <div className={styles['dashboard__inline-group']}>
                <Skeleton height={42} radius={14} width={42} />
                <div>
                  <Skeleton height={16} width={140} />
                  <Skeleton height={13} width={100} />
                </div>
              </div>
              <Skeleton height={26} width={76} />
            </div>
            <Skeleton height={30} radius={10} width={150} />
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className={styles['dashboard__accounts-grid']}>
      {accounts.map(({ account }) => {
        if (!account?.accountId) {
          return null
        }

        const Icon =
          account.type === AccountType.SAVINGS ? Landmark : WalletCards
        const suffix = account.accountNumber?.slice(-4) ?? '----'

        return (
          <article
            className={styles['dashboard__account-card']}
            key={account.accountId}
          >
            <div className={styles['dashboard__card-header']}>
              <div className={styles['dashboard__inline-group']}>
                <span
                  className={cn(
                    styles['dashboard__account-icon-wrap'],
                    getAccountAccent(account.type),
                  )}
                >
                  <Icon className={styles['dashboard__card-icon']} />
                </span>
                <div>
                  <h2 className={styles['dashboard__account-name']}>
                    {getAccountName(account.type)}
                  </h2>
                  <p className={styles['dashboard__account-meta']}>
                    {account.currency ?? AccountCurrency.USD} · •• {suffix}
                  </p>
                </div>
              </div>
              <span className={styles['dashboard__account-status']}>
                {account.status ?? AccountStatus.ACTIVE}
              </span>
            </div>
            <p className={styles['dashboard__account-balance']}>
              {formatMoney(getAvailableFunds(account), account.currency)}
            </p>
          </article>
        )
      })}
    </div>
  )
}
