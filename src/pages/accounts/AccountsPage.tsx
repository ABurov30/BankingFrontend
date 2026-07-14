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
import styles from './styles.module.css'

const accounts = [
  {
    account: 'Main checking',
    balance: '$12,480.50',
    currency: 'USD',
    icon: WalletCards,
    iconClassName: styles['accounts__filter-button'],
    number: 'DE21 1001 •• 4823',
    status: 'ACTIVE',
    statusClassName: styles['accounts__filter-button--active'],
    type: 'Checking',
    enabled: true,
  },
  {
    account: 'Savings',
    balance: '€8,940.00',
    currency: 'EUR',
    icon: PiggyBank,
    iconClassName: styles['accounts__filter-button--idle'],
    number: 'DE21 1001 •• 9017',
    status: 'ACTIVE',
    statusClassName: styles['accounts__filter-button--active'],
    type: 'Savings',
    enabled: true,
  },
  {
    account: 'Business',
    balance: '$46,120.75',
    currency: 'USD',
    icon: Store,
    iconClassName: styles['accounts__icon-banking'],
    number: 'DE21 1001 •• 2231',
    status: 'INACTIVE',
    statusClassName: styles['accounts__icon-card'],
    type: 'Business',
    enabled: false,
    muted: true,
  },
]

function AccountsPage() {
  return (
    <section className={`${styles['accounts']} ui-enter`}>
      <header className={styles['accounts__header']}>
        <div>
          <h1 className={styles['accounts__title']}>Accounts</h1>
          <p className={styles['accounts__subtitle']}>
            3 accounts · $67,541.25 total
          </p>
        </div>

        <button
          className={`${styles['accounts__add-button']} ui-lift`}
          type="button"
        >
          <Plus className={styles['accounts__button-icon']} />
          New account
        </button>
      </header>

      <div className={styles['accounts__toolbar']}>
        <label className={styles['accounts__search']}>
          <Search className={styles['accounts__search-icon']} />
          <input
            className={styles['accounts__search-input']}
            placeholder="Search by name or number..."
            type="search"
          />
        </label>

        <div className={styles['accounts__filters']}>
          <FilterButton active label="Status: All" />
          <FilterButton label="Type: Any" />
          <FilterButton label="Currency: Any" />
        </div>
      </div>

      <div className={`${styles['accounts__table-card']} ui-lift`}>
        <div className={styles['accounts__table-scroll']}>
          <div className={styles['accounts__table-head']}>
            <div className={styles['accounts__account-head']}>
              <span>Account</span>
              <span>Type</span>
              <span>Currency</span>
              <span className={styles['accounts__head-cell']}>Balance</span>
              <span>Status</span>
              <span className={styles['accounts__head-cell']}>Actions</span>
            </div>

            {accounts.map((account) => (
              <AccountRow key={account.account} {...account} />
            ))}
          </div>
        </div>
      </div>

      <footer className={styles['accounts__footer']}>
        <p className={styles['accounts__footer-text']}>Showing 3 of 3 accounts</p>
        <button
          className={`${styles['accounts__page-button']} ui-lift`}
          type="button"
        >
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
        styles['accounts__icon-savings'],
        active ? styles['accounts__status'] : styles['accounts__status--active'],
      )}
      type="button"
    >
      {label}
      <ChevronDown
        className={cn(
          styles['accounts__status--review'],
          active ? styles['accounts__toggle'] : styles['accounts__toggle--on'],
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
    <div
      className={cn(
        styles['accounts__table-row'],
        muted && styles['accounts__toggle--off'],
      )}
    >
      <div className={styles['accounts__account-cell']}>
        <span className={cn(styles['accounts__account-icon'], iconClassName)}>
          <Icon className={styles['accounts__icon']} />
        </span>
        <div className={styles['accounts__account-copy']}>
          <p className={styles['accounts__account-name']}>{account}</p>
          <p className={styles['accounts__account-number']}>{number}</p>
        </div>
      </div>

      <span className={styles['accounts__type']}>{type}</span>
      <span className={styles['accounts__currency']}>{currency}</span>
      <span className={styles['accounts__balance']}>{balance}</span>
      <span className={cn(styles['accounts__status-badge'], statusClassName)}>
        {status}
      </span>
      <div className={styles['accounts__actions']}>
        <span
          className={cn(
            styles['accounts__status-badge--active'],
            enabled ? styles['accounts__status-badge--review'] : styles['accounts__status-badge--muted'],
          )}
          aria-hidden="true"
        >
          <span className={styles['accounts__toggle-knob']} />
        </span>
        <button
          aria-label={`Open actions for ${account}`}
          className={`${styles['accounts__more-button']} ui-lift`}
          type="button"
        >
          <MoreHorizontal className={styles['accounts__icon']} />
        </button>
      </div>
    </div>
  )
}

export default AccountsPage
