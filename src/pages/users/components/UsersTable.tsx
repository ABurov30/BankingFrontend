import { Role, type AuthUserStatus } from '@/shared/api/enums'
import { Skeleton } from '@/components/Skeleton'
import { useI18n } from '@/shared/i18n/useI18n'
import { UserTableRow } from './UserTableRow'
import type { ManagedUser } from './types'
import styles from '../styles.module.css'

export function UsersTable({
  currentRole,
  isLoading,
  isMutating,
  onChangeRole,
  onStatusChange,
  onVerify,
  users,
}: {
  currentRole?: Role
  isLoading: boolean
  isMutating: boolean
  onChangeRole: (user: ManagedUser, role: Role) => Promise<void>
  onStatusChange: (user: ManagedUser, status: AuthUserStatus) => Promise<void>
  onVerify: (user: ManagedUser) => Promise<void>
  users: ManagedUser[]
}) {
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className={styles['users__table-skeleton']}>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton height={64} key={index} radius={12} />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return <p className={styles['users__empty']}>{t('noUsers')}</p>
  }

  return (
    <div className={styles['users__table-wrap']}>
      <table className={styles['users__table']}>
        <thead>
          <tr>
            <th>{t('user')}</th>
            <th>{t('verification')}</th>
            <th>{t('status')}</th>
            <th>{t('role')}</th>
            <th>{t('userId')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserTableRow
              currentRole={currentRole}
              index={index}
              isMutating={isMutating}
              key={
                user.authUserId ??
                user.userProfileId ??
                `${user.email}-${index}`
              }
              onChangeRole={onChangeRole}
              onStatusChange={onStatusChange}
              onVerify={onVerify}
              user={user}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
