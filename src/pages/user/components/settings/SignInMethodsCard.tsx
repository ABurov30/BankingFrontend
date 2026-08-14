import { useI18n } from '@/shared/i18n/useI18n'
import { CardTitle } from '../CardTitle'
import styles from '../../styles.module.css'

export function SignInMethodsCard() {
  const { t } = useI18n()

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('linkedSignInMethods')}</CardTitle>

      <p className={styles['user__setting-meta']}>
        {t('linkedSignInMethodsUnavailable')}
      </p>
    </section>
  )
}
