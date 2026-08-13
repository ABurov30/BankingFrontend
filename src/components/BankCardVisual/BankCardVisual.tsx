import { useAppSelector } from '@/app/hooks'
import { selectCurrentUser } from '@/features/user/userSlice'
import { cn } from '@/lib/utils'
import { CardStatus } from '@/shared/api/enums'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

function getExpiryLabel(expiresAt?: string) {
  const date = expiresAt ? new Date(expiresAt) : null

  if (!date || Number.isNaN(date.getTime())) {
    return '--/--'
  }

  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getFullYear(),
  ).slice(-2)}`
}

function useBankCardData({
  card,
  holderName,
}: {
  card?: GetCardByAccountIdResponseDto
  holderName?: string
}) {
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const userFullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  const cardHolderName = userFullName || holderName || t('buroUser')
  const status = card?.status ?? CardStatus.ACTIVE

  return {
    cardHolderName,
    cardType: 'DEBIT',
    expiresLabel: getExpiryLabel(card?.expiresAt),
    panSuffix: card?.pan?.slice(-4) ?? '----',
    status,
    t,
  }
}

function getColorClassNames(status: CardStatus) {
  return [
    styles['bank-card--debit'],
    status === CardStatus.ACTIVE && styles['bank-card--active'],
    status === CardStatus.BLOCKED && styles['bank-card--blocked'],
    status === CardStatus.EXPIRED && styles['bank-card--expired'],
    status === CardStatus.FROZEN && styles['bank-card--frozen'],
  ]
}

export function DashboardBankCardVisual({
  card,
  holderName,
}: {
  card?: GetCardByAccountIdResponseDto
  holderName?: string
}) {
  const { cardHolderName, cardType, expiresLabel, panSuffix, status, t } =
    useBankCardData({ card, holderName })

  return (
    <section
      className={cn(
        styles['bank-card'],
        styles['bank-card--dashboard'],
        getColorClassNames(status),
        'ui-lift',
      )}
    >
      <div className={styles['bank-card__orb-primary']} />
      <div className={styles['bank-card__orb-secondary']} />

      <div className={styles['bank-card__content']}>
        <div className={styles['bank-card__header']}>
          <span className={styles['bank-card__brand']}>buro</span>
          <span className={styles['bank-card__type']}>{cardType}</span>
        </div>

        <p className={styles['bank-card__pan']}>•••• •••• •••• {panSuffix}</p>

        <div className={styles['bank-card__footer']}>
          <div>
            <p className={styles['bank-card__label']}>CARD HOLDER</p>
            <p className={styles['bank-card__value']}>{cardHolderName}</p>
          </div>
          <div>
            <p className={styles['bank-card__label']}>{t('expires')}</p>
            <p className={styles['bank-card__value']}>{expiresLabel}</p>
          </div>
          <div className={styles['bank-card__network']}>
            <span className={styles['bank-card__network-dot--red']} />
            <span className={styles['bank-card__network-dot--orange']} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function CardsBankCardVisual({
  card,
}: {
  card?: GetCardByAccountIdResponseDto
}) {
  const { cardHolderName, cardType, expiresLabel, panSuffix, status } =
    useBankCardData({ card })

  return (
    <section
      className={cn(
        styles['bank-card'],
        styles['bank-card--cards'],
        getColorClassNames(status),
        'ui-lift',
      )}
    >
      <div className={styles['bank-card__orb-primary']} />
      <div className={styles['bank-card__orb-secondary']} />

      <div className={styles['bank-card__content']}>
        <div className={styles['bank-card__header']}>
          <span className={styles['bank-card__brand']}>buro</span>
          <span className={styles['bank-card__type']}>{cardType}</span>
        </div>

        <p className={styles['bank-card__pan']}>•••• •••• •••• {panSuffix}</p>

        <div className={styles['bank-card__footer']}>
          <span className={styles['bank-card__value']}>{cardHolderName}</span>
          <span className={styles['bank-card__value']}>{expiresLabel}</span>
          <div className={styles['bank-card__network']}>
            <span className={styles['bank-card__network-dot--red']} />
            <span className={styles['bank-card__network-dot--orange']} />
          </div>
        </div>
      </div>
    </section>
  )
}
