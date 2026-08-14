import type { ReactNode } from 'react'

import styles from '../styles.module.css'

export function OperationTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
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
