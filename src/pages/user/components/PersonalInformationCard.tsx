import { Skeleton } from '@/components/Skeleton'
import { useI18n } from '@/shared/i18n/useI18n'

import styles from '../styles.module.css'
import type { PersonalInfoItem } from './types'

export function PersonalInformationCard({
  isLoading = false,
  personalInfo,
}: {
  isLoading?: boolean
  personalInfo: PersonalInfoItem[]
}) {
  const { t } = useI18n()

  return (
    <section className={`${styles['user__info-card']} ui-lift`}>
      <h2 className={styles['user__section-title']}>
        {t('personalInformation')}
      </h2>

      <div className={styles['user__info-grid']}>
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <div className={styles['user__identity-copy']} key={index}>
                <Skeleton height={12} width={80} />
                <Skeleton height={18} width={index === 1 ? 180 : 130} />
              </div>
            ))
          : personalInfo.map(({ label, value }) => (
              <div className={styles['user__identity-copy']} key={label}>
                <p className={styles['user__field-label']}>{label}</p>
                <p className={styles['user__field-value']}>{value}</p>
              </div>
            ))}
      </div>
    </section>
  )
}
