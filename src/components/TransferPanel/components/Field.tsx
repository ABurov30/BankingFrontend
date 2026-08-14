import type { ReactNode } from 'react'

import styles from '../styles.module.css'

export function Field({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <div className={styles['transfer-panel__field']}>
      <span className={styles['transfer-panel__label']}>{label}</span>
      {children}
    </div>
  )
}
