import { LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

export function AccessDenied() {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <section className={styles['access-denied']}>
      <span className={styles['access-denied__icon-wrap']}>
        <LockKeyhole className={styles['access-denied__icon']} />
      </span>
      <h1 className={styles['access-denied__title']}>{t('accessDenied')}</h1>
      <p className={styles['access-denied__text']}>{t('accessDeniedText')}</p>
      <button
        className={`${styles['access-denied__button']} ui-lift`}
        onClick={() => navigate('/')}
        type="button"
      >
        {t('backToDashboard')}
      </button>
    </section>
  )
}
