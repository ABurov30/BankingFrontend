import {
  ChevronDown,
  MoreHorizontal,
  PiggyBank,
  Plus,
  Search,
  Store,
  WalletCards,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import './styles.css'

const accounts = [
  {
    account: 'Main checking',
    balance: '$12,480.50',
    currency: 'USD',
    icon: WalletCards,
    iconClassName: 'accounts-style-30',
    number: 'DE21 1001 •• 4823',
    status: 'ACTIVE',
    statusClassName: 'accounts-style-31',
    type: 'Checking',
    enabled: true,
  },
  {
    account: 'Savings',
    balance: '€8,940.00',
    currency: 'EUR',
    icon: PiggyBank,
    iconClassName: 'accounts-style-32',
    number: 'DE21 1001 •• 9017',
    status: 'ACTIVE',
    statusClassName: 'accounts-style-31',
    type: 'Savings',
    enabled: true,
  },
  {
    account: 'Business',
    balance: '$46,120.75',
    currency: 'USD',
    icon: Store,
    iconClassName: 'accounts-style-33',
    number: 'DE21 1001 •• 2231',
    status: 'INACTIVE',
    statusClassName: 'accounts-style-34',
    type: 'Business',
    enabled: false,
    muted: true,
  },
]

function AccountsPage() {
  return (
    <section className="accounts-style-1 ui-enter">
      <header className="accounts-style-2">
        <div>
          <h1 className="accounts-style-3">Accounts</h1>
          <p className="accounts-style-4">3 accounts · $67,541.25 total</p>
        </div>

        <button className="accounts-style-5 ui-lift" type="button">
          <Plus className="accounts-style-6" />
          New account
        </button>
      </header>

      <div className="accounts-style-7">
        <label className="accounts-style-8">
          <Search className="accounts-style-9" />
          <input
            className="accounts-style-47"
            placeholder="Search by name or number..."
            type="search"
          />
        </label>

        <div className="accounts-style-10">
          <FilterButton active label="Status: All" />
          <FilterButton label="Type: Any" />
          <FilterButton label="Currency: Any" />
        </div>
      </div>

      <div className="accounts-style-11 ui-lift">
        <div className="accounts-style-12">
          <div className="accounts-style-13">
            <div className="accounts-style-14">
              <span>Account</span>
              <span>Type</span>
              <span>Currency</span>
              <span className="accounts-style-15">Balance</span>
              <span>Status</span>
              <span className="accounts-style-15">Actions</span>
            </div>

            {accounts.map((account) => (
              <AccountRow key={account.account} {...account} />
            ))}
          </div>
        </div>
      </div>

      <footer className="accounts-style-16">
        <p className="accounts-style-17">Showing 3 of 3 accounts</p>
        <button className="accounts-style-18 ui-lift" type="button">
          1
        </button>
      </footer>
    </section>
  )
}

function FilterButton({ active, label }: { active?: boolean; label: string }) {
  return (
    <button
      className={cn(
        'accounts-style-35',
        active ? 'accounts-style-36' : 'accounts-style-37',
      )}
      type="button"
    >
      {label}
      <ChevronDown
        className={cn(
          'accounts-style-38',
          active ? 'accounts-style-39' : 'accounts-style-40',
        )}
      />
    </button>
  )
}

type AccountRowProps = (typeof accounts)[number]

function AccountRow({
  account,
  balance,
  currency,
  enabled,
  icon: Icon,
  iconClassName,
  muted,
  number,
  status,
  statusClassName,
  type,
}: AccountRowProps) {
  return (
    <div className={cn('accounts-style-48', muted && 'accounts-style-41')}>
      <div className="accounts-style-19">
        <span className={cn('accounts-style-42', iconClassName)}>
          <Icon className="accounts-style-20" />
        </span>
        <div className="accounts-style-21">
          <p className="accounts-style-22">{account}</p>
          <p className="accounts-style-23">{number}</p>
        </div>
      </div>

      <span className="accounts-style-24">{type}</span>
      <span className="accounts-style-25">{currency}</span>
      <span className="accounts-style-26">{balance}</span>
      <span className={cn('accounts-style-43', statusClassName)}>{status}</span>
      <div className="accounts-style-27">
        <span
          className={cn(
            'accounts-style-44',
            enabled ? 'accounts-style-45' : 'accounts-style-46',
          )}
          aria-hidden="true"
        >
          <span className="accounts-style-28" />
        </span>
        <button
          aria-label={`Open actions for ${account}`}
          className="accounts-style-29 ui-lift"
          type="button"
        >
          <MoreHorizontal className="accounts-style-20" />
        </button>
      </div>
    </div>
  )
}

export default AccountsPage
