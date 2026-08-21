import { Client } from '@stomp/stompjs'
import { Radio, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { formatMoney } from '@/lib/formatMoney'
import { minorUnitsToAmount } from '@/lib/moneyAmount'
import type { TransactionResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

const brokerURL =
  import.meta.env.VITE_TRANSACTIONS_WS_URL ??
  import.meta.env.VITE_NOTIFICATIONS_WS_URL ??
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/ws`

export function TransactionStatusDialog({
  onClose,
  transaction,
}: {
  onClose: () => void
  transaction: TransactionResponseDto
}) {
  const { t } = useI18n()
  const [liveTransaction, setLiveTransaction] = useState(transaction)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!transaction.transactionId) {
      return
    }

    setLiveTransaction(transaction)

    const client = new Client({
      brokerURL,
      connectionTimeout: 10_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      reconnectDelay: 5_000,
      onConnect: () => {
        client.subscribe(
          `/user/queue/transactions/${transaction.transactionId}`,
          (message) => {
            setLiveTransaction((current) => ({
              ...current,
              ...parseTransactionStatusMessage(message.body),
            }))
          },
        )
      },
    })

    client.activate()

    return () => {
      void client.deactivate()
    }
  }, [transaction])

  return createPortal(
    <div className={styles['transactions__dialog-backdrop']}>
      <section
        aria-labelledby="transaction-status-title"
        aria-modal="true"
        className={`${styles['transactions__dialog']} ui-lift`}
        role="dialog"
      >
        <header className={styles['transactions__dialog-header']}>
          <span className={styles['transactions__dialog-icon']}>
            <Radio />
          </span>
          <div className={styles['transactions__dialog-heading']}>
            <h2
              className={styles['transactions__dialog-title']}
              id="transaction-status-title"
            >
              {t('trackTransaction')}
            </h2>
            <p className={styles['transactions__dialog-subtitle']}>
              {transaction.transactionId ?? t('dataUnavailable')}
            </p>
          </div>
          <button
            aria-label={t('closeDialog')}
            className={styles['transactions__dialog-close']}
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </header>

        <div className={styles['transactions__dialog-grid']}>
          <div>
            <span className={styles['transactions__dialog-label']}>
              {t('status')}
            </span>
            <strong className={styles['transactions__dialog-value']}>
              {formatTransactionStatus(liveTransaction.status)}
            </strong>
          </div>
          <div>
            <span className={styles['transactions__dialog-label']}>
              {t('amount')}
            </span>
            <strong className={styles['transactions__dialog-value']}>
              {formatMoney(
                minorUnitsToAmount(liveTransaction.minorUnits),
                liveTransaction.currency,
              )}
            </strong>
          </div>
          <div>
            <span className={styles['transactions__dialog-label']}>
              {t('source')}
            </span>
            <strong className={styles['transactions__dialog-value']}>
              {getAccountNumber(liveTransaction.sourceAccount)}
            </strong>
          </div>
          <div>
            <span className={styles['transactions__dialog-label']}>
              {t('toAccount')}
            </span>
            <strong className={styles['transactions__dialog-value']}>
              {getAccountNumber(liveTransaction.targetAccount)}
            </strong>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}

function parseTransactionStatusMessage(body: string) {
  try {
    const payload = JSON.parse(body) as Partial<TransactionResponseDto>

    if (payload && typeof payload === 'object') {
      return payload
    }
  } catch {
    return {}
  }

  return {}
}

function getAccountNumber(
  transactionAccount?: TransactionResponseDto['sourceAccount'],
) {
  return transactionAccount?.accountNumber ?? '-'
}

function formatTransactionStatus(status?: TransactionResponseDto['status']) {
  return status?.replaceAll('_', ' ') ?? '-'
}
