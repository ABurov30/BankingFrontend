import { ArrowLeftRight, Plus } from 'lucide-react'

import styles from '../styles.module.css'

export function AccountsPageHeader({
  isCreateDisabled,
  isCreatingAccount,
  labels,
  onCreateAccount,
  onOpenTransfer,
}: {
  isCreateDisabled: boolean
  isCreatingAccount: boolean
  labels: {
    accounts: string
    newAccount: string
    transfer: string
  }
  onCreateAccount: () => void
  onOpenTransfer: () => void
}) {
  return (
    <header className={styles['accounts__header']}>
      <div>
        <h1 className={styles['accounts__title']}>{labels.accounts}</h1>
      </div>

      <div className={styles['accounts__header-actions']}>
        <button
          className={`${styles['accounts__transfer-button']} ui-lift`}
          disabled={isCreateDisabled}
          onClick={onOpenTransfer}
          type="button"
        >
          <ArrowLeftRight className={styles['accounts__button-icon']} />
          {labels.transfer}
        </button>
        <button
          className={`${styles['accounts__add-button']} ui-lift`}
          disabled={isCreateDisabled || isCreatingAccount}
          onClick={onCreateAccount}
          type="button"
        >
          <Plus className={styles['accounts__button-icon']} />
          {labels.newAccount}
        </button>
      </div>
    </header>
  )
}
