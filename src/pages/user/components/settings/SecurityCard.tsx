import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { useChangePasswordMutation } from '@/shared/api/authApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import { CardTitle } from '../CardTitle'
import { PasswordField } from './PasswordField'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { getPasswordStrength } from './passwordStrength'
import styles from '../../styles.module.css'

type ChangePasswordFormValues = {
  newPassword: string
  oldPassword: string
}

export function SecurityCard({ authUserId }: { authUserId?: string }) {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  })
  const newPassword = watch('newPassword')
  const passwordStrengthLabels = {
    empty: t('newPassword'),
    fair: t('fairPassword'),
    good: t('goodPassword'),
    strong: t('strongPassword'),
    weak: t('weakPassword'),
  }
  const passwordStrength = getPasswordStrength(
    newPassword,
    passwordStrengthLabels,
  )

  const handleChangePassword = async ({
    newPassword,
    oldPassword,
  }: ChangePasswordFormValues) => {
    if (!authUserId) {
      dispatch(
        showToast({
          message: t('userIdUnavailable'),
          title: t('passwordUpdateFailed'),
          variant: 'error',
        }),
      )
      return
    }

    try {
      await changePassword({
        authUserId,
        newPassword,
        oldPassword,
      }).unwrap()
      reset()
      dispatch(
        showToast({
          message: t('passwordUpdated'),
          variant: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('passwordUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('security')}</CardTitle>

      <form
        className={styles['user__password-form']}
        onSubmit={handleSubmit(handleChangePassword)}
      >
        <PasswordField
          isVisible={isOldPasswordVisible}
          label={t('currentPassword')}
          onToggleVisibility={() => setIsOldPasswordVisible((value) => !value)}
          registration={register('oldPassword', {
            required: t('currentPasswordRequired'),
          })}
          toggleLabel={
            isOldPasswordVisible ? t('hidePassword') : t('showPassword')
          }
        />
        {errors.oldPassword ? (
          <p className={styles['user__password-error']}>
            {errors.oldPassword.message}
          </p>
        ) : null}

        <PasswordField
          isVisible={isNewPasswordVisible}
          label={t('newPassword')}
          onToggleVisibility={() => setIsNewPasswordVisible((value) => !value)}
          registration={register('newPassword', {
            required: t('newPasswordRequired'),
            validate: (value) =>
              getPasswordStrength(value, passwordStrengthLabels).score >= 3 ||
              t('passwordNotStrongEnough'),
          })}
          toggleLabel={
            isNewPasswordVisible ? t('hidePassword') : t('showPassword')
          }
        />

        <PasswordStrengthMeter strength={passwordStrength} />
        {errors.newPassword ? (
          <p className={styles['user__password-error']}>
            {errors.newPassword.message}
          </p>
        ) : null}

        <div className={styles['user__password-actions']}>
          <button
            className={styles['user__password-submit']}
            disabled={isSubmitting || isLoading || !authUserId}
            type="submit"
          >
            {isLoading ? t('saving') : t('changePassword')}
          </button>
        </div>
      </form>
    </section>
  )
}
