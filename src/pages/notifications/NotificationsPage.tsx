import { useGetNotificationsQuery } from '@/shared/api/notificationApi'
import { NotificationsEmptyCard } from './components'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

function NotificationsPage() {
  const { t } = useI18n()
  const { data: notificationHistory } = useGetNotificationsQuery()
  const notifications = notificationHistory ?? []

  return (
    <section className={`${styles['notifications']} ui-enter`}>
      <div className={styles['notifications__layout']}>
        <div className={styles['notifications__main']}>
          <header className={styles['notifications__header']}>
            <h1 className={styles['notifications__title']}>
              {t('notifications')}
            </h1>
          </header>

          {notifications.length ? (
            <div className={styles['notifications__items']}>
              {notifications.map((notification, index) => (
                <article
                  className={`${styles['notifications__item']} ui-notification-arrive`}
                  key={`${notification.title ?? ''}-${notification.body ?? ''}-${index}`}
                >
                  <div className={styles['notifications__item-body']}>
                    <h2 className={styles['notifications__item-title']}>
                      {notification.title ?? t('notifications')}
                    </h2>
                    <p className={styles['notifications__item-description']}>
                      {notification.body ?? t('dataUnavailable')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <NotificationsEmptyCard />
          )}
        </div>
      </div>
    </section>
  )
}

export default NotificationsPage
