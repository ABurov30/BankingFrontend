import { NotificationsEmptyCard } from './components'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

function NotificationsPage() {
  const { t } = useI18n()

  return (
    <section className={`${styles['notifications']} ui-enter`}>
      <div className={styles['notifications__layout']}>
        <div className={styles['notifications__main']}>
          <header className={styles['notifications__header']}>
            <h1 className={styles['notifications__title']}>
              {t('notifications')}
            </h1>
          </header>

          <NotificationsEmptyCard />
        </div>
      </div>
    </section>
  )
}

export default NotificationsPage
