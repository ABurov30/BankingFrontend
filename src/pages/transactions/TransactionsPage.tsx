import { ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'

import { useAppDispatch } from '@/app/hooks'
import {
  closeRightPanel,
  openRightPanel,
} from '@/features/rightPanel/rightPanelSlice'
import { useI18n } from '@/shared/i18n/useI18n'
import { Filters, TransactionsTable } from './components'
import styles from './styles.module.css'

function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()

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
          <TransactionsTable />
        </div>
      </div>
    </section>
  )
}

export default TransactionsPage
