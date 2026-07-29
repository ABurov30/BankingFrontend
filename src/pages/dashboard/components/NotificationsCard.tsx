import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function NotificationsCard() {
  const { t } = useI18n()

  return (
    <section className={styles['dashboard__notifications-card']}>
      <div className={styles['dashboard__notifications-header']}>
        <h2 className={styles['dashboard__panel-title']}>
          {t('notifications')}
        </h2>
        <button className={styles['dashboard__link-button']} type="button">
          {t('all')}
        </button>
      </div>
      <p className={styles['dashboard__empty-state']}>
        {t('noNotificationData')}
      </p>
    </section>
  )
}
