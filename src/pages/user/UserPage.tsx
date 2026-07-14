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
import styles from './styles.module.css'

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
    actionClassName: styles['user__badge--danger'],
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
    actionClassName: styles['user__status--success'],
    icon: null,
    label: 'GitHub',
  },
]

const sessions = [
  {
    badge: 'THIS DEVICE',
    icon: Laptop,
    iconClassName: styles['user__status--danger'],
    meta: 'Berlin, DE · now',
    title: 'Chrome · macOS',
  },
  {
    action: 'End',
    icon: Smartphone,
    iconClassName: styles['user__setting-action--danger'],
    meta: 'Berlin, DE · 3h ago',
    title: 'Buro App · iPhone 15',
  },
]

function UserPage() {
  return (
    <section className={`${styles['user']} ui-enter`}>
      <header className={styles['user__header']}>
        <div className={styles['user__identity']}>
          <div className={styles['user__avatar']}>AR</div>

          <div className={styles['user__identity-copy']}>
            <h1 className={styles['user__name']}>Alex Rivera</h1>
            <div className={styles['user__badges']}>
              <span className={styles['user__email']}>alex@company.com</span>
              <span className={styles['user__role']}>ROLE_USER</span>
              <span className={styles['user__verified']}>
                <MailCheck className={styles['user__verified-icon']} />
                E-mail confirmed
              </span>
            </div>
          </div>
        </div>

        <button className={`${styles['user__edit-button']} ui-lift`} type="button">
          <Edit3 className={styles['user__button-icon']} />
          Edit profile
        </button>
      </header>

      <div className={styles['user__stats']}>
        <div className={styles['user__stat-card']}>
          <PersonalInformationCard />
          <SecurityCard />
        </div>

        <div className={styles['user__stat-card']}>
          <SignInMethodsCard />
          <ActiveSessionsCard />
        </div>
      </div>
    </section>
  )
}

function PersonalInformationCard() {
  return (
    <section className={`${styles['user__info-card']} ui-lift`}>
      <h2 className={styles['user__section-title']}>Personal information</h2>

      <div className={styles['user__info-grid']}>
        {personalInfo.map(({ label, value }) => (
          <div className={styles['user__identity-copy']} key={label}>
            <p className={styles['user__field-label']}>{label}</p>
            <p className={styles['user__field-value']}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecurityCard() {
  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>Security</CardTitle>

      {securityItems.map(
        ({ action, actionClassName, enabled, icon: Icon, label, meta }) => (
          <div className={styles['user__setting-row']} key={label}>
            <div className={styles['user__setting-main']}>
              <Icon className={styles['user__setting-icon']} />
              <span className={styles['user__setting-title']}>{label}</span>
              {meta ? (
                <span className={styles['user__setting-meta']}>{meta}</span>
              ) : null}
            </div>
            {typeof enabled === 'boolean' ? (
              <Toggle enabled={enabled} />
            ) : (
              <button
                className={cn(styles['user__setting-action--primary'], actionClassName)}
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
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>Linked sign-in methods</CardTitle>

      {signInMethods.map(
        ({ action, actionClassName, icon: Icon, label, meta }) => (
          <div className={styles['user__setting-row']} key={label}>
            <div className={styles['user__setting-main']}>
              {Icon ? (
                <Icon className={styles['user__device-icon']} />
              ) : label === 'GitHub' ? (
                <span className={styles['user__device-dot']} />
              ) : (
                <span className={styles['user__provider-icon']}>G</span>
              )}
              <span className={styles['user__provider-name']}>{label}</span>
              {meta ? (
                <span className={styles['user__provider-meta']}>{meta}</span>
              ) : null}
            </div>
            <button
              className={cn(styles['user__setting-action'], actionClassName)}
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
    <section className={`${styles['user__sessions-card']} ui-lift`}>
      <CardTitle>Active sessions</CardTitle>

      {sessions.map(
        ({ action, badge, icon: Icon, iconClassName, meta, title }) => (
          <div className={styles['user__session-row']} key={title}>
            <span className={cn(styles['user__provider-action'], iconClassName)}>
              <Icon className={styles['user__button-icon']} />
            </span>
            <div className={styles['user__session-copy']}>
              <div className={styles['user__session-header']}>
                <p className={styles['user__session-title']}>{title}</p>
                {badge ? (
                  <span className={styles['user__session-badge']}>{badge}</span>
                ) : null}
              </div>
              <p className={styles['user__session-meta']}>{meta}</p>
            </div>
            {action ? (
              <button className={styles['user__session-action']} type="button">
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
    <div className={styles['user__section-header']}>
      <h2 className={styles['user__section-title']}>{children}</h2>
    </div>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        styles['user__event-icon'],
        enabled ? styles['user__event-icon--success'] : styles['user__event-icon--neutral'],
      )}
      aria-hidden="true"
    >
      <span className={styles['user__toggle-knob']} />
    </span>
  )
}

export default UserPage
