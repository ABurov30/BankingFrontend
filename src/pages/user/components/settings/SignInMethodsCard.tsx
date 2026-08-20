import type { SocialAccountResponse } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import { CardTitle } from '../CardTitle'
import styles from '../../styles.module.css'

function getProviderLabel(provider?: SocialAccountResponse['provider']) {
  if (provider === 'GOOGLE') return 'Google'

  return provider ?? null
}

function getProviderIconLabel(provider?: SocialAccountResponse['provider']) {
  return getProviderLabel(provider)?.slice(0, 1).toUpperCase() ?? '?'
}

export function SignInMethodsCard({
  socialAccounts = [],
}: {
  socialAccounts?: SocialAccountResponse[]
}) {
  const { t } = useI18n()
  const hasSocialAccounts = socialAccounts.length > 0

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('linkedSignInMethods')}</CardTitle>

      {hasSocialAccounts ? (
        <div className={styles['user__sign-in-method-list']}>
          {socialAccounts.map((account, index) => {
            const providerLabel =
              getProviderLabel(account.provider) ?? t('dataUnavailable')

            return (
              <div
                className={styles['user__setting-row']}
                key={`${account.provider ?? 'provider'}-${account.email ?? index}`}
              >
                <div className={styles['user__setting-main']}>
                  <span
                    aria-hidden="true"
                    className={styles['user__provider-icon']}
                  >
                    {getProviderIconLabel(account.provider)}
                  </span>
                  <div className={styles['user__provider-copy']}>
                    <p className={styles['user__provider-name']}>
                      {providerLabel}
                    </p>
                    <p className={styles['user__provider-meta']}>
                      {account.email ?? t('dataUnavailable')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className={styles['user__sign-in-method-empty']}>
          {t('noLinkedSignInMethods')}
        </p>
      )}
    </section>
  )
}
