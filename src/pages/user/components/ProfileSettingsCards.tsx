import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setThemeMode, type ResolvedTheme } from '@/features/app/appSlice'
import { showToast } from '@/features/toast/toastSlice'
import { cn } from '@/lib/utils'
import { useChangePasswordMutation } from '@/shared/api/authApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { CardTitle } from './CardTitle'
import { PersonalInformationCard } from './PersonalInformationCard'
import type { PersonalInfoItem } from './types'

type ChangePasswordFormValues = {
  newPassword: string
  oldPassword: string
}

type PasswordStrength = {
  colorClassName: string
  label: string
  score: number
}

function getPasswordStrength(
  password: string,
  labels: {
    empty: string
    fair: string
    good: string
    strong: string
    weak: string
  },
): PasswordStrength {
  if (!password) {
    return {
      colorClassName: styles['user__password-rule--muted'],
      label: labels.empty,
      score: 0,
    }
  }

  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 12,
  ]
  const points = checks.filter(Boolean).length

  if (points <= 1) {
    return {
      colorClassName: styles['user__password-rule--danger'],
      label: labels.weak,
      score: 1,
    }
  }

  if (points <= 2) {
    return {
      colorClassName: styles['user__password-rule--warning'],
      label: labels.fair,
      score: 2,
    }
  }

  if (points <= 3) {
    return {
      colorClassName: styles['user__password-rule--success'],
      label: labels.good,
      score: 3,
    }
  }

  return {
    colorClassName: styles['user__password-rule--default'],
    label: labels.strong,
    score: 4,
  }
}

export function ProfileSettingsCards({
  authUserId,
  isLoading = false,
  personalInfo,
}: {
  authUserId?: string
  isLoading?: boolean
  personalInfo: PersonalInfoItem[]
}) {
  return (
    <div className={styles['user__stats']}>
      <div className={styles['user__stat-card']}>
        <PersonalInformationCard
          isLoading={isLoading}
          personalInfo={personalInfo}
        />
        <SecurityCard authUserId={authUserId} />
      </div>

      <div className={styles['user__stat-card']}>
        <PreferencesCard />
        <SignInMethodsCard />
      </div>
    </div>
  )
}

function SecurityCard({ authUserId }: { authUserId?: string }) {
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
        <label className={styles['user__password-field']}>
          <span className={styles['user__password-label']}>
            {t('currentPassword')}
          </span>
          <span className={styles['user__password-control']}>
            <input
              className={styles['user__password-input']}
              type={isOldPasswordVisible ? 'text' : 'password'}
              {...register('oldPassword', {
                required: t('currentPasswordRequired'),
              })}
            />
            <button
              aria-label={
                isOldPasswordVisible ? t('hidePassword') : t('showPassword')
              }
              className={styles['user__password-toggle']}
              onClick={() => setIsOldPasswordVisible((value) => !value)}
              type="button"
            >
              {isOldPasswordVisible ? (
                <Eye
                  aria-hidden="true"
                  className={styles['user__password-icon']}
                  strokeWidth={2}
                />
              ) : (
                <EyeOff
                  aria-hidden="true"
                  className={styles['user__password-icon']}
                  strokeWidth={2}
                />
              )}
            </button>
          </span>
        </label>
        {errors.oldPassword ? (
          <p className={styles['user__password-error']}>
            {errors.oldPassword.message}
          </p>
        ) : null}

        <label className={styles['user__password-field']}>
          <span className={styles['user__password-label']}>
            {t('newPassword')}
          </span>
          <span className={styles['user__password-control']}>
            <input
              className={styles['user__password-input']}
              type={isNewPasswordVisible ? 'text' : 'password'}
              {...register('newPassword', {
                required: t('newPasswordRequired'),
                validate: (value) =>
                  getPasswordStrength(value, passwordStrengthLabels).score >=
                    3 || t('passwordNotStrongEnough'),
              })}
            />
            <button
              aria-label={
                isNewPasswordVisible ? t('hidePassword') : t('showPassword')
              }
              className={styles['user__password-toggle']}
              onClick={() => setIsNewPasswordVisible((value) => !value)}
              type="button"
            >
              {isNewPasswordVisible ? (
                <Eye
                  aria-hidden="true"
                  className={styles['user__password-icon']}
                  strokeWidth={2}
                />
              ) : (
                <EyeOff
                  aria-hidden="true"
                  className={styles['user__password-icon']}
                  strokeWidth={2}
                />
              )}
            </button>
          </span>
        </label>

        <span
          className={cn(
            styles['user__password-strength-track'],
            passwordStrength.colorClassName,
          )}
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <span
              className={cn(
                styles['user__password-strength-bar'],
                index < passwordStrength.score
                  ? styles['user__password-strength-label']
                  : styles['user__password-strength-empty'],
              )}
              key={index}
            />
          ))}
        </span>
        <span
          className={cn(
            styles['user__password-strength-copy'],
            passwordStrength.colorClassName,
          )}
          aria-live="polite"
        >
          {passwordStrength.label}
        </span>
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

function PreferencesCard() {
  const dispatch = useAppDispatch()
  const { resolvedTheme } = useAppSelector((state) => state.app)
  const { t } = useI18n()

  const handleThemeChange = (theme: ResolvedTheme) => {
    dispatch(setThemeMode(theme))
  }

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('preferences')}</CardTitle>

      <div className={styles['user__preference-list']}>
        <PreferenceSegment
          label={t('theme')}
          options={[
            { label: t('light'), value: 'light' },
            { label: t('dark'), value: 'dark' },
          ]}
          value={resolvedTheme}
          onChange={(value) => handleThemeChange(value as ResolvedTheme)}
        />
      </div>
    </section>
  )
}

function PreferenceSegment({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  return (
    <div className={styles['user__preference-row']}>
      <span className={styles['user__preference-label']}>{label}</span>
      <div className={styles['user__preference-control']}>
        {options.map((option) => (
          <button
            className={cn(
              styles['user__preference-option'],
              option.value === value &&
                styles['user__preference-option--active'],
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SignInMethodsCard() {
  const { t } = useI18n()

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('linkedSignInMethods')}</CardTitle>

      <p className={styles['user__setting-meta']}>
        {t('linkedSignInMethodsUnavailable')}
      </p>
    </section>
  )
}
