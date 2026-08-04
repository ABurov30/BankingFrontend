import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useAppSelector } from '@/app/hooks'
import { getNavigationItems } from '@/components/navigation'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

export function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean
  onClose?: () => void
}) {
  const { t } = useI18n()
  const role = useAppSelector((state) => state.user.currentUser?.role)
  const items = getNavigationItems(role)

  return (
    <aside
      className={cn(
        styles['sidebar'],
        isOpen && styles['sidebar--open'],
        'ui-enter',
      )}
    >
      <div>
        <div className={styles['sidebar__brand']}>
          <div className={styles['sidebar__brand-copy']}>
            <span className={styles['sidebar__brand-mark']} />
            <span className={styles['sidebar__brand-name']}>buro</span>
          </div>
          <button
            aria-label={t('closeNavigation')}
            className={styles['sidebar__close']}
            onClick={onClose}
            type="button"
          >
            <X className={styles['sidebar__close-icon']} />
          </button>
        </div>

        <nav className={styles['sidebar__nav']}>
          {items.map(({ badge, icon: Icon, labelKey, to }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  styles['sidebar__nav-link'],
                  isActive
                    ? styles['sidebar__nav-link--active']
                    : styles['sidebar__nav-link--idle'],
                )
              }
              end={to === '/'}
              key={labelKey}
              onClick={onClose}
              to={to}
            >
              <Icon className={styles['sidebar__nav-icon']} strokeWidth={2} />
              <span>{t(labelKey)}</span>
              {badge ? (
                <span className={styles['sidebar__nav-badge']}>{badge}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>
      <div aria-hidden="true" className={styles['sidebar__spacer']} />
    </aside>
  )
}
