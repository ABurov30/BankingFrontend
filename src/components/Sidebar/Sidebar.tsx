import {
  Bell,
  CreditCard,
  Grid2X2,
  type LucideIcon,
  Repeat2,
  User,
  WalletCards,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

type NavItem = {
  badge?: string
  icon: LucideIcon
  label: string
  to: string
}

const navItems: NavItem[] = [
  { icon: Grid2X2, label: 'Dashboard', to: '/' },
  { icon: WalletCards, label: 'Accounts', to: '/accounts' },
  { icon: CreditCard, label: 'Cards', to: '/cards' },
  { icon: Repeat2, label: 'Transactions', to: '/transactions' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
]

export function Sidebar() {
  return (
    <aside className={`${styles['sidebar']} ui-enter`}>
      <div>
        <div className={styles['sidebar__brand']}>
          <span className={styles['sidebar__brand-mark']} />
          <span className={styles['sidebar__brand-name']}>buro</span>
        </div>

        <nav className={styles['sidebar__nav']}>
          {navItems.map(({ badge, icon: Icon, label, to }) => (
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
              key={label}
              to={to}
            >
              <Icon className={styles['sidebar__nav-icon']} strokeWidth={2} />
              <span>{label}</span>
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
