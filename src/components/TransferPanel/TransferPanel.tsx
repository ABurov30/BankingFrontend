import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { useAppDispatch } from '@/app/hooks'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { useI18n } from '@/shared/i18n/useI18n'
import { TransferForm } from './TransferForm'
import styles from './drawer.module.css'

export function TransferPanel() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (document.querySelector('[data-transfer-confirmation]')) return
        dispatch(closeRightPanel())
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [dispatch])

  return createPortal(
    <div className={styles['transfer-panel-drawer__overlay']}>
      <button
        aria-label={t('closeTransferPanel')}
        className={styles['transfer-panel-drawer__backdrop']}
        onClick={() => dispatch(closeRightPanel())}
        type="button"
      />
      <aside
        aria-label={`${t('transfer')} panel`}
        aria-modal="true"
        className={styles['transfer-panel-drawer']}
        role="dialog"
      >
        <TransferForm />
      </aside>
    </div>,
    document.body,
  )
}
