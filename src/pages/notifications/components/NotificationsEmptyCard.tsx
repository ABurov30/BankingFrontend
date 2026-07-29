import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function NotificationsEmptyCard() {
  const { t } = useI18n()

  return (
    <section className={`${styles['notifications__item']} ui-lift`}>
      <p className={styles['notifications__card-text']}>
        {t('noNotificationData')}
      </p>
    </section>
  )
}
