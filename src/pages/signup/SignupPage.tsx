import { Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Typography } from '@/components/Typography'
import { cn } from '@/lib/utils'
import './styles.css'

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
      colorClassName: 'signup-style-33',
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
      colorClassName: 'signup-style-34',
      label: 'Weak password',
      score: 1,
    }
  }

  if (points <= 2) {
    return {
      colorClassName: 'signup-style-35',
      label: 'Fair password',
      score: 2,
    }
  }

  if (points <= 3) {
    return {
      colorClassName: 'signup-style-36',
      label: 'Good password',
      score: 3,
    }
  }

  return {
    colorClassName: 'signup-style-37',
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
      password: '',
      termsAccepted: true,
    },
  })

  const onSubmit = (values: SignupFormValues) => {
    console.log('signup submit', values)
  }
  const passwordStrength = getPasswordStrength(watch('password'))

  return (
    <main className="signup-style-1 ui-enter">
      <section className="signup-style-2">
        <aside className="signup-style-3">
          <div className="signup-style-4" />
          <div className="signup-style-5" />

          <div className="signup-style-6">
            <span className="signup-style-7" />
            <span className="signup-style-8">beam</span>
          </div>

          <div className="signup-style-9">
            <h2 className="signup-style-10">
              Open your
              <br />
              account in 3
              <br />
              minutes.
            </h2>

            <ol className="signup-style-11">
              {[
                'Create your profile',
                'Confirm your e-mail',
                'Get your first card',
              ].map((step, index) => (
                <li className="signup-style-12" key={step}>
                  <span className="signup-style-13">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="signup-style-14">
          <form className="signup-style-15" onSubmit={handleSubmit(onSubmit)}>
            <header className="signup-style-16">
              <Typography as="h1" mode="title">
                Create account
              </Typography>
              <Typography mode="subtitle">
                We'll send a confirmation link to your e-mail
              </Typography>
            </header>

            <div className="signup-style-17">
              <label className="signup-style-18">
                <span className="signup-style-19">First name</span>
                <input
                  className="signup-style-20"
                  type="text"
                  {...register('firstName')}
                />
              </label>

              <label className="signup-style-18">
                <span className="signup-style-19">Last name</span>
                <input
                  className="signup-style-20"
                  type="text"
                  {...register('lastName')}
                />
              </label>
            </div>

            <label className="signup-style-21">
              <span className="signup-style-19">Email</span>
              <input
                className="signup-style-22"
                type="email"
                {...register('email')}
              />
            </label>

            <label className="signup-style-21">
              <span className="signup-style-19">Password</span>
              <span className="signup-style-23">
                <input
                  className="signup-style-24"
                  type={isPasswordVisible ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  aria-label={
                    isPasswordVisible ? 'Hide password' : 'Show password'
                  }
                  className="signup-style-25"
                  onClick={() => setIsPasswordVisible((value) => !value)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Eye
                      aria-hidden="true"
                      className="signup-style-26"
                      strokeWidth={2}
                    />
                  ) : (
                    <EyeOff
                      aria-hidden="true"
                      className="signup-style-26"
                      strokeWidth={2}
                    />
                  )}
                </button>
              </span>

              <span
                className={cn(
                  'signup-style-38',
                  passwordStrength.colorClassName,
                )}
                aria-hidden="true"
              >
                {Array.from({ length: 4 }, (_, index) => (
                  <span
                    className={cn(
                      'signup-style-39',
                      index < passwordStrength.score
                        ? 'signup-style-40'
                        : 'signup-style-41',
                    )}
                    key={index}
                  />
                ))}
              </span>
              <span
                className={cn(
                  'signup-style-42',
                  passwordStrength.colorClassName,
                )}
                aria-live="polite"
              >
                {passwordStrength.label}
              </span>
            </label>

            <label className="signup-style-27">
              <input
                className="signup-style-43"
                type="checkbox"
                {...register('termsAccepted')}
              />
              <span className="signup-style-44">
                <Check
                  aria-hidden="true"
                  className="signup-style-28"
                  strokeWidth={3}
                />
              </span>
              <span className="signup-style-29">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <button className="signup-style-30 ui-lift" type="submit">
              Create account
            </button>

            <p className="signup-style-31">
              Already have an account?{' '}
              <Link className="signup-style-32" to="/login">
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
