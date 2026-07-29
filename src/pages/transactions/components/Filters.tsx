import { CalendarDays } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useI18n } from '@/shared/i18n/useI18n'
import type { TranslationKey } from '@/shared/i18n/translations'
import styles from '../styles.module.css'

const filters: TranslationKey[] = [
  'all',
  'created',
  'validated',
  'authorized',
  'completed',
  'declined',
  'cancelled',
]

export function Filters() {
  const { t } = useI18n()

  return (
    <div className={styles['transactions__filters']}>
      <div className={styles['transactions__filter-tabs']}>
        {filters.map((filter) => {
          const active = filter === 'all'
          return (
            <button
              className={cn(
                styles['transactions__filter-button'],
                active
                  ? styles['transactions__filter-button--active']
                  : styles['transactions__filter-button--idle'],
              )}
              key={filter}
              type="button"
            >
              {t(filter)}
            </button>
          )
        })}
      </div>

      <div className={styles['transactions__date-filter']}>
        <button className={styles['transactions__date-button']} type="button">
          <CalendarDays className={styles['transactions__date-icon']} />
          {t('dateRange')}
        </button>
      </div>
    </div>
  )
}
