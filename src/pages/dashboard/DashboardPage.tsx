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

import { cn } from '@/lib/utils'
import './styles.css'

const accounts = [
  {
    accent: 'dashboard-style-69',
    balance: '$12,480.50',
    currency: 'USD',
    icon: WalletCards,
    name: 'Main checking',
    suffix: '4823',
  },
  {
    accent: 'dashboard-style-70',
    balance: '€8,940.00',
    currency: 'EUR',
    icon: Landmark,
    name: 'Savings',
    suffix: '9017',
  },
]

const spending = [
  { day: 'Mon', height: 'dashboard-style-71' },
  { day: 'Tue', height: 'dashboard-style-72' },
  { day: 'Wed', height: 'dashboard-style-73' },
  { day: 'Thu', height: 'dashboard-style-74', active: true, value: '$412' },
  { day: 'Fri', height: 'dashboard-style-75' },
  { day: 'Sat', height: 'dashboard-style-76' },
  { day: 'Sun', height: 'dashboard-style-77' },
]

const transactions = [
  {
    amount: '-$62.40',
    icon: ShoppingBasket,
    meta: 'Card •• 4823 · Jul 4, 18:22',
    name: 'Grocery Market',
    status: 'COMPLETED',
    statusClassName: 'dashboard-style-78',
  },
  {
    amount: '+$4,200.00',
    amountClassName: 'dashboard-style-79',
    icon: BriefcaseBusiness,
    meta: 'Main checking · Jul 4, 09:00',
    name: 'Salary - ACME Corp',
    status: 'COMPLETED',
    statusClassName: 'dashboard-style-78',
  },
  {
    amount: '-$500.00',
    icon: Send,
    meta: 'Main -> Savings · Jul 3, 21:14',
    name: 'Transfer to Savings',
    status: 'AUTHORIZED',
    statusClassName: 'dashboard-style-80',
  },
  {
    amount: '-$12.99',
    amountClassName: 'dashboard-style-81',
    icon: Subtitles,
    meta: 'Card •• 7710 · Jul 3, 12:00',
    name: 'StreamFlix subscription',
    status: 'DECLINED',
    statusClassName: 'dashboard-style-82',
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
    <section className="dashboard-style-1 ui-enter">
      <Topbar />

      <div className="dashboard-style-2">
        <div className="dashboard-style-3">
          <BalanceHero />
          <AccountsGrid />
          <SpendingCard />
          <ActivityCard />
        </div>

        <aside className="dashboard-style-4">
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
    <header className="dashboard-style-5">
      <label className="dashboard-style-6">
        <Search className="dashboard-style-7" />
        <input
          className="dashboard-style-98"
          placeholder="Search transactions, accounts..."
          type="search"
        />
      </label>

      <div className="dashboard-style-8">
        <button className="dashboard-style-9 ui-lift" type="button">
          <Bell className="dashboard-style-10" />
          <span className="dashboard-style-11" />
        </button>
        <button className="dashboard-style-12 ui-lift" type="button">
          <span className="dashboard-style-13">AR</span>
          <span className="dashboard-style-14">Alex Rivera</span>
          <ChevronDown className="dashboard-style-7" />
        </button>
      </div>
    </header>
  )
}

function BalanceHero() {
  return (
    <section className="dashboard-style-15">
      <div>
        <p className="dashboard-style-16">Total balance · 2 accounts</p>
        <h1 className="dashboard-style-17">
          $21,420<span className="dashboard-style-18">.50</span>
        </h1>
        <p className="dashboard-style-19">
          <ArrowUpRight className="dashboard-style-20" />
          +4.2% this month
        </p>
      </div>

      <div className="dashboard-style-21">
        <ActionButton icon={ArrowUpRight} label="Transfer" primary />
        <ActionButton icon={Plus} label="Top up" />
        <ActionButton icon={ArrowDownLeft} label="Request" />
      </div>
    </section>
  )
}

function ActionButton({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof ArrowUpRight
  label: string
  primary?: boolean
}) {
  return (
    <button
      className={cn(
        'dashboard-style-83',
        primary ? 'dashboard-style-84' : 'dashboard-style-85',
      )}
      type="button"
    >
      <Icon className="dashboard-style-22" />
      {label}
    </button>
  )
}

