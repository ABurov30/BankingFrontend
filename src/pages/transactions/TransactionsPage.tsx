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

import { useAppDispatch } from '@/app/hooks'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { cn } from '@/lib/utils'
import './styles.css'

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
    iconClassName: 'transactions-style-50',
    id: 'TX-93412',
    name: 'Transfer to Nadia K.',
    source: 'Main •• 4823',
    status: 'CREATED',
    statusClassName: 'transactions-style-51',
    type: 'P2P',
  },
  {
    amount: '-$118.30',
    date: 'Jul 5, 08:47',
    icon: Zap,
    iconClassName: 'transactions-style-51',
    id: 'TX-93408',
    name: 'Utility bill - PowerGrid',
    source: 'Main •• 4823',
    status: 'VALIDATED',
    statusClassName: 'transactions-style-52',
    type: 'Bill pay',
  },
  {
    amount: '-$500.00',
    date: 'Jul 3, 21:14',
    icon: WalletCards,
    iconClassName: 'transactions-style-51',
    id: 'TX-93395',
    name: 'Transfer to Savings',
    source: 'Main •• 4823',
    status: 'AUTHORIZED',
    statusClassName: 'transactions-style-53',
    type: 'Internal',
  },
  {
    amount: '-$62.40',
    date: 'Jul 4, 18:22',
    icon: ShoppingBasket,
    iconClassName: 'transactions-style-51',
    id: 'TX-93371',
    name: 'Grocery Market',
    source: 'Card •• 4823',
    status: 'COMPLETED',
    statusClassName: 'transactions-style-54',
    type: 'Card payment',
  },
  {
    amount: '+$4,200.00',
    amountClassName: 'transactions-style-55',
    date: 'Jul 4, 09:00',
    icon: Store,
    iconClassName: 'transactions-style-54',
    id: 'TX-93340',
    name: 'Salary - ACME Corp',
    source: 'Main •• 4823',
    status: 'COMPLETED',
    statusClassName: 'transactions-style-54',
    type: 'Incoming',
  },
  {
    amount: '-$12.99',
    amountClassName: 'transactions-style-56',
    date: 'Jul 3, 12:00',
    icon: ReceiptText,
    iconClassName: 'transactions-style-51',
    id: 'TX-93322',
    name: 'StreamFlix subscription',
    source: 'Card •• 7710',
    status: 'DECLINED',
    statusClassName: 'transactions-style-57',
    type: 'Card payment',
  },
  {
    amount: '-$418.00',
    amountClassName: 'transactions-style-58',
    date: 'Jul 2, 15:38',
    icon: Plane,
    iconClassName: 'transactions-style-51',
    id: 'TX-93301',
    name: 'AirEuropa tickets',
    source: 'Card •• 4823',
    status: 'CANCELLED',
    statusClassName: 'transactions-style-59',
    type: 'Card payment',
  },
]

function TransactionsPage() {
  const dispatch = useAppDispatch()

  return (
    <section className="transactions-style-1 ui-enter">
      <div className="transactions-style-2">
        <div className="transactions-style-3">
          <header className="transactions-style-4">
            <h1 className="transactions-style-5">Transactions</h1>

            <button
              className="transactions-style-6 ui-lift"
              onClick={() => dispatch(openRightPanel('transfer'))}
              type="button"
            >
              <ArrowUpRight className="transactions-style-7" />
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
    <div className="transactions-style-8">
      <div className="transactions-style-9">
        {filters.map((filter) => {
          const active = filter === 'All'
          return (
            <button
              className={cn(
                'transactions-style-60',
                active ? 'transactions-style-61' : 'transactions-style-62',
              )}
              key={filter}
              type="button"
            >
              {filter}
            </button>
          )
        })}
      </div>

      <div className="transactions-style-10">
        <button className="transactions-style-11" type="button">
          <CalendarDays className="transactions-style-12" />
          Jul 1 - Jul 5
        </button>
      </div>
    </div>
  )
}

function TransactionsTable() {
  return (
    <div className="transactions-style-13 ui-lift">
      <div className="transactions-style-14">
        <div className="transactions-style-15">
          <div className="transactions-style-16">
            <span>Transaction</span>
            <span>Source</span>
            <span>Date</span>
            <span>Status</span>
            <span className="transactions-style-17">Amount</span>
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
      className={cn('transactions-style-67', active && 'transactions-style-63')}
    >
      <div className="transactions-style-18">
        <span className={cn('transactions-style-64', iconClassName)}>
          <Icon className="transactions-style-7" />
        </span>
        <div className="transactions-style-1">
          <p className="transactions-style-19">{name}</p>
          <p className="transactions-style-20">
            {id} · {type}
          </p>
        </div>
      </div>

      <span className="transactions-style-21">{source}</span>
      <span className="transactions-style-21">{date}</span>
      <span className={cn('transactions-style-65', statusClassName)}>
        {status}
      </span>
      <span className={cn('transactions-style-66', amountClassName)}>
        {amount}
      </span>
    </div>
  )
}

export default TransactionsPage
