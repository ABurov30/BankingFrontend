import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { AuthUserStatus } from '@/shared/api/enums'
import styles from '../styles.module.css'

const selectableStatuses = [
  AuthUserStatus.ACTIVE,
  AuthUserStatus.BLOCKED,
] as const

type SelectableUserStatus = (typeof selectableStatuses)[number]

export function UserStatusSelect({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean
  onChange: (status: SelectableUserStatus) => Promise<void>
  value: AuthUserStatus
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [optimisticValue, setOptimisticValue] = useState<AuthUserStatus | null>(
    null,
  )
  const displayedValue = optimisticValue ?? value

  useEffect(() => {
    setOptimisticValue(null)
  }, [value])

  const selectStatus = (status: SelectableUserStatus) => {
    setIsOpen(false)

    if (status === displayedValue) return

    setOptimisticValue(status)
    void onChange(status).catch(() => undefined)
  }

  return (
    <div className={styles['users__status-select']}>
      <button
        aria-expanded={isOpen}
        className={cn(
          styles['users__status-trigger'],
          displayedValue === AuthUserStatus.PENDING &&
            styles['users__status-trigger--pending'],
          displayedValue === AuthUserStatus.BLOCKED &&
            styles['users__status-trigger--blocked'],
        )}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {displayedValue}
        <ChevronDown className={styles['users__status-chevron']} />
      </button>
      {isOpen ? (
        <div className={styles['users__status-menu']} role="listbox">
          {selectableStatuses.map((status) => (
            <button
              aria-selected={status === displayedValue}
              className={cn(
                styles['users__status-option'],
                status === displayedValue &&
                  styles['users__status-option--selected'],
                status === AuthUserStatus.BLOCKED &&
                  styles['users__status-option--blocked'],
              )}
              key={status}
              onClick={() => selectStatus(status)}
              role="option"
              type="button"
            >
              {status}
              {status === displayedValue ? <Check /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
