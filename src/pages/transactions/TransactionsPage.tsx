import {
  ArrowUpRight,
  CalendarDays,
  Plane,
  ReceiptText,
  ShoppingBasket,
  Store,
  WalletCards,
  Zap,
} from 'lucide-react'
import { useEffect } from 'react'

import { useAppDispatch } from '@/app/hooks'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

const filters = [
  'All',
  'Created',
  'Validated',
  'Authorized',
  'Completed',
  'Declined',
  'Cancelled',
]

const transactions = [
  {
    active: true,
    amount: '-$250.00',
    date: 'Jul 5, 09:12',
    icon: ArrowUpRight,
    iconClassName: styles['transactions__icon--expense'],
    id: 'TX-93412',
    name: 'Transfer to Nadia K.',
    source: 'Main •• 4823',
    status: 'CREATED',
    statusClassName: styles['transactions__icon--transfer'],
    type: 'P2P',
  },
  {
    amount: '-$118.30',
    date: 'Jul 5, 08:47',
    icon: Zap,
    iconClassName: styles['transactions__icon--transfer'],
    id: 'TX-93408',
    name: 'Utility bill - PowerGrid',
    source: 'Main •• 4823',
    status: 'VALIDATED',
    statusClassName: styles['transactions__status--completed'],
    type: 'Bill pay',
  },
  {
    amount: '-$500.00',
    date: 'Jul 3, 21:14',
    icon: WalletCards,
    iconClassName: styles['transactions__icon--transfer'],
    id: 'TX-93395',
    name: 'Transfer to Savings',
    source: 'Main •• 4823',
    status: 'AUTHORIZED',
    statusClassName: styles['transactions__status--authorized'],
    type: 'Internal',
  },
  {
    amount: '-$62.40',
    date: 'Jul 4, 18:22',
    icon: ShoppingBasket,
    iconClassName: styles['transactions__icon--transfer'],
    id: 'TX-93371',
    name: 'Grocery Market',
    source: 'Card •• 4823',
    status: 'COMPLETED',
    statusClassName: styles['transactions__status--pending'],
    type: 'Card payment',
  },
  {
    amount: '+$4,200.00',
    amountClassName: styles['transactions__amount--positive'],
    date: 'Jul 4, 09:00',
    icon: Store,
    iconClassName: styles['transactions__status--pending'],
    id: 'TX-93340',
    name: 'Salary - ACME Corp',
    source: 'Main •• 4823',
    status: 'COMPLETED',
    statusClassName: styles['transactions__status--pending'],
    type: 'Incoming',
  },
  {
    amount: '-$12.99',
    amountClassName: styles['transactions__amount--negative'],
    date: 'Jul 3, 12:00',
    icon: ReceiptText,
    iconClassName: styles['transactions__icon--transfer'],
    id: 'TX-93322',
    name: 'StreamFlix subscription',
    source: 'Card •• 7710',
    status: 'DECLINED',
    statusClassName: styles['transactions__status--declined'],
    type: 'Card payment',
  },
  {
    amount: '-$418.00',
    amountClassName: styles['transactions__amount--failed'],
    date: 'Jul 2, 15:38',
    icon: Plane,
    iconClassName: styles['transactions__icon--transfer'],
    id: 'TX-93301',
    name: 'AirEuropa tickets',
    source: 'Card •• 4823',
    status: 'CANCELLED',
    statusClassName: styles['transactions__status--muted'],
    type: 'Card payment',
  },
]

function TransactionsPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(openRightPanel('transfer'))
  }, [dispatch])

  return (
    <section className={`${styles['transactions']} ui-enter`}>
      <div className={styles['transactions__inner']}>
        <div className={styles['transactions__stack']}>
          <header className={styles['transactions__header']}>
            <h1 className={styles['transactions__title']}>Transactions</h1>

            <button
              className={`${styles['transactions__export-button']} ui-lift`}
              onClick={() => dispatch(openRightPanel('transfer'))}
              type="button"
            >
              <ArrowUpRight className={styles['transactions__icon']} />
              New transfer
            </button>
          </header>

          <Filters />
          <TransactionsTable />
        </div>
      </div>
    </section>
  )
}

function Filters() {
  return (
    <div className={styles['transactions__filters']}>
      <div className={styles['transactions__filter-tabs']}>
        {filters.map((filter) => {
          const active = filter === 'All'
          return (
            <button
              className={cn(
                styles['transactions__filter-button'],
                active
                  ? styles['transactions__filter-button--active']
                  : styles['transactions__filter-button--idle'],
              )}
              key={filter}
              type="button"
            >
              {filter}
            </button>
          )
        })}
      </div>

      <div className={styles['transactions__date-filter']}>
        <button className={styles['transactions__date-button']} type="button">
          <CalendarDays className={styles['transactions__date-icon']} />
          Jul 1 - Jul 5
        </button>
      </div>
    </div>
  )
}

function TransactionsTable() {
  return (
    <div className={`${styles['transactions__table-card']} ui-lift`}>
      <div className={styles['transactions__table-scroll']}>
        <div className={styles['transactions__table-head']}>
          <div className={styles['transactions__merchant-head']}>
            <span>Transaction</span>
            <span>Source</span>
            <span>Date</span>
            <span>Status</span>
            <span className={styles['transactions__amount-head']}>Amount</span>
          </div>

          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  )
}

type TransactionRowProps = (typeof transactions)[number]

function TransactionRow({
  active,
  amount,
  amountClassName,
  date,
  icon: Icon,
  iconClassName,
  id,
  name,
  source,
  status,
  statusClassName,
  type,
}: TransactionRowProps) {
  return (
    <div
      className={cn(
        styles['transactions__row'],
        active && styles['transactions__row--active'],
      )}
    >
      <div className={styles['transactions__merchant-cell']}>
        <span className={cn(styles['transactions__row-icon'], iconClassName)}>
          <Icon className={styles['transactions__icon']} />
        </span>
        <div className={styles['transactions']}>
          <p className={styles['transactions__merchant-name']}>{name}</p>
          <p className={styles['transactions__merchant-meta']}>
            {id} · {type}
          </p>
        </div>
      </div>

      <span className={styles['transactions__cell']}>{source}</span>
      <span className={styles['transactions__cell']}>{date}</span>
      <span
        className={cn(styles['transactions__status-badge'], statusClassName)}
      >
        {status}
      </span>
      <span className={cn(styles['transactions__amount'], amountClassName)}>
        {amount}
      </span>
    </div>
  )
}

export default TransactionsPage
