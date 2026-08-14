import styles from '../styles.module.css'
import { PersonalInformationCard } from './PersonalInformationCard'
import { PreferencesCard, SecurityCard, SignInMethodsCard } from './settings'
import type { PersonalInfoItem } from './types'

export function ProfileSettingsCards({
  authUserId,
  isLoading = false,
  personalInfo,
}: {
  authUserId?: string
  isLoading?: boolean
  personalInfo: PersonalInfoItem[]
}) {
  return (
    <div className={styles['user__stats']}>
      <div className={styles['user__stat-card']}>
        <PersonalInformationCard
          isLoading={isLoading}
          personalInfo={personalInfo}
        />
        <SecurityCard authUserId={authUserId} />
      </div>

      <div className={styles['user__stat-card']}>
        <PreferencesCard />
        <SignInMethodsCard />
      </div>
    </div>
  )
}
