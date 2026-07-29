import { useAppSelector } from '@/app/hooks'
import { selectCurrentUser } from '@/features/user/userSlice'
import { useI18n } from '@/shared/i18n/useI18n'
import { ProfileHeader, ProfileSettingsCards } from './components'
import styles from './styles.module.css'

function UserPage() {
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const isLoading = !user
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const displayName = fullName || user?.email || t('user')
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`
    .toUpperCase()
    .trim()
  const personalInfo = [
    { label: t('fullName'), value: displayName },
    { label: t('email'), value: user?.email ?? t('pending') },
    { label: t('userId'), value: user?.userProfileId ?? t('pending') },
    { label: t('status'), value: user?.status ?? t('pending') },
  ]

  return (
    <section className={`${styles['user']} ui-enter`}>
      <ProfileHeader
        displayName={displayName}
        email={user?.email}
        initials={initials}
        isLoading={isLoading}
        status={user?.status}
      />
      <ProfileSettingsCards
        authUserId={user?.userProfileId}
        isLoading={isLoading}
        personalInfo={personalInfo}
      />
    </section>
  )
}

export default UserPage
