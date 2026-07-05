import {
  Edit3,
  History,
  KeyRound,
  Laptop,
  LockKeyhole,
  MailCheck,
  Smartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import './styles.css'

const personalInfo = [
  { label: 'FULL NAME', value: 'Alex Rivera' },
  { label: 'PHONE', value: '+49 160 ••• 4412' },
  { label: 'DATE OF BIRTH', value: '14 Mar 1992' },
  { label: 'COUNTRY', value: 'Germany' },
]

const securityItems = [
  {
    action: 'Change',
    icon: KeyRound,
    label: 'Password',
    meta: '· changed 2 months ago',
  },
  {
    enabled: true,
    icon: LockKeyhole,
    label: 'Two-factor authentication',
  },
  {
    action: 'Revoke all',
    actionClassName: 'user-style-42',
    icon: History,
    label: 'Refresh tokens',
    meta: '· 2 active',
  },
]

type SignInMethod = {
  action: string
  actionClassName?: string
  icon: LucideIcon | null
  label: string
  meta?: string
}

const signInMethods: SignInMethod[] = [
  {
    action: 'Unlink',
    icon: null,
    label: 'Google',
    meta: '· alex@gmail.com',
  },
  {
    action: 'Link account',
    actionClassName: 'user-style-43',
    icon: null,
    label: 'GitHub',
  },
]

const sessions = [
  {
    badge: 'THIS DEVICE',
    icon: Laptop,
    iconClassName: 'user-style-44',
    meta: 'Berlin, DE · now',
    title: 'Chrome · macOS',
  },
  {
    action: 'End',
    icon: Smartphone,
    iconClassName: 'user-style-45',
    meta: 'Berlin, DE · 3h ago',
    title: 'Beam App · iPhone 15',
  },
]

function UserPage() {
  return (
    <section className="user-style-1 ui-enter">
      <header className="user-style-2">
        <div className="user-style-3">
          <div className="user-style-4">AR</div>

          <div className="user-style-5">
            <h1 className="user-style-6">Alex Rivera</h1>
            <div className="user-style-7">
              <span className="user-style-8">alex@company.com</span>
              <span className="user-style-9">ROLE_USER</span>
              <span className="user-style-10">
                <MailCheck className="user-style-11" />
                E-mail confirmed
              </span>
            </div>
          </div>
        </div>

        <button className="user-style-12 ui-lift" type="button">
          <Edit3 className="user-style-13" />
          Edit profile
        </button>
      </header>

      <div className="user-style-14">
        <div className="user-style-15">
          <PersonalInformationCard />
          <SecurityCard />
        </div>

        <div className="user-style-15">
          <SignInMethodsCard />
          <ActiveSessionsCard />
        </div>
      </div>
    </section>
  )
}

function PersonalInformationCard() {
  return (
    <section className="user-style-16 ui-lift">
      <h2 className="user-style-17">Personal information</h2>

      <div className="user-style-18">
        {personalInfo.map(({ label, value }) => (
          <div className="user-style-5" key={label}>
            <p className="user-style-19">{label}</p>
            <p className="user-style-20">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecurityCard() {
  return (
    <section className="user-style-21 ui-lift">
      <CardTitle>Security</CardTitle>

      {securityItems.map(
        ({ action, actionClassName, enabled, icon: Icon, label, meta }) => (
          <div className="user-style-22" key={label}>
            <div className="user-style-23">
              <Icon className="user-style-24" />
              <span className="user-style-25">{label}</span>
              {meta ? <span className="user-style-26">{meta}</span> : null}
            </div>
            {typeof enabled === 'boolean' ? (
              <Toggle enabled={enabled} />
            ) : (
              <button
                className={cn('user-style-46', actionClassName)}
                type="button"
              >
                {action}
              </button>
            )}
          </div>
        ),
      )}
    </section>
  )
}

function SignInMethodsCard() {
  return (
    <section className="user-style-21 ui-lift">
      <CardTitle>Linked sign-in methods</CardTitle>

      {signInMethods.map(
        ({ action, actionClassName, icon: Icon, label, meta }) => (
          <div className="user-style-22" key={label}>
            <div className="user-style-23">
              {Icon ? (
                <Icon className="user-style-27" />
              ) : label === 'GitHub' ? (
                <span className="user-style-28" />
              ) : (
                <span className="user-style-29">G</span>
              )}
              <span className="user-style-30">{label}</span>
              {meta ? <span className="user-style-31">{meta}</span> : null}
            </div>
            <button
              className={cn('user-style-47', actionClassName)}
              type="button"
            >
              {action}
            </button>
          </div>
        ),
      )}
    </section>
  )
}

function ActiveSessionsCard() {
  return (
    <section className="user-style-32 ui-lift">
      <CardTitle>Active sessions</CardTitle>

      {sessions.map(
        ({ action, badge, icon: Icon, iconClassName, meta, title }) => (
          <div className="user-style-33" key={title}>
            <span className={cn('user-style-48', iconClassName)}>
              <Icon className="user-style-13" />
            </span>
            <div className="user-style-34">
              <div className="user-style-35">
                <p className="user-style-36">{title}</p>
                {badge ? <span className="user-style-37">{badge}</span> : null}
              </div>
              <p className="user-style-38">{meta}</p>
            </div>
            {action ? (
              <button className="user-style-39" type="button">
                {action}
              </button>
            ) : null}
          </div>
        ),
      )}
    </section>
  )
}

function CardTitle({ children }: { children: string }) {
  return (
    <div className="user-style-40">
      <h2 className="user-style-17">{children}</h2>
    </div>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        'user-style-49',
        enabled ? 'user-style-50' : 'user-style-51',
      )}
      aria-hidden="true"
    >
      <span className="user-style-41" />
    </span>
  )
}

export default UserPage
