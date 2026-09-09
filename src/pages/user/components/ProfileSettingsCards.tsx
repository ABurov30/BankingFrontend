import type { SocialAccountResponse } from '@/shared/api/types'
import styles from '../styles.module.css'
import { PersonalInformationCard } from './PersonalInformationCard'
import { PreferencesCard, SecurityCard, SignInMethodsCard } from './settings'
import type { PersonalInfoItem } from './types'

export function ProfileSettingsCards({
  isLoading = false,
  personalInfo,
  socialAccounts,
}: {
  isLoading?: boolean
  personalInfo: PersonalInfoItem[]
  socialAccounts?: SocialAccountResponse[]
}) {
  return (
    <div className={styles['user__stats']}>
      <div className={styles['user__stat-card']}>
        <PersonalInformationCard
          isLoading={isLoading}
          personalInfo={personalInfo}
        />
        <SecurityCard />
      </div>

      <div className={styles['user__stat-card']}>
        <PreferencesCard />
        <SignInMethodsCard socialAccounts={socialAccounts} />
      </div>
    </div>
  )
}
