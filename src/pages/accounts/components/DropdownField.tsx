import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import styles from '../styles.module.css'

export function DropdownField<Value extends string>({
  isOpen,
  label,
  onOpenChange,
  onSelect,
  options,
  value,
}: {
  isOpen: boolean
  label: string
  onOpenChange: () => void
  onSelect: (value: Value) => void
  options: Value[]
  value: Value
}) {
  return (
    <div className={styles['accounts__field']}>
      <span className={styles['accounts__field-label']}>{label}</span>
      <div className={styles['accounts__dropdown']}>
        <button
          aria-expanded={isOpen}
          className={styles['accounts__dropdown-trigger']}
          onClick={onOpenChange}
          type="button"
        >
          {value}
          <ChevronDown className={styles['accounts__status--review']} />
        </button>

        {isOpen ? (
          <div className={styles['accounts__dropdown-menu']} role="listbox">
            {options.map((option) => (
              <button
                aria-selected={option === value}
                className={cn(
                  styles['accounts__dropdown-option'],
                  option === value &&
                    styles['accounts__dropdown-option--active'],
                )}
                key={option}
                onClick={() => onSelect(option)}
                role="option"
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
