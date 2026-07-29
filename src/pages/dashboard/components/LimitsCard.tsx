import { cn } from '@/lib/utils'
import { AccountCurrency } from '@/shared/api/enums'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { formatMoney } from './utils'

export function LimitsCard({
  account,
  card,
}: {
  account?: GetAccountWithCardsResponseDto
  card?: GetCardByAccountIdResponseDto
}) {
  const { t } = useI18n()
  const currency = account?.account?.currency ?? AccountCurrency.RUB

  return (
    <section className={styles['dashboard__limits-card']}>
      <LimitRow
        label={t('dailyLimit')}
        value={formatMoney(card?.dailyLimit, currency)}
        widthClassName={styles['dashboard__limit-fill--daily']}
      />
      <LimitRow
        barClassName={styles['dashboard__limit-fill--warning']}
        label={t('monthlyLimit')}
        value={formatMoney(card?.monthlyLimit, currency)}
        widthClassName={styles['dashboard__limit-fill--online']}
      />
    </section>
  )
}

function LimitRow({
  barClassName = styles['dashboard__bar--active'],
  label,
  value,
  widthClassName,
}: {
  barClassName?: string
  label: string
  value: string
  widthClassName: string
}) {
  return (
    <div>
      <div className={styles['dashboard__limit-header']}>
        <h2 className={styles['dashboard__panel-title']}>{label}</h2>
        <span className={styles['dashboard__limit-value']}>{value}</span>
      </div>
      <div className={styles['dashboard__limit-track']}>
        <div
          className={cn(
            styles['dashboard__limit-fill'],
            widthClassName,
            barClassName,
          )}
        />
      </div>
    </div>
  )
}
