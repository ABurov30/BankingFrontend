import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { getVerificationState } from './verificationState'

export function VerificationPanel({
  error,
  hasRequiredParams,
  isError,
  isLoading,
  isSuccess,
}: {
  error: unknown
  hasRequiredParams: boolean
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}) {
  const { t } = useI18n()
  const state = getVerificationState({
    hasRequiredParams,
    isError,
    isLoading,
    isSuccess,
  })

  return (
    <section className={`${styles['user-verify__panel']} ui-lift`}>
      <div
        className={cn(
          styles['user-verify__icon-wrap'],
          styles[`user-verify__icon-wrap--${state.variant}`],
        )}
      >
        <state.icon className={styles['user-verify__icon']} />
      </div>

      <div className={styles['user-verify__copy']}>
        <h1 className={styles['user-verify__title']}>{t(state.titleKey)}</h1>
        <p className={styles['user-verify__text']}>
          {isError ? getApiErrorMessage(error) : t(state.messageKey)}
        </p>
      </div>

      <Button asChild className={styles['user-verify__action']}>
        <Link to="/login">{t('verificationGoToSignIn')}</Link>
      </Button>
    </section>
  )
}
