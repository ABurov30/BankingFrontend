import { ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { clearAccounts } from '@/features/accounts/accountsSlice'
import { clearCards } from '@/features/cards/cardsSlice'
import { clearCurrentUser } from '@/features/user/userSlice'
import { useLogoutMutation } from '@/shared/api/authApi'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function Topbar({ userName }: { userName: string }) {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
  const displayName = userName || t('profile')
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } finally {
      dispatch(clearAccounts())
      dispatch(clearCards())
      dispatch(clearCurrentUser())
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className={styles['dashboard__topbar']}>
      <div className={styles['dashboard__inline-group']}>
        <div className={styles['dashboard__profile-menu']}>
          <button
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className={`${styles['dashboard__profile-button']} ui-lift`}
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span className={styles['dashboard__profile-avatar']}>
              {initials || 'BU'}
            </span>
            <span className={styles['dashboard__profile-name']}>
              {displayName}
            </span>
            <ChevronDown className={styles['dashboard__icon']} />
          </button>

          {isProfileMenuOpen ? (
            <div className={styles['dashboard__profile-dropdown']} role="menu">
              <button
                className={styles['dashboard__profile-dropdown-button']}
                disabled={isLoggingOut}
                onClick={handleLogout}
                role="menuitem"
                type="button"
              >
                <LogOut
                  className={styles['dashboard__profile-dropdown-icon']}
                />
                {isLoggingOut ? t('signingOut') : t('signOut')}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
