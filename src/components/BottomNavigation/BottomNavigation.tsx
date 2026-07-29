import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { navItems } from '@/components/navigation'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

export function BottomNavigation() {
  const { t } = useI18n()

  return (
    <nav aria-label="Primary navigation" className={styles['bottom-nav']}>
      {navItems.map(({ badge, icon: Icon, labelKey, to }) => (
        <NavLink
          aria-label={t(labelKey)}
          className={({ isActive }) =>
            cn(
              styles['bottom-nav__link'],
              isActive
                ? styles['bottom-nav__link--active']
                : styles['bottom-nav__link--idle'],
            )
          }
          end={to === '/'}
          key={labelKey}
          to={to}
        >
          <Icon className={styles['bottom-nav__icon']} strokeWidth={2} />
          {badge ? (
            <span className={styles['bottom-nav__badge']}>{badge}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}
