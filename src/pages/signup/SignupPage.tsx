import { Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

type SignupFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  termsAccepted: boolean
}

type PasswordStrength = {
  colorClassName: string
  label: string
  score: number
}

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      colorClassName: styles['signup__rule--muted'],
      label: 'Enter password',
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
      colorClassName: styles['signup__rule--danger'],
      label: 'Weak password',
      score: 1,
    }
  }

  if (points <= 2) {
    return {
      colorClassName: styles['signup__rule--warning'],
      label: 'Fair password',
      score: 2,
    }
  }

  if (points <= 3) {
    return {
      colorClassName: styles['signup__rule--success'],
      label: 'Good password',
      score: 3,
    }
  }

  return {
    colorClassName: styles['signup__rule--default'],
    label: 'Strong password',
    score: 4,
  }
}

function SignupPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { handleSubmit, register, watch } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex@company.com',
      password: 'Password123!',
      termsAccepted: true,
    },
  })

  const onSubmit = (values: SignupFormValues) => {
    console.log('signup submit', values)
  }
  const passwordStrength = getPasswordStrength(watch('password'))

  return (
    <main className={`${styles['signup']} ui-enter`}>
      <section className={styles['signup__shell']}>
        <aside className={styles['signup__hero']}>
          <div className={styles['signup__hero-orb-primary']} />
          <div className={styles['signup__hero-orb-secondary']} />

          <div className={styles['signup__brand']}>
            <span className={styles['signup__brand-mark']} />
            <span className={styles['signup__brand-name']}>buro</span>
          </div>

          <div className={styles['signup__hero-copy']}>
            <h2 className={styles['signup__hero-title']}>
              Open your
              <br />
              account in 3
              <br />
              minutes.
            </h2>

            <ol className={styles['signup__steps']}>
              {[
                'Create your profile',
                'Confirm your e-mail',
                'Get your first card',
              ].map((step, index) => (
                <li className={styles['signup__step']} key={step}>
                  <span className={styles['signup__step-index']}>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className={styles['signup__form-panel']}>
          <form
            className={styles['signup__form']}
            onSubmit={handleSubmit(onSubmit)}
          >
            <header className={styles['signup__form-header']}>
              <h1 className={styles['signup__title']}>Create account</h1>
              <p className={styles['signup__subtitle']}>
                We'll send a confirmation link to your e-mail
              </p>
            </header>

            <div className={styles['signup__name-grid']}>
              <label className={styles['signup__field']}>
                <span className={styles['signup__input']}>First name</span>
                <input
                  className={styles['signup__field-full']}
                  type="text"
                  {...register('firstName')}
                />
              </label>

              <label className={styles['signup__field']}>
                <span className={styles['signup__input']}>Last name</span>
                <input
                  className={styles['signup__field-full']}
                  type="text"
                  {...register('lastName')}
                />
              </label>
            </div>

            <label className={styles['signup__label']}>
              <span className={styles['signup__input']}>Email</span>
              <input
                className={styles['signup__email-input']}
                type="email"
                {...register('email')}
              />
            </label>

            <label className={styles['signup__label']}>
              <span className={styles['signup__input']}>Password</span>
              <span className={styles['signup__password-control']}>
                <input
                  className={styles['signup__password-input']}
                  type={isPasswordVisible ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  aria-label={
                    isPasswordVisible ? 'Hide password' : 'Show password'
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
                {...register('termsAccepted')}
              />
              <span className={styles['signup__terms-box']}>
                <Check
                  aria-hidden="true"
                  className={styles['signup__checkbox']}
                  strokeWidth={3}
                />
              </span>
              <span className={styles['signup__terms-copy']}>
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <button
              className={`${styles['signup__submit']} ui-lift`}
              type="submit"
            >
              Create account
            </button>

            <p className={styles['signup__login-copy']}>
              Already have an account?{' '}
              <Link className={styles['signup__login-link']} to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default SignupPage
