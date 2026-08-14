import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CardStatus as CardStatusValue } from '@/shared/api/enums'
import styles from '../styles.module.css'

export function CardsPageHeader({
  isCreatingCard,
  labels,
  onCreateCard,
  onStatusFilterChange,
  statusFilter,
  statusFilters,
}: {
  isCreatingCard: boolean
  labels: {
    cards: string
    issueCard: string
    issuing: string
  }
  onCreateCard: () => void
  onStatusFilterChange: (status: CardStatusValue) => void
  statusFilter: CardStatusValue
  statusFilters: CardStatusValue[]
}) {
  return (
    <header className={styles['cards__stack']}>
      <h1 className={styles['cards__header']}>{labels.cards}</h1>

      <div className={styles['cards__header-actions']}>
        <div className={styles['cards__status-filters']}>
          {statusFilters.map((filter) => (
            <button
              className={cn(
                styles['cards__status-filter-button'],
                filter === statusFilter &&
                  styles['cards__status-filter-button--active'],
              )}
              key={filter}
              onClick={() => onStatusFilterChange(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          className={`${styles['cards__title']} ui-lift`}
          disabled={isCreatingCard}
          onClick={onCreateCard}
          type="button"
        >
          <Plus className={styles['cards__add-button']} />
          {isCreatingCard ? labels.issuing : labels.issueCard}
        </button>
      </div>
    </header>
  )
}
