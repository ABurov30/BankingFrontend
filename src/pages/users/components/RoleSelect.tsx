import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { roleOptions, type Role } from '@/shared/api/enums'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function RoleSelect({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean
  onChange: (role: Role) => void
  value?: Role
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <div className={styles['users__role-select']}>
      <button
        aria-expanded={isOpen}
        className={styles['users__role-trigger']}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {value ?? 'USER'}
        <ChevronDown className={styles['users__role-chevron']} />
      </button>
      {isOpen ? (
        <div className={styles['users__role-menu']} role="listbox">
          {roleOptions.map((role) => (
            <button
              aria-selected={role === value}
              className={cn(
                styles['users__role-option'],
                role === value && styles['users__role-option--selected'],
              )}
              key={role}
              onClick={() => {
                setIsOpen(false)
                onChange(role)
              }}
              role="option"
              type="button"
            >
              {role}
              {role === value ? <Check aria-label={t('selected')} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
