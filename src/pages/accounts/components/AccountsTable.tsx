import { Skeleton } from '@/components/Skeleton'
import { useI18n } from '@/shared/i18n/useI18n'

import styles from '../styles.module.css'
import { AccountRow } from './AccountRow'
import type { AccountRowModel } from './types'

export function AccountsTable({
  accounts,
  isLoading = false,
  onFreeze,
}: {
  accounts: AccountRowModel[]
  isLoading?: boolean
  onFreeze: (accountId: string) => void
}) {
  const { t } = useI18n()

  return (
    <div className={`${styles['accounts__table-card']} ui-lift`}>
      <div className={styles['accounts__table-scroll']}>
        <div className={styles['accounts__table-head']}>
          <div className={styles['accounts__account-head']}>
            <span>{t('account')}</span>
            <span>{t('type')}</span>
            <span>{t('currency')}</span>
            <span className={styles['accounts__head-cell']}>
              {t('balance')}
            </span>
            <span>{t('status')}</span>
            <span className={styles['accounts__head-cell']}>
              {t('actions')}
            </span>
          </div>

          {isLoading && accounts.length === 0
            ? Array.from({ length: 5 }, (_, index) => (
                <div className={styles['accounts__account-row']} key={index}>
                  <Skeleton height={18} width={150} />
                  <Skeleton height={18} width={92} />
                  <Skeleton height={18} width={72} />
                  <Skeleton height={18} width={96} />
                  <Skeleton height={26} width={76} />
                  <Skeleton height={34} width={34} />
                </div>
              ))
            : accounts.map((account) => (
                <AccountRow
                  key={account.accountId}
                  {...account}
                  onFreeze={onFreeze}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
