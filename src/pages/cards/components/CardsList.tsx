import { Skeleton } from '@/components/Skeleton'
import type { CardWithAccount } from '@/features/cards/cardsSlice'
import { LimitsPanel } from './LimitsPanel'
import { PaymentCard } from './PaymentCard'
import type { CardStatusUpdateHandler } from './types'
import styles from '../styles.module.css'

export function CardsList({
  cards,
  emptyLabel,
  isLoading,
  onUpdateStatus,
}: {
  cards: CardWithAccount[]
  emptyLabel: string
  isLoading: boolean
  onUpdateStatus: CardStatusUpdateHandler
}) {
  return (
    <div className={styles['cards__button-icon']}>
      {isLoading ? (
        Array.from({ length: 2 }, (_, index) => (
          <div className={styles['cards__card-group']} key={index}>
            <Skeleton height={230} radius={20} />
            <Skeleton height={220} radius={18} />
          </div>
        ))
      ) : cards.length > 0 ? (
        cards.map(({ account, card }, index) => (
          <div
            className={styles['cards__card-group']}
            key={card.cardId ?? `${card.accountId}-${index}`}
          >
            <PaymentCard
              account={account}
              card={card}
              onUpdateStatus={onUpdateStatus}
            />
            <LimitsPanel account={account} card={card} />
          </div>
        ))
      ) : (
        <section className={`${styles['cards__limits-card']} ui-lift`}>
          <p className={styles['cards__card-subtitle']}>{emptyLabel}</p>
        </section>
      )}
    </div>
  )
}
