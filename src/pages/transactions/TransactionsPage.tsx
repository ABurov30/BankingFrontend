import { ArrowUpRight } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  closeRightPanel,
  openRightPanel,
} from '@/features/rightPanel/rightPanelSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { useGetTransactionsByUserIdQuery } from '@/shared/api/transactionApi'
import { useI18n } from '@/shared/i18n/useI18n'
import { Filters, TransactionsTable } from './components'
import styles from './styles.module.css'

function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
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
            transactions={transactions}
          />
        </div>
      </div>
    </section>
  )
}

export default TransactionsPage
