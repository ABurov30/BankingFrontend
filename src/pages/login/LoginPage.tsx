import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import styles from './styles.module.css'

type LoginFormValues = {
  email: string
  password: string
}

function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { handleSubmit, register } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'alex@company.com',
      password: 'password12',
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    console.log('login submit', values)
  }

  return (
    <main className={`${styles['login']} ui-enter`}>
      <section className={styles['login__shell']}>
        <aside className={styles['login__hero']}>
          <div className={styles['login__hero-orb-primary']} />
          <div className={styles['login__hero-orb-secondary']} />

          <div className={styles['login__brand']}>
            <span className={styles['login__brand-mark']} />
            <span className={styles['login__brand-name']}>buro</span>
          </div>

          <div className={styles['login__hero-copy']}>
            <h2 className={styles['login__hero-title']}>
              Money that
              <br />
              moves at your
              <br />
              speed.
            </h2>
            <p className={styles['login__hero-text']}>
              Accounts, cards and instant transfers - processed in real time,
              secured end to end.
            </p>
          </div>
        </aside>

        <div className={styles['login__form-panel']}>
          <form
            className={styles['login__form']}
            onSubmit={handleSubmit(onSubmit)}
          >
            <header className={styles['login__form-header']}>
              <h1 className={styles['login__title']}>Welcome back</h1>
              <p className={styles['login__subtitle']}>
                Sign in to your Buro account
              </p>
            </header>

            <div className={styles['login__fields']}>
              <label className={styles['login__field']}>
                <span className={styles['login__label']}>Email</span>
                <input
                  className={styles['login__input']}
                  type="email"
                  {...register('email')}
                />
              </label>

              <label className={styles['login__field']}>
                <span className={styles['login__label-row']}>
                  <span className={styles['login__label']}>Password</span>
                  <Link
                    className={styles['login__forgot-link']}
                    to="/forgot-password"
                  >
                    Forgot?
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
                      isPasswordVisible ? 'Hide password' : 'Show password'
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
              type="submit"
            >
              Sign in
            </button>

            <div className={styles['login__divider']}>
              <div className={styles['login__divider-line']} />
              <span className={styles['login__divider-label']}>or continue with</span>
              <div className={styles['login__divider-line']} />
            </div>

            <div className={styles['login__social-list']}>
              <button className={styles['login__social-button']} type="button">
                <span className={styles['login__google-icon']}>G</span>
                Google
              </button>
              <button className={styles['login__social-button']} type="button">
                <span className={styles['login__apple-icon']} />
                GitHub
              </button>
            </div>

            <p className={styles['login__signup-copy']}>
              New to Buro?{' '}
              <Link className={styles['login__signup-link']} to="/signup">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
