import { Search } from 'lucide-react'
import type { ChangeEventHandler } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

import type {
  GetAccountResponseDto,
  GetUserInfoResponseDto,
} from '@/shared/api/types'
import type { TranslationFunction } from '../types'
import { getInitials, getUserName } from '../utils'
import { AccountPicker } from './AccountPicker'
import { Field } from './Field'
import styles from '../styles.module.css'

export function RecipientFields({
  activeRecipientAccounts,
  emailError,
  isLookingUpRecipient,
  isRecipientMenuOpen,
  onEmailChange,
  onRecipientAccountSelect,
  onRecipientMenuToggle,
  onSearchRecipient,
  recipient,
  recipientAccount,
  recipientAccountError,
  recipientAccountId,
  recipientEmailField,
  t,
}: {
  activeRecipientAccounts: GetAccountResponseDto[]
  emailError?: FieldError
  isLookingUpRecipient: boolean
  isRecipientMenuOpen: boolean
  onEmailChange: ChangeEventHandler<HTMLInputElement>
  onRecipientAccountSelect: (accountId: string) => void
  onRecipientMenuToggle: () => void
  onSearchRecipient: () => void
  recipient?: GetUserInfoResponseDto
  recipientAccount?: GetAccountResponseDto
  recipientAccountError?: FieldError
  recipientAccountId: string
  recipientEmailField: UseFormRegisterReturn<'email'>
  t: TranslationFunction
}) {
  return (
    <>
      <Field label={t('emailAddress')}>
        <div className={styles['transfer-panel__email-row']}>
          <input
            {...recipientEmailField}
            aria-invalid={Boolean(emailError)}
            className={styles['transfer-panel__email-input']}
            onChange={onEmailChange}
            placeholder="name@example.com"
            type="email"
          />
          <button
            className={styles['transfer-panel__search-button']}
            disabled={isLookingUpRecipient}
            onClick={onSearchRecipient}
            type="button"
          >
            <Search className={styles['transfer-panel__search-icon']} />
            {isLookingUpRecipient ? t('searching') : t('search')}
          </button>
        </div>
        {emailError?.message ? (
          <p className={styles['transfer-panel__error']}>
            {emailError.message}
          </p>
        ) : null}
      </Field>

      {recipient ? <RecipientSummary recipient={recipient} /> : null}

      {recipient ? (
        <Field label={t('recipientAccount')}>
          <AccountPicker
            accounts={activeRecipientAccounts}
            emptyLabel={t('noActiveRecipientAccounts')}
            isOpen={isRecipientMenuOpen}
            onOpenChange={onRecipientMenuToggle}
            onSelect={onRecipientAccountSelect}
            selectedAccount={recipientAccount}
            selectedAccountId={recipientAccountId}
            t={t}
          />
          {activeRecipientAccounts.length === 0 ? (
            <p className={styles['transfer-panel__hint']}>
              {t('noActiveRecipientAccounts')}
            </p>
          ) : null}
          {recipientAccountError?.message ? (
            <p className={styles['transfer-panel__error']}>
              {recipientAccountError.message}
            </p>
          ) : null}
        </Field>
      ) : null}
    </>
  )
}

function RecipientSummary({
  recipient,
}: {
  recipient: GetUserInfoResponseDto
}) {
  return (
    <div className={styles['transfer-panel__recipient']}>
      <span className={styles['transfer-panel__recipient-avatar']}>
        {getInitials(recipient)}
      </span>
      <div>
        <p className={styles['transfer-panel__recipient-name']}>
          {getUserName(recipient)}
        </p>
        <p className={styles['transfer-panel__recipient-email']}>
          {recipient.email}
        </p>
      </div>
    </div>
  )
}
