import { ShieldCheck, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { formatMoney } from '@/lib/formatMoney'
import { AccountCurrency } from '@/shared/api/enums'
import type { TransferConfirmation, TranslationFunction } from '../types'
import { getUserName } from '../utils'
import styles from '../styles.module.css'

export function TransferConfirmationDialog({
  confirmation,
  isSubmitting,
  onClose,
  onConfirm,
  t,
}: {
  confirmation: TransferConfirmation
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  t: TranslationFunction
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const destinationAccountNumber =
    confirmation.destinationAccount.accountNumber ?? t('noAccountSelected')

  return createPortal(
    <div
      className={styles['transfer-panel__dialog-backdrop']}
      data-transfer-confirmation
      role="presentation"
    >
      <section
        aria-labelledby="transfer-confirmation-title"
        aria-modal="true"
        className={styles['transfer-panel__dialog']}
        role="dialog"
      >
        <button
          aria-label={t('closeDialog')}
          className={styles['transfer-panel__dialog-close']}
          onClick={onClose}
          type="button"
        >
          <X />
        </button>
        <span className={styles['transfer-panel__dialog-icon']}>
          <ShieldCheck />
        </span>
        <h2
          id="transfer-confirmation-title"
          className={styles['transfer-panel__dialog-title']}
        >
          {t('confirmTransfer')}
        </h2>
        <p className={styles['transfer-panel__dialog-copy']}>
          {t('transferConfirmationDescription')}
        </p>

        <div className={styles['transfer-panel__confirmation-details']}>
          <ConfirmationRow
            label={t('from')}
            value={
              confirmation.sourceAccount.accountNumber ?? t('noAccountSelected')
            }
          />
          <ConfirmationRow label={t('to')} value={destinationAccountNumber} />
          {confirmation.recipient ? (
            <ConfirmationRow
              label={t('recipient')}
              value={getUserName(confirmation.recipient)}
            />
          ) : null}
          <ConfirmationRow
            label={t('amount')}
            value={formatMoney(
              confirmation.amount,
              confirmation.sourceAccount.currency ?? AccountCurrency.USD,
            )}
          />
        </div>

        <div className={styles['transfer-panel__dialog-actions']}>
          <button
            className={styles['transfer-panel__dialog-cancel']}
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['transfer-panel__dialog-confirm']}
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? t('processing') : t('confirmTransfer')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles['transfer-panel__confirmation-row']}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
