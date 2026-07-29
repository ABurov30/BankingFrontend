import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import type { LoginRequest } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export type LoginFormValues = LoginRequest

export function LoginForm({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean
  onSubmit: (values: LoginFormValues) => void
}) {
  const { t } = useI18n()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div className={styles['login__form-panel']}>
      <form className={styles['login__form']} onSubmit={handleSubmit(onSubmit)}>
        <header className={styles['login__form-header']}>
          <h1 className={styles['login__title']}>{t('welcomeBack')}</h1>
          <p className={styles['login__subtitle']}>{t('signInToBuro')}</p>
        </header>

        <div className={styles['login__fields']}>
          <label className={styles['login__field']}>
            <span className={styles['login__label']}>{t('email')}</span>
            <input
              className={styles['login__input']}
              type="email"
              {...register('email')}
            />
          </label>

          <label className={styles['login__field']}>
            <span className={styles['login__label-row']}>
              <span className={styles['login__label']}>{t('password')}</span>
              <Link
                className={styles['login__forgot-link']}
                to="/forgot-password"
              >
                {t('forgot')}
              </Link>
            </span>
            <span className={styles['login__password-control']}>
              <input
                className={styles['login__password-input']}
                type={isPasswordVisible ? 'text' : 'password'}
                {...register('password')}
              />
              <button
                aria-label={
                  isPasswordVisible ? t('hidePassword') : t('showPassword')
                }
                className={styles['login__password-toggle']}
                onClick={() => setIsPasswordVisible((value) => !value)}
                type="button"
              >
                {isPasswordVisible ? (
                  <Eye
                    aria-hidden="true"
                    className={styles['login__password-icon']}
                    strokeWidth={2}
                  />
                ) : (
                  <EyeOff
                    aria-hidden="true"
                    className={styles['login__password-icon']}
                    strokeWidth={2}
                  />
                )}
              </button>
            </span>
          </label>
        </div>

        <button
          className={`${styles['login__submit']} ui-lift`}
          disabled={isSubmitting || isLoading}
          type="submit"
        >
          {isLoading ? t('signingIn') : t('signIn')}
        </button>

        <p className={styles['login__signup-copy']}>
          {t('newToBuro')}{' '}
          <Link className={styles['login__signup-link']} to="/signup">
            {t('createAccount')}
          </Link>
        </p>
      </form>
    </div>
  )
}
