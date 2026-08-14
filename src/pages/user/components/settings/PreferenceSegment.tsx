import { cn } from '@/lib/utils'
import styles from '../../styles.module.css'

export function PreferenceSegment({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  return (
    <div className={styles['user__preference-row']}>
      <span className={styles['user__preference-label']}>{label}</span>
      <div className={styles['user__preference-control']}>
        {options.map((option) => (
          <button
            className={cn(
              styles['user__preference-option'],
              option.value === value &&
                styles['user__preference-option--active'],
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
