import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react'

import { useAppDispatch } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { cn } from '@/lib/utils'
import { AccountCurrency } from '@/shared/api/enums'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { formatMoney } from './utils'

export function BalanceHero({
  accounts,
  isFetching,
}: {
  accounts: GetAccountWithCardsResponseDto[]
  isFetching: boolean
}) {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const showSkeleton = isFetching && accounts.length === 0
  const openTransferPanel = () => dispatch(openRightPanel('transfer'))
  const totalBalance = accounts.reduce(
    (sum, item) => sum + (item.account?.availableBalance ?? 0),
    0,
  )
  const currency = accounts[0]?.account?.currency ?? AccountCurrency.USD
  const [whole, cents] = formatMoney(totalBalance, currency).split('.')

  return (
    <section className={styles['dashboard__balance-hero']}>
      <div>
        <p className={styles['dashboard__balance-label']}>
          {showSkeleton ? (
            <Skeleton height={16} width={190} />
          ) : (
            `Total balance · ${accounts.length} ${t('totalAccounts')}`
          )}
        </p>
        <h1 className={styles['dashboard__balance-value']}>
          {showSkeleton ? (
            <Skeleton height={48} radius={14} width={260} />
          ) : (
            <>
              {whole}
              {cents ? (
                <span className={styles['dashboard__balance-cents']}>
                  .{cents}
                </span>
              ) : null}
            </>
          )}
        </h1>
      </div>

      <div className={styles['dashboard__quick-actions']}>
        <ActionButton
          icon={ArrowUpRight}
          label={t('transfer')}
          onClick={openTransferPanel}
          primary
        />
        <ActionButton icon={Plus} label={t('topUp')} onClick={openTransferPanel} />
        <ActionButton
          icon={ArrowDownLeft}
          label={t('request')}
          onClick={openTransferPanel}
        />
      </div>
    </section>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof ArrowUpRight
  label: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      className={cn(
        styles['dashboard__action-button'],
        primary
          ? styles['dashboard__action-button--primary']
          : styles['dashboard__action-button--secondary'],
      )}
      onClick={onClick}
      type="button"
    >
      <Icon className={styles['dashboard__action-icon']} />
      {label}
    </button>
  )
}
