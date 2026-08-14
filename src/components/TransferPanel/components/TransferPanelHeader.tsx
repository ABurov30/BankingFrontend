import { ArrowLeft, X } from 'lucide-react'

import styles from '../styles.module.css'

export function TransferPanelHeader({
  backLabel,
  canGoBack,
  closeLabel,
  onBack,
  onClose,
  title,
}: {
  backLabel: string
  canGoBack: boolean
  closeLabel: string
  onBack: () => void
  onClose: () => void
  title: string
}) {
  return (
    <header className={styles['transfer-panel__header']}>
      <div className={styles['transfer-panel__header-start']}>
        {canGoBack ? (
          <button
            aria-label={backLabel}
            className={styles['transfer-panel__back-button']}
            onClick={onBack}
            type="button"
          >
            <ArrowLeft />
          </button>
        ) : null}
        <h2 className={styles['transfer-panel__title']}>{title}</h2>
      </div>
      <button
        aria-label={closeLabel}
        className={styles['transfer-panel__close-button']}
        onClick={onClose}
        type="button"
      >
        <X className={styles['transfer-panel__close-icon']} />
      </button>
    </header>
  )
}
