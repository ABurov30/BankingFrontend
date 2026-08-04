import {
  Bell,
  CreditCard,
  Grid2X2,
  HeartPulse,
  ShieldUser,
  type LucideIcon,
  Repeat2,
  User,
  WalletCards,
} from 'lucide-react'
import { Role, type Role as RoleValue } from '@/shared/api/enums'
import type { TranslationKey } from '@/shared/i18n/translations'

export type NavItem = {
  badge?: string
  icon: LucideIcon
  labelKey: TranslationKey
  to: string
}

export const navItems: NavItem[] = [
  { icon: Grid2X2, labelKey: 'dashboard', to: '/' },
  { icon: WalletCards, labelKey: 'accounts', to: '/accounts' },
  { icon: CreditCard, labelKey: 'cards', to: '/cards' },
  { icon: Repeat2, labelKey: 'transactions', to: '/transactions' },
  { icon: Bell, labelKey: 'notifications', to: '/notifications' },
  { icon: User, labelKey: 'profile', to: '/profile' },
]

export function getNavigationItems(role?: RoleValue): NavItem[] {
  const adminItems: NavItem[] = []
  const canViewUsers = role === Role.MANAGER || role === Role.ADMIN
  const canViewHealth = role === Role.ADMIN

  if (canViewUsers) {
    adminItems.push({ icon: ShieldUser, labelKey: 'users', to: '/users' })
  }

  if (canViewHealth) {
    adminItems.push({ icon: HeartPulse, labelKey: 'health', to: '/health' })
  }

  return [...navItems, ...adminItems]
}
