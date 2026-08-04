import { CreditCard, Lock, Unlock } from 'lucide-react'

import {
  AccountCurrency,
  AccountStatus,
  CardStatus,
  type AccountStatus as AccountStatusValue,
} from '@/shared/api/enums'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import { formatMoney } from '@/lib/formatMoney'
import styles from '../styles.module.css'

export function UserCardItem({
  accountStatus,
  card,
  currency,
  isUpdating,
  onUpdateStatus,
}: {
  accountStatus?: AccountStatusValue
  card: GetCardByAccountIdResponseDto
  currency?: AccountCurrency
  isUpdating: boolean
  onUpdateStatus: (
    card: GetCardByAccountIdResponseDto,
    status: CardStatus,
  ) => void
}) {
  const { t } = useI18n()
  const cardId = card.cardId
  const isAccountFrozen = accountStatus === AccountStatus.FROZEN
  const status = isAccountFrozen ? CardStatus.FROZEN : card.status
  const canFreeze = status === CardStatus.ACTIVE
  const canUnfreeze = status === CardStatus.FROZEN && !isAccountFrozen

  return (
    <div className={styles['user-details__card']}>
      <div className={styles['user-details__card-main']}>
        <CreditCard />
        <span>{card.pan ?? t('dataUnavailable')}</span>
        <small>{status ?? t('dataUnavailable')}</small>
      </div>
      <div className={styles['user-details__limits']}>
        <span>
          {t('dailyLimit')}: {formatMoney(card.dailyLimit, currency)}
        </span>
        <span>
          {t('monthlyLimit')}: {formatMoney(card.monthlyLimit, currency)}
        </span>
      </div>
      {canFreeze ? (
        <button
          className={styles['user-details__freeze']}
          disabled={!cardId || isUpdating}
          onClick={() => cardId && onUpdateStatus(card, CardStatus.FROZEN)}
          type="button"
        >
          <Lock /> {t('freeze')}
        </button>
      ) : null}
      {canUnfreeze ? (
        <button
          className={styles['user-details__freeze']}
          disabled={!cardId || isUpdating}
          onClick={() => cardId && onUpdateStatus(card, CardStatus.ACTIVE)}
          type="button"
        >
          <Unlock /> {t('unfreeze')}
        </button>
      ) : null}
    </div>
  )
}
