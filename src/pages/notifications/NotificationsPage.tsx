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
import './styles.css'

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
      'Online payments on Beam Debit •• 4823 hit $1,240 of $1,500. Raise the limit or track spend in Cards.',
    icon: Gauge,
    iconClassName: 'notifications-style-31',
    time: '10:04',
    title: 'Card limit 80% reached',
    unread: true,
  },
  {
    channels: ['push'],
    description:
      '$500.00 to Savings (TX-93395) was authorized and will complete shortly.',
    icon: Clock3,
    iconClassName: 'notifications-style-32',
    time: '09:31',
    title: 'Transfer authorized - awaiting completion',
    unread: true,
  },
]

const yesterdayNotifications: NotificationItem[] = [
  {
    channels: ['push', 'email', 'sms'],
    description:
      'StreamFlix $12.99 on Beam Virtual •• 7710 was declined. The card is frozen.',
    icon: CreditCard,
    iconClassName: 'notifications-style-33',
    muted: true,
    time: '12:00',
    title: 'Payment declined - insufficient limit',
  },
  {
    channels: ['email'],
    description:
      "Chrome on macOS · Berlin, DE. If this wasn't you, secure your account now.",
    icon: Laptop,
    iconClassName: 'notifications-style-34',
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
    <section className="notifications-style-1 ui-enter">
      <div className="notifications-style-2">
        <div className="notifications-style-3">
          <header className="notifications-style-4">
            <h1 className="notifications-style-5">Notifications</h1>
            <button className="notifications-style-6" type="button">
              Mark all as read
            </button>
          </header>

          <NotificationGroup label="Today" notifications={todayNotifications} />
          <NotificationGroup
            label="Yesterday"
            notifications={yesterdayNotifications}
          />
        </div>

        <aside className="notifications-style-7">
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
    <section className="notifications-style-8">
      <h2 className="notifications-style-9">{label}</h2>

      <div className="notifications-style-10 ui-lift">
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
        'notifications-style-35',
        border && 'notifications-style-36',
        muted && 'notifications-style-37',
      )}
    >
      <span className={cn('notifications-style-38', iconClassName)}>
        <Icon className="notifications-style-11" />
      </span>

      <div className="notifications-style-12">
        <h3 className="notifications-style-13">{title}</h3>
        <p className="notifications-style-14">{description}</p>
      </div>

      <div className="notifications-style-15">
        <div className="notifications-style-16">
          <span className="notifications-style-17">{time}</span>
          <ChannelIcons channels={channels} />
        </div>
        <span className="notifications-style-18">
          {unread ? <span className="notifications-style-19" /> : null}
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
    <span className="notifications-style-20">
      {channels.map((channel) => {
        const Icon = icons[channel as keyof typeof icons]
        return <Icon className="notifications-style-21" key={channel} />
      })}
    </span>
  )
}

function ChannelsCard() {
  return (
    <section className="notifications-style-22 ui-lift">
      <h2 className="notifications-style-23">Channels</h2>
      <p className="notifications-style-24">
        Where you receive alerts about transactions and security.
      </p>

      {channels.map(({ enabled, icon: Icon, label }) => (
        <div className="notifications-style-25" key={label}>
          <span className="notifications-style-26">
            <Icon className="notifications-style-27" />
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
    <section className="notifications-style-22 ui-lift">
      <h2 className="notifications-style-28">Alert types</h2>

      {alertTypes.map(({ enabled, label }) => (
        <div className="notifications-style-25" key={label}>
          <span className="notifications-style-29">{label}</span>
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
        'notifications-style-39',
        enabled ? 'notifications-style-40' : 'notifications-style-41',
      )}
      aria-hidden="true"
    >
      <span className="notifications-style-30" />
    </span>
  )
}

export default NotificationsPage
