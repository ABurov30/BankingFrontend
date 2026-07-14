import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Landmark,
  Plus,
  Search,
  Send,
  ShoppingBasket,
  Subtitles,
  WalletCards,
} from 'lucide-react'

import { useAppDispatch } from '@/app/hooks'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

const accounts = [
  {
    accent: styles['dashboard__account-accent--checking'],
    balance: '$12,480.50',
    currency: 'USD',
    icon: WalletCards,
    name: 'Main checking',
    suffix: '4823',
  },
  {
    accent: styles['dashboard__account-accent--savings'],
    balance: '€8,940.00',
    currency: 'EUR',
    icon: Landmark,
    name: 'Savings',
    suffix: '9017',
  },
]

const spending = [
  { day: 'Mon', height: styles['dashboard__chart-bar--mon'] },
  { day: 'Tue', height: styles['dashboard__chart-bar--tue'] },
  { day: 'Wed', height: styles['dashboard__chart-bar--wed'] },
  {
    day: 'Thu',
    height: styles['dashboard__chart-bar--thu'],
    active: true,
    value: '$412',
  },
  { day: 'Fri', height: styles['dashboard__chart-bar--fri'] },
  { day: 'Sat', height: styles['dashboard__chart-bar--sat'] },
  { day: 'Sun', height: styles['dashboard__chart-bar--sun'] },
]

const transactions = [
  {
    amount: '-$62.40',
    icon: ShoppingBasket,
    meta: 'Card •• 4823 · Jul 4, 18:22',
    name: 'Grocery Market',
    status: 'COMPLETED',
    statusClassName: styles['dashboard__status--completed'],
  },
  {
    amount: '+$4,200.00',
    amountClassName: styles['dashboard__amount--positive'],
    icon: BriefcaseBusiness,
    meta: 'Main checking · Jul 4, 09:00',
    name: 'Salary - ACME Corp',
    status: 'COMPLETED',
    statusClassName: styles['dashboard__status--completed'],
  },
  {
    amount: '-$500.00',
    icon: Send,
    meta: 'Main -> Savings · Jul 3, 21:14',
    name: 'Transfer to Savings',
    status: 'AUTHORIZED',
    statusClassName: styles['dashboard__status--authorized'],
  },
  {
    amount: '-$12.99',
    amountClassName: styles['dashboard__amount--declined'],
    icon: Subtitles,
    meta: 'Card •• 7710 · Jul 3, 12:00',
    name: 'StreamFlix subscription',
    status: 'DECLINED',
    statusClassName: styles['dashboard__status--declined'],
  },
]

const notifications = [
  {
    meta: 'Online payments · 2h ago',
    title: 'Card limit 80% reached',
    unread: true,
  },
  {
    meta: '$500 to Savings · 11h ago',
    title: 'Transfer authorized',
    unread: true,
  },
  {
    meta: 'Yesterday, 22:41',
    title: 'New login · Chrome, Berlin',
  },
]

function DashboardPage() {
  return (
    <section className={`${styles['dashboard']} ui-enter`}>
      <Topbar />

      <div className={styles['dashboard__layout']}>
        <div className={styles['dashboard__main']}>
          <BalanceHero />
          <AccountsGrid />
          <SpendingCard />
          <ActivityCard />
        </div>

        <aside className={styles['dashboard__aside']}>
          <DebitCard />
          <LimitsCard />
          <NotificationsCard />
        </aside>
      </div>
    </section>
  )
}

function Topbar() {
  return (
    <header className={styles['dashboard__topbar']}>
      <label className={styles['dashboard__search']}>
        <Search className={styles['dashboard__icon']} />
        <input
          className={styles['dashboard__search-input']}
          placeholder="Search transactions, accounts..."
          type="search"
        />
      </label>

      <div className={styles['dashboard__inline-group']}>
        <button
          className={`${styles['dashboard__notification-button']} ui-lift`}
          type="button"
        >
          <Bell className={styles['dashboard__notification-icon']} />
          <span className={styles['dashboard__notification-dot']} />
        </button>
        <button
          className={`${styles['dashboard__profile-button']} ui-lift`}
          type="button"
        >
          <span className={styles['dashboard__profile-avatar']}>AR</span>
          <span className={styles['dashboard__profile-name']}>Alex Rivera</span>
          <ChevronDown className={styles['dashboard__icon']} />
        </button>
      </div>
    </header>
  )
}

