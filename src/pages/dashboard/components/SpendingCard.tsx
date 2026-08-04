import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function SpendingCard() {
  const { t } = useI18n()

  return (
    <section className={styles['dashboard__panel-card']}>
      <div className={styles['dashboard__panel-header']}>
        <h2 className={styles['dashboard__panel-title']}>
          {t('spendingThisWeek')}
        </h2>
        <div className={styles['dashboard__period-tabs']}>
          <span className={styles['dashboard__period-tab--active']}>
            {t('week')}
          </span>
          <span className={styles['dashboard__period-tab']}>{t('month')}</span>
        </div>
      </div>

      <p className={styles['dashboard__empty-state']}>{t('noSpendingData')}</p>
    </section>
  )
}
