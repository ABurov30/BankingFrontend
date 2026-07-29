import {
  Bell,
  CreditCard,
  Grid2X2,
  type LucideIcon,
  Repeat2,
  User,
  WalletCards,
} from 'lucide-react'
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
