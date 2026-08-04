import type { KeyboardEvent, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthUserStatus, Role } from '@/shared/api/enums'
import { useI18n } from '@/shared/i18n/useI18n'
import { RoleSelect } from './RoleSelect'
import { UserStatusSelect } from './UserStatusSelect'
import { UserVerificationSelect } from './UserVerificationSelect'
import type { ManagedUser } from './types'
import styles from '../styles.module.css'

function getInitials(user: ManagedUser) {
  return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` || 'BU'
}

function getName(user: ManagedUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
}

export function UserTableRow({
  currentRole,
  index,
  isMutating,
  onChangeRole,
  onStatusChange,
  onVerify,
  user,
}: {
  currentRole?: Role
  index: number
  isMutating: boolean
  onChangeRole: (user: ManagedUser, role: Role) => Promise<void>
  onStatusChange: (user: ManagedUser, status: AuthUserStatus) => Promise<void>
  onVerify: (user: ManagedUser) => Promise<void>
  user: ManagedUser
}) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const authUserId = user.authUserId
  const status = (user.status ?? 'PENDING') as AuthUserStatus
  const isBlocked = status === 'BLOCKED'
  const isPending =
    status === AuthUserStatus.PENDING ||
    status === AuthUserStatus.FORGET_PASSWORD

  const openUserDetails = () => {
    if (authUserId) navigate(`/users/${authUserId}`)
  }

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if ((event.target as Element).closest('button')) return
    openUserDetails()
  }

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openUserDetails()
    }
  }

  return (
    <tr
      className={authUserId ? styles['users__table-row--link'] : undefined}
      key={authUserId ?? `${user.email}-${index}`}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      role={authUserId ? 'link' : undefined}
      tabIndex={authUserId ? 0 : undefined}
    >
      <td data-label={t('user')}>
        <div className={styles['users__identity']}>
          <span className={styles['users__avatar']}>{getInitials(user)}</span>
          <span>
            <strong>{getName(user)}</strong>
            <small>{user.email ?? t('noEmail')}</small>
          </span>
        </div>
      </td>
      <td data-label={t('verification')}>
        <UserVerificationSelect
          disabled={!authUserId}
          isPending={isPending}
          onVerify={() => onVerify(user)}
        />
      </td>
      <td data-label={t('status')}>
        <UserStatusSelect
          disabled={!authUserId}
          onChange={(nextStatus) => {
            if (isPending && nextStatus === 'ACTIVE') return onVerify(user)

            return onStatusChange(user, nextStatus)
          }}
          value={isPending ? 'PENDING' : isBlocked ? 'BLOCKED' : 'ACTIVE'}
        />
      </td>
      <td data-label={t('role')}>
        {currentRole === Role.ADMIN ? (
          <RoleSelect
            disabled={isMutating || !authUserId}
            onChange={(role) => onChangeRole(user, role)}
            value={user.role ?? Role.USER}
          />
        ) : (
          <span className={styles['users__role-value']}>
            {user.role ?? Role.USER}
          </span>
        )}
      </td>
      <td data-label={t('userId')}>
        <code className={styles['users__id']} title={authUserId}>
          {authUserId
            ? `${authUserId.slice(0, 4)}...${authUserId.slice(-4)}`
            : '---'}
        </code>
      </td>
    </tr>
  )
}
