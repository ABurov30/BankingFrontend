import { Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import type { SignupRequest } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { getPasswordStrength } from './passwordStrength'

export type SignupFormValues = SignupRequest & {
  termsAccepted: boolean
}

export function SignupForm({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean
  onSubmit: (values: SignupFormValues) => void
}) {
  const { t } = useI18n()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      termsAccepted: false,
    },
  })
  const passwordStrength = getPasswordStrength(watch('password'), {
    empty: t('password'),
    fair: t('fairPassword'),
    good: t('goodPassword'),
    strong: t('strongPassword'),
    weak: t('weakPassword'),
  })

  return (
    <div className={styles['signup__form-panel']}>
      <form
        className={styles['signup__form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className={styles['signup__form-header']}>
          <h1 className={styles['signup__title']}>{t('createAccount')}</h1>
          <p className={styles['signup__subtitle']}>{t('signupSubtitle')}</p>
        </header>

        <div className={styles['signup__name-grid']}>
          <label className={styles['signup__field']}>
            <span className={styles['signup__input']}>{t('firstName')}</span>
            <input
              className={styles['signup__field-full']}
              type="text"
              {...register('firstName')}
            />
          </label>

          <label className={styles['signup__field']}>
            <span className={styles['signup__input']}>{t('lastName')}</span>
            <input
              className={styles['signup__field-full']}
              type="text"
              {...register('lastName')}
            />
          </label>
        </div>

        <label className={styles['signup__label']}>
          <span className={styles['signup__input']}>{t('email')}</span>
          <input
            className={styles['signup__email-input']}
            type="email"
            {...register('email')}
          />
        </label>

        <label className={styles['signup__label']}>
          <span className={styles['signup__input']}>{t('password')}</span>
          <span className={styles['signup__password-control']}>
            <input
              className={styles['signup__password-input']}
              type={isPasswordVisible ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              aria-label={
                isPasswordVisible ? t('hidePassword') : t('showPassword')
              }
              className={styles['signup__password-toggle']}
              onClick={() => setIsPasswordVisible((value) => !value)}
              type="button"
            >
              {isPasswordVisible ? (
                <Eye
                  aria-hidden="true"
                  className={styles['signup__password-icon']}
                  strokeWidth={2}
                />
              ) : (
                <EyeOff
                  aria-hidden="true"
                  className={styles['signup__password-icon']}
                  strokeWidth={2}
                />
              )}
            </button>
          </span>

          <span
            className={cn(
              styles['signup__strength-track'],
              passwordStrength.colorClassName,
            )}
            aria-hidden="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <span
                className={cn(
                  styles['signup__strength-bar'],
                  index < passwordStrength.score
                    ? styles['signup__strength-label']
                    : styles['signup__checkbox--checked'],
                )}
                key={index}
              />
            ))}
          </span>
          <span
            className={cn(
              styles['signup__checkbox--empty'],
              passwordStrength.colorClassName,
            )}
            aria-live="polite"
          >
            {passwordStrength.label}
          </span>
        </label>

        <label className={styles['signup__terms-field']}>
          <input
            className={styles['signup__terms-input']}
            type="checkbox"
            {...register('termsAccepted', { required: true })}
          />
          <span className={styles['signup__terms-box']}>
            <Check
              aria-hidden="true"
              className={styles['signup__checkbox']}
              strokeWidth={3}
            />
          </span>
          <span className={styles['signup__terms-copy']}>{t('termsCopy')}</span>
        </label>

        <button
          className={`${styles['signup__submit']} ui-lift`}
          disabled={isSubmitting || isLoading}
          type="submit"
        >
          {isLoading ? t('creatingAccount') : t('createAccount')}
        </button>

        <p className={styles['signup__login-copy']}>
          {t('alreadyHaveAccount')}{' '}
          <Link className={styles['signup__login-link']} to="/login">
            {t('signIn')}
          </Link>
        </p>
      </form>
    </div>
  )
}
