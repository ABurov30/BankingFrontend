import { ArrowLeft, UserRound } from 'lucide-react'

import type { UserInfo } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function UserDetailsHeader({
  onBack,
  user,
}: {
  onBack: () => void
  user?: UserInfo
}) {
  const { t } = useI18n()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')

  return (
    <>
      <button
        className={styles['user-details__back']}
        onClick={onBack}
        type="button"
      >
        <ArrowLeft /> {t('backToUsers')}
      </button>

      <header className={styles['user-details__header']}>
        <span className={styles['user-details__avatar']}>
          <UserRound />
        </span>
        <div>
          <h1 className={styles['user-details__title']}>
            {fullName || user?.email || t('user')}
          </h1>
          <p className={styles['user-details__email']}>
            {user?.email ?? t('dataUnavailable')}
          </p>
        </div>
      </header>

      <div className={styles['user-details__meta']}>
        <span>
          {t('status')}: {user?.status ?? t('dataUnavailable')}
        </span>
        <span>
          {t('role')}: {user?.role ?? t('dataUnavailable')}
        </span>
      </div>
    </>
  )
}
