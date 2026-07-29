import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function TransactionsTable() {
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

          <p className={styles['transactions__empty-state']}>
            {t('noTransactionData')}
          </p>
        </div>
      </div>
    </div>
  )
}
