import type { GetUserInfoResponseDto } from '@/shared/api/types'

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getUserName(user: GetUserInfoResponseDto) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return fullName || user.email || '—'
}

export function getInitials(user: GetUserInfoResponseDto) {
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name![0])
    .join('')

  return initials || user.email?.[0]?.toUpperCase() || '?'
}
