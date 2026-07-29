import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function ActivityCard() {
  const { t } = useI18n()

  return (
    <section className={styles['dashboard__panel-card']}>
      <div className={styles['dashboard__card-header']}>
        <h2 className={styles['dashboard__panel-title']}>
          {t('recentActivity')}
        </h2>
        <button className={styles['dashboard__link-button']} type="button">
          {t('viewAll')}
        </button>
      </div>

      <p className={styles['dashboard__empty-state']}>
        {t('noTransactionData')}
      </p>
    </section>
  )
}
