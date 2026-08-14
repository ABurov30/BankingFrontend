import { cn } from '@/lib/utils'
import type { PasswordStrength } from './passwordStrength'
import styles from '../../styles.module.css'

export function PasswordStrengthMeter({
  strength,
}: {
  strength: PasswordStrength
}) {
  return (
    <>
      <span
        className={cn(
          styles['user__password-strength-track'],
          strength.colorClassName,
        )}
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <span
            className={cn(
              styles['user__password-strength-bar'],
              index < strength.score
                ? styles['user__password-strength-label']
                : styles['user__password-strength-empty'],
            )}
            key={index}
          />
        ))}
      </span>
      <span
        className={cn(
          styles['user__password-strength-copy'],
          strength.colorClassName,
        )}
        aria-live="polite"
      >
        {strength.label}
      </span>
    </>
  )
}