function BalanceHero() {
  const dispatch = useAppDispatch()
  const openTransferPanel = () => dispatch(openRightPanel('transfer'))

  return (
    <section className={styles['dashboard__balance-hero']}>
      <div>
        <p className={styles['dashboard__balance-label']}>
          Total balance · 2 accounts
        </p>
        <h1 className={styles['dashboard__balance-value']}>
          $21,420<span className={styles['dashboard__balance-cents']}>.50</span>
        </h1>
        <p className={styles['dashboard__balance-change']}>
          <ArrowUpRight className={styles['dashboard__trend-icon']} />
          +4.2% this month
        </p>
      </div>

      <div className={styles['dashboard__quick-actions']}>
        <ActionButton
          icon={ArrowUpRight}
          label="Transfer"
          onClick={openTransferPanel}
          primary
        />
        <ActionButton icon={Plus} label="Top up" onClick={openTransferPanel} />
        <ActionButton
          icon={ArrowDownLeft}
          label="Request"
          onClick={openTransferPanel}
        />
      </div>
    </section>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof ArrowUpRight
  label: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      className={cn(
        styles['dashboard__action-button'],
        primary
          ? styles['dashboard__action-button--primary']
          : styles['dashboard__action-button--secondary'],
      )}
      onClick={onClick}
      type="button"
    >
      <Icon className={styles['dashboard__action-icon']} />
      {label}
    </button>
  )
}

function AccountsGrid() {
  return (
    <div className={styles['dashboard__accounts-grid']}>
      {accounts.map(
        ({ accent, balance, currency, icon: Icon, name, suffix }) => (
          <article className={styles['dashboard__account-card']} key={name}>
            <div className={styles['dashboard__card-header']}>
              <div className={styles['dashboard__inline-group']}>
                <span
                  className={cn(styles['dashboard__account-icon-wrap'], accent)}
                >
                  <Icon className={styles['dashboard__card-icon']} />
                </span>
                <div>
                  <h2 className={styles['dashboard__account-name']}>{name}</h2>
                  <p className={styles['dashboard__account-meta']}>
                    {currency} · •• {suffix}
                  </p>
                </div>
              </div>
              <span className={styles['dashboard__account-status']}>
                ACTIVE
              </span>
            </div>
            <p className={styles['dashboard__account-balance']}>{balance}</p>
          </article>
        ),
      )}
    </div>
  )
}

