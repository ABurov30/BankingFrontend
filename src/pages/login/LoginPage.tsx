import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Typography } from '@/components/Typography'
import './styles.css'

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
    <main className="login-style-1 ui-enter">
      <section className="login-style-2">
        <aside className="login-style-3">
          <div className="login-style-4" />
          <div className="login-style-5" />

          <div className="login-style-6">
            <span className="login-style-7" />
            <span className="login-style-8">beam</span>
          </div>

          <div className="login-style-9">
            <h2 className="login-style-10">
              Money that
              <br />
              moves at your
              <br />
              speed.
            </h2>
            <p className="login-style-11">
              Accounts, cards and instant transfers - processed in real time,
              secured end to end.
            </p>
          </div>
        </aside>

        <div className="login-style-12">
          <form className="login-style-13" onSubmit={handleSubmit(onSubmit)}>
            <header className="login-style-14">
              <Typography as="h1" mode="title">
                Welcome back
              </Typography>
              <Typography mode="subtitle">
                Sign in to your Beam account
              </Typography>
            </header>

            <div className="login-style-15">
              <label className="login-style-16">
                <span className="login-style-17">Email</span>
                <input
                  className="login-style-34"
                  type="email"
                  {...register('email')}
                />
              </label>

              <label className="login-style-16">
                <span className="login-style-18">
                  <span className="login-style-17">Password</span>
                  <Link className="login-style-19" to="/forgot-password">
                    Forgot?
                  </Link>
                </span>
                <span className="login-style-20">
                  <input
                    className="login-style-21"
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <button
                    aria-label={
                      isPasswordVisible ? 'Hide password' : 'Show password'
                    }
                    className="login-style-22"
                    onClick={() => setIsPasswordVisible((value) => !value)}
                    type="button"
                  >
                    {isPasswordVisible ? (
                      <Eye
                        aria-hidden="true"
                        className="login-style-23"
                        strokeWidth={2}
                      />
                    ) : (
                      <EyeOff
                        aria-hidden="true"
                        className="login-style-23"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </span>
              </label>
            </div>

            <button className="login-style-24 ui-lift" type="submit">
              Sign in
            </button>

            <div className="login-style-25">
              <div className="login-style-26" />
              <span className="login-style-27">or continue with</span>
              <div className="login-style-26" />
            </div>

            <div className="login-style-28">
              <button className="login-style-29" type="button">
                <span className="login-style-30">G</span>
                Google
              </button>
              <button className="login-style-29" type="button">
                <span className="login-style-31" />
                GitHub
              </button>
            </div>

            <p className="login-style-32">
              New to Beam?{' '}
              <Link className="login-style-33" to="/signup">
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
