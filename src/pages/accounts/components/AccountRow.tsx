import { Snowflake } from 'lucide-react'

import { AccountStatus } from '@/shared/api/enums'
import { cn } from '@/lib/utils'
import styles from '../styles.module.css'
import type { AccountRowModel } from './types'

type AccountRowProps = AccountRowModel & {
  onFreeze: (accountId: string) => void
  onUnfreeze: (accountId: string) => void
}

export function AccountRow({
  account,
  accountId,
  balance,
  currency,
  icon: Icon,
  iconClassName,
  muted,
  number,
  status,
  statusClassName,
  type,
  onFreeze,
  onUnfreeze,
}: AccountRowProps) {
  return (
    <div
      className={cn(
        styles['accounts__table-row'],
        muted && styles['accounts__toggle--off'],
      )}
    >
      <div className={styles['accounts__account-cell']}>
        <span className={cn(styles['accounts__account-icon'], iconClassName)}>
          <Icon className={styles['accounts__icon']} />
        </span>
        <div className={styles['accounts__account-copy']}>
          <p className={styles['accounts__account-name']}>{account}</p>
          <p className={styles['accounts__account-number']}>{number}</p>
        </div>
      </div>

      <span className={styles['accounts__type']}>{type}</span>
      <span className={styles['accounts__currency']}>{currency}</span>
      <span className={styles['accounts__balance']}>{balance}</span>
      <span className={cn(styles['accounts__status-badge'], statusClassName)}>
        {status}
      </span>
      <button
        aria-label={
          status === AccountStatus.FROZEN
            ? 'Unfreeze account'
            : 'Freeze account'
        }
        className={cn(
          styles['accounts__freeze-toggle'],
          status === AccountStatus.FROZEN &&
            styles['accounts__freeze-toggle--frozen'],
        )}
        onClick={() =>
          status === AccountStatus.FROZEN
            ? onUnfreeze(accountId)
            : onFreeze(accountId)
        }
        type="button"
      >
        <Snowflake />
      </button>
    </div>
  )
}
