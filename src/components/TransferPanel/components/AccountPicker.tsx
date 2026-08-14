import { ChevronDown, Landmark } from 'lucide-react'

import { Skeleton } from '@/components/Skeleton'
import { formatMoney } from '@/lib/formatMoney'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import { AccountCurrency } from '@/shared/api/enums'
import type { GetAccountResponseDto } from '@/shared/api/types'
import type { TranslationFunction } from '../types'
import styles from '../styles.module.css'

type AccountPickerMetaVariant = 'balance' | 'currency'

export function AccountPicker({
  accounts,
  disabled = false,
  emptyLabel,
  isLoading = false,
  isOpen,
  metaVariant = 'balance',
  onOpenChange,
  onSelect,
  selectedAccount,
  selectedAccountId,
  t,
}: {
  accounts: GetAccountResponseDto[]
  disabled?: boolean
  emptyLabel: string
  isLoading?: boolean
  isOpen: boolean
  metaVariant?: AccountPickerMetaVariant
  onOpenChange: () => void
  onSelect: (accountId: string) => void
  selectedAccount?: GetAccountResponseDto
  selectedAccountId: string
  t: TranslationFunction
}) {
  return (
    <div className={styles['transfer-panel__account-picker']}>
      <button
        aria-expanded={isOpen}
        className={styles['transfer-panel__account-select']}
        disabled={disabled}
        onClick={onOpenChange}
        type="button"
      >
        <AccountSummary
          account={selectedAccount}
          emptyLabel={emptyLabel}
          isLoading={isLoading}
          metaVariant={metaVariant}
          t={t}
        />
        <ChevronDown className={styles['transfer-panel__chevron']} />
      </button>

      {isOpen ? (
        <div className={styles['transfer-panel__account-menu']} role="listbox">
          {accounts.map((account) => (
            <button
              aria-selected={account.accountId === selectedAccountId}
              className={styles['transfer-panel__account-option']}
              key={account.accountId}
              onClick={() => account.accountId && onSelect(account.accountId)}
              role="option"
              type="button"
            >
              <AccountSummary
                account={account}
                emptyLabel={emptyLabel}
                metaVariant={metaVariant}
                t={t}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AccountSummary({
  account,
  emptyLabel,
  isLoading = false,
  metaVariant,
  t,
}: {
  account?: GetAccountResponseDto
  emptyLabel: string
  isLoading?: boolean
  metaVariant: AccountPickerMetaVariant
  t: TranslationFunction
}) {
  const availableFunds = getAvailableFunds(account)

  return (
    <div className={styles['transfer-panel__account-summary']}>
      <span className={styles['transfer-panel__account-icon']}>
        <Landmark className={styles['transfer-panel__icon']} />
      </span>
      <div>
        {isLoading ? (
          <>
            <Skeleton height={16} width={150} />
            <Skeleton height={13} width={110} />
          </>
        ) : (
          <>
            <p className={styles['transfer-panel__account-name']}>
              {account?.accountNumber ?? emptyLabel}
            </p>
            <p className={styles['transfer-panel__account-meta']}>
              {metaVariant === 'currency'
                ? `${t('currency')}: ${account?.currency ?? '--'}`
                : availableFunds == null
                  ? t('balanceUnavailable')
                  : formatMoney(
                      availableFunds,
                      account?.currency ?? AccountCurrency.USD,
                    )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
