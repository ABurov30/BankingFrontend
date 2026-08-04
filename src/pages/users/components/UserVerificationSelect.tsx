import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export function UserVerificationSelect({
  disabled,
  isPending,
  onVerify,
}: {
  disabled: boolean
  isPending: boolean
  onVerify: () => Promise<void>
}) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [isOptimisticallyVerified, setIsOptimisticallyVerified] =
    useState(false)
  const pending = isPending && !isOptimisticallyVerified

  useEffect(() => {
    if (!isPending) setIsOptimisticallyVerified(false)
  }, [isPending])

  const verify = () => {
    setIsOpen(false)
    setIsOptimisticallyVerified(true)
    void onVerify().catch(() => undefined)
  }

  return (
    <div className={styles['users__status-select']}>
      <button
        aria-expanded={isOpen}
        className={cn(
          styles['users__status-trigger'],
          pending && styles['users__status-trigger--pending'],
        )}
        disabled={disabled || !pending}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {pending ? t('pending') : t('verified')}
        {pending ? (
          <ChevronDown className={styles['users__status-chevron']} />
        ) : null}
      </button>
      {isOpen ? (
        <div className={styles['users__status-menu']} role="listbox">
          <button
            className={styles['users__status-option']}
            onClick={verify}
            role="option"
            type="button"
          >
            {t('verified')}
            <Check />
          </button>
        </div>
      ) : null}
    </div>
  )
}
