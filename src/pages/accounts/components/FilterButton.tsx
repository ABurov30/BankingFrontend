import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function FilterButton<Value extends string>({
  label,
  onSelect,
  options,
  value,
}: {
  label: string
  onSelect: (value: Value) => void
  options: Value[]
  value: Value
}) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const isActive = value !== 'ALL'
  const allLabel = t('all')

  return (
    <div className={styles['accounts__filter-menu']}>
      <button
        aria-expanded={isOpen}
        className={cn(
          styles['accounts__icon-savings'],
          isActive
            ? styles['accounts__status']
            : styles['accounts__status--active'],
        )}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {label}: {value === 'ALL' ? allLabel : value}
        <ChevronDown
          className={cn(
            styles['accounts__status--review'],
            isActive
              ? styles['accounts__toggle']
              : styles['accounts__toggle--on'],
          )}
        />
      </button>

      {isOpen ? (
        <div className={styles['accounts__filter-menu-list']} role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option === value}
              className={cn(
                styles['accounts__filter-menu-option'],
                option === value &&
                  styles['accounts__filter-menu-option--active'],
              )}
              key={option}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
              role="option"
              type="button"
            >
              {option === 'ALL' ? allLabel : option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
