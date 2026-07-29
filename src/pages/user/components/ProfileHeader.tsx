import { MailCheck } from 'lucide-react'

import { Skeleton } from '@/components/Skeleton'
import { UserProfileStatus } from '@/shared/api/enums'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function ProfileHeader({
  displayName,
  email,
  initials,
  isLoading,
  status,
}: {
  displayName: string
  email?: string
  initials: string
  isLoading: boolean
  status?: string
}) {
  const { t } = useI18n()

  return (
    <header className={styles['user__header']}>
      <div className={styles['user__identity']}>
        <div className={styles['user__avatar']}>
          {isLoading ? null : initials || 'BU'}
        </div>

        <div className={styles['user__identity-copy']}>
          <h1 className={styles['user__name']}>
            {isLoading ? (
              <Skeleton height={30} radius={10} width={220} />
            ) : (
              displayName
            )}
          </h1>
          <div className={styles['user__badges']}>
            {isLoading ? (
              <>
                <Skeleton height={28} width={170} />
                <Skeleton height={28} width={92} />
                <Skeleton height={28} width={150} />
              </>
            ) : (
              <>
                <span className={styles['user__email']}>
                  {email ?? t('noEmail')}
                </span>
                <span className={styles['user__role']}>
                  {status ?? UserProfileStatus.PENDING}
                </span>
                <span className={styles['user__verified']}>
                  <MailCheck className={styles['user__verified-icon']} />
                  {status === UserProfileStatus.ACTIVE
                    ? t('profileActive')
                    : t('verificationPending')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
