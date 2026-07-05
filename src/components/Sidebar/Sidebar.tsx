import {
  ArrowDownLeft,
  Bell,
  CreditCard,
  Grid2X2,
  User,
  WalletCards,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import './styles.css'

const navItems = [
  { icon: Grid2X2, label: 'Dashboard', to: '/' },
  { icon: WalletCards, label: 'Accounts', to: '/accounts' },
  { icon: CreditCard, label: 'Cards', to: '/cards' },
  { icon: ArrowDownLeft, label: 'Transactions', to: '/transactions' },
  { icon: Bell, label: 'Notifications', badge: '3', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
]

export function Sidebar() {
  return (
    <aside className="sidebar-style-1 ui-enter">
      <div>
        <div className="sidebar-style-2">
          <span className="sidebar-style-3" />
          <span className="sidebar-style-4">beam</span>
        </div>

        <nav className="sidebar-style-5">
          {navItems.map(({ badge, icon: Icon, label, to }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'sidebar-style-12',
                  isActive ? 'sidebar-style-13' : 'sidebar-style-14',
                )
              }
              end={to === '/'}
              key={label}
              to={to}
            >
              <Icon className="sidebar-style-6" strokeWidth={2} />
              <span>{label}</span>
              {badge ? <span className="sidebar-style-7">{badge}</span> : null}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-style-8 ui-lift">
        <h2 className="sidebar-style-9">Invite a friend</h2>
        <p className="sidebar-style-10">
          Get $15 for every friend who opens an account.
        </p>
        <button className="sidebar-style-11 ui-lift" type="button">
          Share link
        </button>
      </div>
    </aside>
  )
}
