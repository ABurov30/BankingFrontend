import type { ReactNode } from 'react'

import styles from '../styles.module.css'

export function OperationTab({
  testId,
  active,
  icon,
  label,
  onClick,
}: {
  testId?: string
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      data-testid={testId}
      aria-pressed={active}
      className={
        active
          ? styles['transfer-panel__tab--active']
          : styles['transfer-panel__tab']
      }
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}
