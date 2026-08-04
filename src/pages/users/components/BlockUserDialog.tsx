import { Ban, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { useI18n } from '@/shared/i18n/useI18n'
import type { ManagedUser } from './types'
import styles from '../styles.module.css'

export function BlockUserDialog({
  isBlocking,
  onClose,
  onConfirm,
  user,
}: {
  isBlocking: boolean
  onClose: () => void
  onConfirm: () => void
  user: ManagedUser
}) {
  const { t } = useI18n()
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')

  return createPortal(
    <div className={styles['users__dialog-backdrop']} role="presentation">
      <section
        aria-labelledby="block-user-title"
        aria-modal="true"
        className={styles['users__dialog']}
        role="dialog"
      >
        <button
          aria-label={t('closeDialog')}
          className={styles['users__dialog-close']}
          disabled={isBlocking}
          onClick={onClose}
          type="button"
        >
          <X />
        </button>
        <span className={styles['users__dialog-icon']}>
          <Ban />
        </span>
        <h2 id="block-user-title" className={styles['users__dialog-title']}>
          {t('blockUserQuestion', {
            name: fullName || user.email || t('user'),
          })}
        </h2>
        <p className={styles['users__dialog-text']}>
          {t('blockUserDescription')}
        </p>
        <code className={styles['users__dialog-endpoint']}>
          PUT /auth/manager/block-user
        </code>
        <div className={styles['users__dialog-actions']}>
          <button
            className={styles['users__dialog-cancel']}
            disabled={isBlocking}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['users__dialog-confirm']}
            disabled={isBlocking}
            onClick={onConfirm}
            type="button"
          >
            {isBlocking ? t('blockingUser') : t('blockUser')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
