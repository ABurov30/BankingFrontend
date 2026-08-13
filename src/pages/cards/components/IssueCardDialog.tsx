import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'

import { formatMoney } from '@/lib/formatMoney'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import { cn } from '@/lib/utils'
import { AccountCurrency } from '@/shared/api/enums'
import type { GetAccountWithCardsResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

export type IssueCardFormValues = {
  accountId: string
}

function getAccountLabel({ account }: GetAccountWithCardsResponseDto) {
  const type = account?.type ?? 'ACCOUNT'
  const currency = account?.currency ?? AccountCurrency.USD
  const number = account?.accountNumber
    ? `•• ${account.accountNumber.slice(-4)}`
    : 'number pending'

  return `${type} · ${currency} · ${number}`
}

export function IssueCardDialog({
  accounts,
  isCreatingCard,
  onClose,
  onSubmit,
}: {
  accounts: GetAccountWithCardsResponseDto[]
  isCreatingCard: boolean
  onClose: () => void
  onSubmit: (values: IssueCardFormValues) => void
}) {
  const { t } = useI18n()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const { handleSubmit, register, setValue, watch } =
    useForm<IssueCardFormValues>({
      defaultValues: {
        accountId: accounts[0]?.account?.accountId ?? '',
      },
    })
  const selectedAccountId = watch('accountId')
  const selectedAccount =
    accounts.find((item) => item.account?.accountId === selectedAccountId) ??
    accounts[0]

  const selectAccount = (accountId: string) => {
    setValue('accountId', accountId, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setIsAccountMenuOpen(false)
  }

  return createPortal(
    <div className={styles['cards__issue-backdrop']}>
      <form
        className={`${styles['cards__issue-dialog']} ui-lift`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" {...register('accountId', { required: true })} />

        <header className={styles['cards__issue-header']}>
          <div>
            <h2 className={styles['cards__issue-title']}>{t('issueCard')}</h2>
            <p className={styles['cards__issue-subtitle']}>
              {t('selectAccountForCard')}
            </p>
          </div>
          <button
            aria-label={t('closeCardIssueForm')}
            className={styles['cards__issue-close']}
            onClick={onClose}
            type="button"
          >
            <X className={styles['cards__issue-icon']} />
          </button>
        </header>

        <div className={styles['cards__issue-field']}>
          <span className={styles['cards__issue-label']}>{t('account')}</span>
          <div className={styles['cards__issue-dropdown']}>
            <button
              aria-expanded={isAccountMenuOpen}
              className={styles['cards__issue-dropdown-trigger']}
              onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span>
                {selectedAccount
                  ? getAccountLabel(selectedAccount)
                  : t('selectAccount')}
              </span>
              <ChevronDown className={styles['cards__issue-icon']} />
            </button>

            {isAccountMenuOpen ? (
              <div
                className={styles['cards__issue-dropdown-menu']}
                role="listbox"
              >
                {accounts.map((item) => {
                  const accountId = item.account?.accountId

                  if (!accountId) {
                    return null
                  }

                  return (
                    <button
                      aria-selected={accountId === selectedAccountId}
                      className={cn(
                        styles['cards__issue-dropdown-option'],
                        accountId === selectedAccountId &&
                          styles['cards__issue-dropdown-option--active'],
                      )}
                      key={accountId}
                      onClick={() => selectAccount(accountId)}
                      role="option"
                      type="button"
                    >
                      <span>{getAccountLabel(item)}</span>
                      <span className={styles['cards__issue-option-meta']}>
                        {formatMoney(
                          getAvailableFunds(item.account),
                          item.account?.currency ?? AccountCurrency.USD,
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles['cards__issue-actions']}>
          <button
            className={styles['cards__issue-secondary']}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['cards__issue-primary']}
            disabled={isCreatingCard || !selectedAccountId}
            type="submit"
          >
            {isCreatingCard ? t('issuing') : t('issueCard')}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
