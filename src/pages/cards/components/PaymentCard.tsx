import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { CardsBankCardVisual } from '@/components/BankCardVisual'
import { cn } from '@/lib/utils'
import {
  CardStatus,
  type CardStatus as CardStatusValue,
} from '@/shared/api/enums'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import type { CardStatusUpdateHandler, EditableCardStatus } from './types'
import { getAccountName } from './utils'

const statusBadgeClassNameByStatus: Record<CardStatusValue, string> = {
  [CardStatus.ACTIVE]: styles['cards__status-badge--active'],
  [CardStatus.BLOCKED]: styles['cards__status-badge--blocked'],
  [CardStatus.EXPIRED]: styles['cards__status-badge--expired'],
  [CardStatus.FROZEN]: styles['cards__status-badge--frozen'],
}

const editableCardStatuses: EditableCardStatus[] = [
  CardStatus.ACTIVE,
  CardStatus.BLOCKED,
  CardStatus.FROZEN,
]

export function PaymentCard({
  account,
  card,
  onUpdateStatus,
}: {
  account?: GetAccountWithCardsResponseDto
  card?: GetCardByAccountIdResponseDto
  onUpdateStatus: CardStatusUpdateHandler
}) {
  const { t } = useI18n()
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const status = card?.status ?? CardStatus.ACTIVE

  const handleStatusSelect = (nextStatus: EditableCardStatus) => {
    setIsStatusMenuOpen(false)
    onUpdateStatus(card, nextStatus)
  }

  return (
    <article className={styles['cards__main']}>
      <CardsBankCardVisual account={account} card={card} />

      <div className={styles['cards__card-summary']}>
        <div className={styles['cards__main']}>
          <h2 className={styles['cards__card-title']}>
            {card?.cardId
              ? `Buro card · ${card.cardId.slice(0, 8)}`
              : t('noCardIssued')}
          </h2>
          <p className={styles['cards__card-subtitle']}>
            Linked to {getAccountName(account)}
          </p>
        </div>
        <div className={styles['cards__status-menu']}>
          <button
            aria-expanded={isStatusMenuOpen}
            className={cn(
              styles['cards__status-badge'],
              statusBadgeClassNameByStatus[status],
            )}
            disabled={!card}
            onClick={() => setIsStatusMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            {status}
            <ChevronDown className={styles['cards__status-badge-icon']} />
          </button>

          {isStatusMenuOpen ? (
            <div className={styles['cards__status-menu-list']} role="menu">
              {editableCardStatuses.map((option) => (
                <button
                  className={cn(
                    styles['cards__status-menu-option'],
                    option === status &&
                      styles['cards__status-menu-option--active'],
                  )}
                  key={option}
                  onClick={() => handleStatusSelect(option)}
                  role="menuitem"
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
