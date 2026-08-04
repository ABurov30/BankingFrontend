import { ShieldUser } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { getApiErrorMessage } from '@/shared/api/error'
import { AuthUserStatus } from '@/shared/api/enums'
import {
  useBlockUserByManagerMutation,
  useChangeAuthUserRoleMutation,
  useUnlockUserByManagerMutation,
  useVerifyUserByManagerMutation,
} from '@/shared/api/authApi'
import { useGetAllUserInfoQuery } from '@/shared/api/userApi'
import { useI18n } from '@/shared/i18n/useI18n'
import { UsersTable, type ManagedUser } from './components'
import styles from './styles.module.css'

function UsersPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const currentRole = useAppSelector((state) => state.user.currentUser?.role)
  const canManageUsers = true
  // const canManageUsers = currentRole === Role.MANAGER || currentRole === Role.ADMIN
  const { data, isLoading } = useGetAllUserInfoQuery()
  const [blockUser, { isLoading: isBlocking }] = useBlockUserByManagerMutation()
  const [unlockUser, { isLoading: isUnlocking }] =
    useUnlockUserByManagerMutation()
  const [verifyUser, { isLoading: isVerifying }] =
    useVerifyUserByManagerMutation()
  const [changeRole, { isLoading: isChangingRole }] =
    useChangeAuthUserRoleMutation()
  const isMutating = isBlocking || isUnlocking || isVerifying || isChangingRole

  // if (!canManageUsers) return <AccessDenied />
  void canManageUsers

  const getAuthUserId = (user: ManagedUser) =>
    user.authUserId ?? user.userProfileId

  const runAction = async (
    user: ManagedUser,
    action: (authUserId: string) => Promise<unknown>,
    successMessage: string,
  ) => {
    const authUserId = getAuthUserId(user)
    if (!authUserId) {
      dispatch(showToast({ message: t('userIdUnavailable'), variant: 'error' }))
      throw new Error(t('userIdUnavailable'))
    }

    try {
      await action(authUserId)
      dispatch(showToast({ message: successMessage, variant: 'success' }))
    } catch (error) {
      dispatch(
        showToast({ message: getApiErrorMessage(error), variant: 'error' }),
      )
      throw error
    }
  }

  return (
    <section className={`${styles['users']} ui-enter`}>
      <header className={styles['users__header']}>
        <div>
          <h1 className={styles['users__title']}>{t('users')}</h1>
          <p className={styles['users__subtitle']}>
            {t('usersEndpoint')} · {data?.length ?? 0} {t('usersCount')}
          </p>
        </div>
        <span className={styles['users__scope']}>
          <ShieldUser /> {currentRole}
        </span>
      </header>

      <UsersTable
        currentRole={currentRole}
        isLoading={isLoading}
        isMutating={isMutating}
        onChangeRole={async (user, role) => {
          try {
            await runAction(
              user,
              (authUserId) => changeRole({ authUserId, role }).unwrap(),
              t('roleUpdated'),
            )
          } catch {
            // The toast is already shown by runAction.
          }
        }}
        onStatusChange={(user, status) =>
          runAction(
            user,
            (authUserId) =>
              status === AuthUserStatus.BLOCKED
                ? blockUser({ authUserId }).unwrap()
                : unlockUser({ authUserId }).unwrap(),
            status === AuthUserStatus.BLOCKED
              ? t('userBlocked')
              : t('userUnlocked'),
          )
        }
        onVerify={(user) =>
          runAction(
            user,
            (authUserId) => verifyUser(authUserId).unwrap(),
            t('userVerified'),
          )
        }
        users={data ?? []}
      />
    </section>
  )
}

export default UsersPage
