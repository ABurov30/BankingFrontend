import styles from '../styles.module.css'

export function CardTitle({ children }: { children: string }) {
  return (
    <div className={styles['user__section-header']}>
      <h2 className={styles['user__section-title']}>{children}</h2>
    </div>
  )
}
