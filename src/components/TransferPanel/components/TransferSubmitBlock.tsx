import { ShieldCheck } from 'lucide-react'

import type { PanelOperation, TranslationFunction } from '../types'
import styles from '../styles.module.css'

export function TransferSubmitBlock({
  disabled,
  isSubmitting,
  operation,
  t,
}: {
  disabled: boolean
  isSubmitting: boolean
  operation: PanelOperation | null
  t: TranslationFunction
}) {
  return (
    <div className={styles['transfer-panel__security']}>
      <div className={styles['transfer-panel__account-summary']}>
        <ShieldCheck className={styles['transfer-panel__security-icon']} />
        <p className={styles['transfer-panel__security-copy']}>
          {t('fundsVerified')}
        </p>
      </div>
      <button
        className={`${styles['transfer-panel__submit']} ui-lift`}
        disabled={disabled}
        type="submit"
      >
        {isSubmitting
          ? t('processing')
          : operation === 'TOP_UP'
            ? t('topUp')
            : operation === 'WITHDRAW'
              ? t('withdraw')
              : t('reviewTransfer')}
      </button>
    </div>
  )
}
