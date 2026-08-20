import { ArrowUpRight } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  closeRightPanel,
  openRightPanel,
} from '@/features/rightPanel/rightPanelSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { useGetTransactionsByUserIdQuery } from '@/shared/api/transactionApi'
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
  const user = useAppSelector(selectCurrentUser)
  const [trackedTransaction, setTrackedTransaction] =
    useState<TransactionResponseDto | null>(null)
  const { data: transactions = [], isFetching } =
    useGetTransactionsByUserIdQuery(user?.userProfileId ?? skipToken)

  useEffect(() => {
    dispatch(closeRightPanel())
  }, [dispatch])

  return (
    <section className={`${styles['transactions']} ui-enter`}>
      <div className={styles['transactions__inner']}>
        <div className={styles['transactions__stack']}>
          <header className={styles['transactions__header']}>
            <h1 className={styles['transactions__title']}>
              {t('transactions')}
            </h1>

            <button
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