function SpendingCard() {
  return (
    <section className={styles['dashboard__panel-card']}>
      <div className={styles['dashboard__panel-header']}>
        <h2 className={styles['dashboard__panel-title']}>Spending this week</h2>
        <div className={styles['dashboard__period-tabs']}>
          <span className={styles['dashboard__period-tab--active']}>Week</span>
          <span className={styles['dashboard__period-tab']}>Month</span>
        </div>
      </div>

      <div className={styles['dashboard__chart']}>
        {spending.map(({ active, day, height, value }) => (
          <div className={styles['dashboard__chart-column']} key={day}>
            {value ? (
              <span className={styles['dashboard__chart-value']}>{value}</span>
            ) : null}
            <span
              className={cn(
                styles['dashboard__chart-bar'],
                height,
                active
                  ? styles['dashboard__bar--active']
                  : styles['dashboard__bar--idle'],
              )}
            />
            <span className={styles['dashboard__chart-label']}>{day}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityCard() {
  return (
    <section className={styles['dashboard__panel-card']}>
      <div className={styles['dashboard__card-header']}>
        <h2 className={styles['dashboard__panel-title']}>Recent activity</h2>
        <button className={styles['dashboard__link-button']} type="button">
          View all
        </button>
      </div>

      <div>
        {transactions.map(
          ({
            amount,
            amountClassName,
            icon: Icon,
            meta,
            name,
            status,
            statusClassName,
          }) => (
            <div className={styles['dashboard__activity-item']} key={name}>
              <span className={styles['dashboard__activity-icon-wrap']}>
                <Icon className={styles['dashboard__card-icon']} />
              </span>
              <div className={styles['dashboard__activity-copy']}>
                <p className={styles['dashboard__activity-title']}>{name}</p>
                <p className={styles['dashboard__activity-meta']}>{meta}</p>
              </div>
              <span
                className={cn(
                  styles['dashboard__status-badge'],
                  statusClassName,
                )}
              >
                {status}
              </span>
              <span
                className={cn(styles['dashboard__amount'], amountClassName)}
              >
                {amount}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

function DebitCard() {
  return (
    <section className={styles['dashboard__debit-card']}>
      <div className={styles['dashboard__debit-orb-primary']} />
      <div className={styles['dashboard__debit-orb-secondary']} />

      <div className={styles['dashboard__debit-content']}>
        <div className={styles['dashboard__debit-header']}>
          <span className={styles['dashboard__debit-brand']}>buro</span>
          <span className={styles['dashboard__debit-type']}>DEBIT</span>
        </div>
        <p className={styles['dashboard__debit-number']}>•••• •••• •••• 4823</p>
        <div className={styles['dashboard__debit-footer']}>
          <div>
            <p className={styles['dashboard__debit-label']}>CARD HOLDER</p>
            <p className={styles['dashboard__debit-value']}>ALEX RIVERA</p>
          </div>
          <div>
            <p className={styles['dashboard__debit-label']}>EXPIRES</p>
            <p className={styles['dashboard__debit-value']}>09/28</p>
          </div>
          <div className={styles['dashboard__card-network']}>
            <span className={styles['dashboard__card-network-dot--red']} />
            <span className={styles['dashboard__card-network-dot--orange']} />
          </div>
        </div>
      </div>
    </section>
  )
}

function LimitsCard() {
  return (
    <section className={styles['dashboard__limits-card']}>
      <LimitRow
        label="Daily limit"
        value="$640 / $2,000"
        widthClassName={styles['dashboard__limit-fill--daily']}
      />
      <LimitRow
        barClassName={styles['dashboard__limit-fill--warning']}
        label="Online payments"
        value="$1,240 / $1,500"
        widthClassName={styles['dashboard__limit-fill--online']}
      />
    </section>
  )
}

function LimitRow({
  barClassName = styles['dashboard__bar--active'],
  label,
  value,
  widthClassName,
}: {
  barClassName?: string
  label: string
  value: string
  widthClassName: string
}) {
  return (
    <div>
      <div className={styles['dashboard__limit-header']}>
        <h2 className={styles['dashboard__panel-title']}>{label}</h2>
        <span className={styles['dashboard__limit-value']}>{value}</span>
      </div>
      <div className={styles['dashboard__limit-track']}>
        <div
          className={cn(
            styles['dashboard__limit-fill'],
            widthClassName,
            barClassName,
          )}
        />
      </div>
    </div>
  )
}

function NotificationsCard() {
  return (
    <section className={styles['dashboard__notifications-card']}>
      <div className={styles['dashboard__notifications-header']}>
        <h2 className={styles['dashboard__panel-title']}>Notifications</h2>
        <button className={styles['dashboard__link-button']} type="button">
          All
        </button>
      </div>
      {notifications.map(({ meta, title, unread }) => (
        <div className={styles['dashboard__notification-item']} key={title}>
          <span
            className={cn(
              styles['dashboard__notification-dot-small'],
              unread
                ? styles['dashboard__bar--active']
                : styles['dashboard__notification-dot-small--read'],
            )}
          />
          <div>
            <p
              className={cn(
                styles['dashboard__notification-title'],
                unread
                  ? styles['dashboard__notification-title--unread']
                  : styles['dashboard__notification-title--read'],
              )}
            >
              {title}
            </p>
            <p className={styles['dashboard__notification-meta']}>{meta}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default DashboardPage
