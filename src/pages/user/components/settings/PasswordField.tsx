import { Eye, EyeOff } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import styles from '../../styles.module.css'

export function PasswordField({
  isVisible,
  label,
  onToggleVisibility,
  registration,
  toggleLabel,
}: {
  isVisible: boolean
  label: string
  onToggleVisibility: () => void
  registration: UseFormRegisterReturn
  toggleLabel: string
}) {
  return (
    <label className={styles['user__password-field']}>
      <span className={styles['user__password-label']}>{label}</span>
      <span className={styles['user__password-control']}>
        <input
          className={styles['user__password-input']}
          type={isVisible ? 'text' : 'password'}
          {...registration}
        />
        <button
          aria-label={toggleLabel}
          className={styles['user__password-toggle']}
          onClick={onToggleVisibility}
          type="button"
        >
          {isVisible ? (
            <Eye
              aria-hidden="true"
              className={styles['user__password-icon']}
              strokeWidth={2}
            />
          ) : (
            <EyeOff
              aria-hidden="true"
              className={styles['user__password-icon']}
              strokeWidth={2}
            />
          )}
        </button>
      </span>
    </label>
  )
}
