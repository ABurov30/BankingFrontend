import {
  Clock3,
  CreditCard,
  Gauge,
  Laptop,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

type NotificationItem = {
  channels: Array<'email' | 'push' | 'sms'>
  description: string
  icon: LucideIcon
  iconClassName: string
  muted?: boolean
  time: string
  title: string
  unread?: boolean
}

const todayNotifications: NotificationItem[] = [
  {
    channels: ['push', 'email'],
    description:
      'Online payments on Buro Debit •• 4823 hit $1,240 of $1,500. Raise the limit or track spend in Cards.',
    icon: Gauge,
    iconClassName: styles['notifications__icon--limit'],
    time: '10:04',
    title: 'Card limit 80% reached',
    unread: true,
  },
  {
    channels: ['push'],
    description:
      '$500.00 to Savings (TX-93395) was authorized and will complete shortly.',
    icon: Clock3,
    iconClassName: styles['notifications__icon--warning'],
    time: '09:31',
    title: 'Transfer authorized — awaiting completion',
    unread: true,
  },
]

const yesterdayNotifications: NotificationItem[] = [
  {
    channels: ['push', 'email', 'sms'],
    description:
      'StreamFlix $12.99 on Buro Virtual •• 7710 was declined. The card is frozen.',
    icon: CreditCard,
    iconClassName: styles['notifications__icon--danger'],
    muted: true,
    time: '12:00',
    title: 'Payment declined — insufficient limit',
  },
  {
    channels: ['email'],
    description:
      "Chrome on macOS · Berlin, DE. If this wasn't you, secure your account now.",
    icon: Laptop,
    iconClassName: styles['notifications__icon--info'],
    muted: true,
    time: '22:41',
    title: 'New login to your account',
  },
]

const channels = [
  { enabled: true, icon: Smartphone, label: 'Push' },
  { enabled: true, icon: Mail, label: 'E-mail' },
  { enabled: false, icon: MessageSquare, label: 'SMS' },
]

const alertTypes = [
  { enabled: true, label: 'Transaction status' },
  { enabled: true, label: 'Security & logins' },
  { enabled: false, label: 'Product news' },
]

function NotificationsPage() {
  return (
    <section className={`${styles['notifications']} ui-enter`}>
      <div className={styles['notifications__layout']}>
        <div className={styles['notifications__main']}>
          <header className={styles['notifications__header']}>
            <h1 className={styles['notifications__title']}>Notifications</h1>
            <button
              className={styles['notifications__mark-read']}
              type="button"
            >
              Mark all as read
            </button>
          </header>

          <NotificationGroup label="Today" notifications={todayNotifications} />
          <NotificationGroup
            label="Yesterday"
            notifications={yesterdayNotifications}
          />
        </div>

        <aside className={styles['notifications__aside']}>
          <ChannelsCard />
          <AlertTypesCard />
        </aside>
      </div>
    </section>
  )
}

function NotificationGroup({
  label,
  notifications,
}: {
  label: string
  notifications: NotificationItem[]
}) {
  return (
    <section className={styles['notifications__group']}>
      <h2 className={styles['notifications__group-title']}>{label}</h2>

      <div className={`${styles['notifications__item']} ui-lift`}>
        {notifications.map((notification, index) => (
          <NotificationRow
            border={index < notifications.length - 1}
            key={notification.title}
            {...notification}
          />
        ))}
      </div>
    </section>
  )
}

function NotificationRow({
  border,
  channels,
  description,
  icon: Icon,
  iconClassName,
  muted,
  time,
  title,
  unread,
}: NotificationItem & { border?: boolean }) {
  return (
    <article
      className={cn(
        styles['notifications__toggle'],
        border && styles['notifications__toggle--on'],
        muted && styles['notifications__toggle--off'],
      )}
    >
      <span className={cn(styles['notifications__icon-wrap'], iconClassName)}>
        <Icon className={styles['notifications__item-icon']} />
      </span>

      <div className={styles['notifications__item-body']}>
        <h3 className={styles['notifications__item-title']}>{title}</h3>
        <p className={styles['notifications__item-description']}>
          {description}
        </p>
      </div>

      <div className={styles['notifications__item-meta']}>
        <div className={styles['notifications__time-row']}>
          <span className={styles['notifications__time']}>{time}</span>
          <ChannelIcons channels={channels} />
        </div>
        <span className={styles['notifications__unread-slot']}>
          {unread ? (
            <span className={styles['notifications__unread-dot']} />
          ) : null}
        </span>
      </div>
    </article>
  )
}

function ChannelIcons({ channels }: { channels: string[] }) {
  const icons = {
    email: Mail,
    push: Smartphone,
    sms: MessageSquare,
  }

  return (
    <span className={styles['notifications__channels']}>
      {channels.map((channel) => {
        const Icon = icons[channel as keyof typeof icons]
        return (
          <Icon
            className={styles['notifications__channel-icon']}
            key={channel}
          />
        )
      })}
    </span>
  )
}

function ChannelsCard() {
  return (
    <section className={`${styles['notifications__card']} ui-lift`}>
      <h2 className={styles['notifications__card-title']}>Channels</h2>
      <p className={styles['notifications__card-text']}>
        Where you receive alerts about transactions and security.
      </p>

      {channels.map(({ enabled, icon: Icon, label }) => (
        <div className={styles['notifications__setting-row']} key={label}>
          <span className={styles['notifications__setting-label']}>
            <Icon className={styles['notifications__setting-icon']} />
            {label}
          </span>
          <Toggle enabled={enabled} />
        </div>
      ))}
    </section>
  )
}

function AlertTypesCard() {
  return (
    <section className={`${styles['notifications__card']} ui-lift`}>
      <h2 className={styles['notifications__section-title']}>Alert types</h2>

      {alertTypes.map(({ enabled, label }) => (
        <div className={styles['notifications__setting-row']} key={label}>
          <span className={styles['notifications__alert-label']}>{label}</span>
          <Toggle enabled={enabled} />
        </div>
      ))}
    </section>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        styles['notifications__setting-meta'],
        enabled
          ? styles['notifications__setting-action']
          : styles['notifications__setting-action--muted'],
      )}
      aria-hidden="true"
    >
      <span className={styles['notifications__toggle-knob']} />
    </span>
  )
}

export default NotificationsPage
