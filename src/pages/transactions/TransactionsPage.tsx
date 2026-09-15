import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppDispatch } from '@/app/hooks'
import {
  closeRightPanel,
  openRightPanel,
} from '@/features/rightPanel/rightPanelSlice'
import { useGetMyTransactionsQuery } from '@/shared/api/transactionApi'
import type { TransactionResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import {
  Filters,
  TransactionStatusDialog,
  TransactionsTable,
} from './components'
import styles from './styles.module.css'

function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const [trackedTransaction, setTrackedTransaction] =
    useState<TransactionResponseDto | null>(null)
  const { data: transactions = [], isFetching } = useGetMyTransactionsQuery()

  useEffect(() => {
    dispatch(closeRightPanel())
  }, [dispatch])

  return (
    <section
      className={`${styles['transactions']} ui-enter`}
      data-testid="page-transactions"
    >
      <div className={styles['transactions__inner']}>
        <div className={styles['transactions__stack']}>
          <header className={styles['transactions__header']}>
            <h1 className={styles['transactions__title']}>
              {t('transactions')}
            </h1>

            <button
              data-testid="transactions-new-transfer"
              className={`${styles['transactions__export-button']} ui-lift`}
              onClick={() => dispatch(openRightPanel('transfer'))}
              type="button"
            >
              <ArrowUpRight className={styles['transactions__icon']} />
              {t('newTransfer')}
            </button>
          </header>

          <Filters />
          <TransactionsTable
            isLoading={isFetching}
            onTrackTransaction={setTrackedTransaction}
            transactions={transactions}
          />
        </div>
      </div>

      {trackedTransaction ? (
        <TransactionStatusDialog
          onClose={() => setTrackedTransaction(null)}
          transaction={trackedTransaction}
        />
      ) : null}
    </section>
  )
}

export default TransactionsPage
