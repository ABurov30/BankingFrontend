import { ArrowLeftRight } from 'lucide-react'

import { formatMoney } from '@/lib/formatMoney'
import { type TransactionStatus } from '@/shared/api/enums'
import type { TransactionResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function TransactionsTable({
  isLoading = false,
  transactions = [],
}: {
  isLoading?: boolean
  transactions?: TransactionResponseDto[]
}) {
  const { t } = useI18n()

  return (
    <div className={`${styles['transactions__table-card']} ui-lift`}>
      <div className={styles['transactions__table-scroll']}>
        <div className={styles['transactions__table-head']}>
          <div className={styles['transactions__merchant-head']}>
            <span>{t('transaction')}</span>
            <span>{t('source')}</span>
            <span>{t('date')}</span>
            <span>{t('status')}</span>
            <span className={styles['transactions__amount-head']}>
              {t('amount')}
            </span>
          </div>

          {isLoading && transactions.length === 0 ? (
            <p className={styles['transactions__empty-state']}>
              {t('checking')}
            </p>
          ) : transactions.length ? (
            transactions.map((transaction, index) => (
              <div
                className={styles['transactions__row']}
                key={getTransactionKey(transaction, index)}
              >
                <div className={styles['transactions__merchant-cell']}>
                  <span
                    className={`${styles['transactions__row-icon']} ${styles['transactions__icon--transfer']}`}
                  >
                    <ArrowLeftRight />
                  </span>
                  <div>
                    <p className={styles['transactions__merchant-name']}>
                      {t('transfer')}
                    </p>
                    <p className={styles['transactions__merchant-meta']}>
                      {t('to')}: {getAccountNumber(transaction.targetAccount)}
                    </p>
                  </div>
                </div>
                <span className={styles['transactions__cell']}>
                  {getAccountNumber(transaction.sourceAccount)}
                </span>
                <span className={styles['transactions__cell']}>
                  {formatTransactionDate(transaction.createdAt)}
                </span>
                <span
                  className={`${styles['transactions__status-badge']} ${styles['transactions__status--muted']}`}
                >
                  {formatTransactionStatus(transaction.status)}
                </span>
                <strong
                  className={`${styles['transactions__amount']} ${styles['transactions__amount--negative']}`}
                >
                  {formatMoney(transaction.amount, transaction.currency)}
                </strong>
              </div>
            ))
          ) : (
            <p className={styles['transactions__empty-state']}>
              {t('noTransactionData')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function getTransactionKey(transaction: TransactionResponseDto, index: number) {
  return [
    transaction.createdAt,
    transaction.sourceAccount?.accountId,
    transaction.targetAccount?.accountId,
    index,
  ].join('-')
}

function getAccountNumber(
  transactionAccount?: TransactionResponseDto['sourceAccount'],
) {
  return transactionAccount?.accountNumber ?? '—'
}

function formatTransactionDate(value?: string) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.valueOf())) return '—'

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatTransactionStatus(status?: TransactionStatus) {
  return status?.replaceAll('_', ' ') ?? '—'
}
