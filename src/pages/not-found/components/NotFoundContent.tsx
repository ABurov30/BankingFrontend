import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function NotFoundContent() {
  const { t } = useI18n()

  return (
    <section className={styles['not-found__content']}>
      <div className={styles['not-found__brand']}>
        <span className={styles['not-found__brand-mark']} />
        <span className={styles['not-found__brand-name']}>buro</span>
      </div>

      <div className={styles['not-found__copy']}>
        <span className={styles['not-found__code']}>404</span>
        <h1 className={styles['not-found__title']}>{t('notFoundTitle')}</h1>
        <p className={styles['not-found__text']}>{t('notFoundText')}</p>
      </div>

      <Button asChild className={styles['not-found__action']}>
        <Link to="/">{t('dashboard')}</Link>
      </Button>
    </section>
  )
}