function AccountsGrid() {
  return (
    <div className="dashboard-style-23">
      {accounts.map(
        ({ accent, balance, currency, icon: Icon, name, suffix }) => (
          <article className="dashboard-style-24" key={name}>
            <div className="dashboard-style-25">
              <div className="dashboard-style-8">
                <span className={cn('dashboard-style-86', accent)}>
                  <Icon className="dashboard-style-26" />
                </span>
                <div>
                  <h2 className="dashboard-style-27">{name}</h2>
                  <p className="dashboard-style-28">
                    {currency} · •• {suffix}
                  </p>
                </div>
              </div>
              <span className="dashboard-style-29">ACTIVE</span>
            </div>
            <p className="dashboard-style-30">{balance}</p>
          </article>
        ),
      )}
    </div>
  )
}

function SpendingCard() {
  return (
    <section className="dashboard-style-31">
      <div className="dashboard-style-32">
        <h2 className="dashboard-style-33">Spending this week</h2>
        <div className="dashboard-style-34">
          <span className="dashboard-style-35">Week</span>
          <span className="dashboard-style-36">Month</span>
        </div>
      </div>

      <div className="dashboard-style-37">
        {spending.map(({ active, day, height, value }) => (
          <div className="dashboard-style-38" key={day}>
            {value ? <span className="dashboard-style-39">{value}</span> : null}
            <span
              className={cn(
                'dashboard-style-87',
                height,
                active ? 'dashboard-style-88' : 'dashboard-style-89',
              )}
            />
            <span className="dashboard-style-40">{day}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityCard() {
  return (
    <section className="dashboard-style-31">
      <div className="dashboard-style-25">
        <h2 className="dashboard-style-33">Recent activity</h2>
        <button className="dashboard-style-41" type="button">
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
            <div className="dashboard-style-42" key={name}>
              <span className="dashboard-style-43">
                <Icon className="dashboard-style-26" />
              </span>
              <div className="dashboard-style-44">
                <p className="dashboard-style-45">{name}</p>
                <p className="dashboard-style-46">{meta}</p>
              </div>
              <span className={cn('dashboard-style-90', statusClassName)}>
                {status}
              </span>
              <span className={cn('dashboard-style-91', amountClassName)}>
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
    <section className="dashboard-style-47">
      <div className="dashboard-style-48" />
      <div className="dashboard-style-49" />

      <div className="dashboard-style-50">
        <div className="dashboard-style-51">
          <span className="dashboard-style-52">beam</span>
          <span className="dashboard-style-53">DEBIT</span>
        </div>
        <p className="dashboard-style-54">•••• •••• •••• 4823</p>
        <div className="dashboard-style-55">
          <div>
            <p className="dashboard-style-56">CARD HOLDER</p>
            <p className="dashboard-style-57">ALEX RIVERA</p>
          </div>
          <div>
            <p className="dashboard-style-56">EXPIRES</p>
            <p className="dashboard-style-57">09/28</p>
          </div>
          <div className="dashboard-style-58">
            <span className="dashboard-style-59" />
            <span className="dashboard-style-60" />
          </div>
        </div>
      </div>
    </section>
  )
}

function LimitsCard() {
  return (
    <section className="dashboard-style-61">
      <LimitRow label="Daily limit" value="$640 / $2,000" width="w-[32%]" />
      <LimitRow
        barClassName="bg-ui-gold"
        label="Online payments"
        value="$1,240 / $1,500"
        width="w-[83%]"
      />
    </section>
  )
}

function LimitRow({
  barClassName = 'dashboard-style-88',
  label,
  value,
  width,
}: {
  barClassName?: string
  label: string
  value: string
  width: string
}) {
  return (
    <div>
      <div className="dashboard-style-62">
        <h2 className="dashboard-style-33">{label}</h2>
        <span className="dashboard-style-63">{value}</span>
      </div>
      <div className="dashboard-style-64">
        <div className={cn('dashboard-style-92', width, barClassName)} />
      </div>
    </div>
  )
}

function NotificationsCard() {
  return (
    <section className="dashboard-style-65">
      <div className="dashboard-style-66">
        <h2 className="dashboard-style-33">Notifications</h2>
        <button className="dashboard-style-41" type="button">
          All
        </button>
      </div>
      {notifications.map(({ meta, title, unread }) => (
        <div className="dashboard-style-67" key={title}>
          <span
            className={cn(
              'dashboard-style-93',
              unread ? 'dashboard-style-88' : 'dashboard-style-94',
            )}
          />
          <div>
            <p
              className={cn(
                'dashboard-style-95',
                unread ? 'dashboard-style-96' : 'dashboard-style-97',
              )}
            >
              {title}
            </p>
            <p className="dashboard-style-68">{meta}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default DashboardPage
