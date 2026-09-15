import type { ChangeEventHandler } from 'react'
import type { FieldError, UseFormRegister } from 'react-hook-form'

import { formatCurrencySymbol } from '@/lib/formatMoney'
import {
  formatMinorUnitInput,
  getMoneyAmountInputPattern,
  getMoneyAmountInputPlaceholder,
  parseMoneyAmountInput,
} from '@/lib/moneyAmount'
import type { GetAccountResponseDto } from '@/shared/api/types'
import { AccountCurrency } from '@/shared/api/enums'
import type { TransferFormValues, TranslationFunction } from '../types'
import { Field } from './Field'
import styles from '../styles.module.css'

export function AmountField({
  amountError,
  register,
  sourceAccount,
  t,
}: {
  amountError?: FieldError
  register: UseFormRegister<TransferFormValues>
  sourceAccount?: GetAccountResponseDto
  t: TranslationFunction
}) {
  const currency = sourceAccount?.currency ?? AccountCurrency.USD
  const amountField = register('amount', {
    required: t('enterValidAmount'),
    validate: (value) =>
      parseMoneyAmountInput(value, {
        currency,
      })
        ? true
        : t('enterValidAmount'),
  })

  const handleAmountChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.target.value = formatMinorUnitInput(event.target.value, currency)
    void amountField.onChange(event)

    requestAnimationFrame(() => {
      const cursorPosition = event.target.value.length
      event.target.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  return (
    <Field label={t('amount')}>
      <div className={styles['transfer-panel__amount-card']}>
        <div className={styles['transfer-panel__amount-row']}>
          <input
            data-testid="transfer-amount"
            aria-invalid={Boolean(amountError)}
            aria-label={t('amount')}
            className={styles['transfer-panel__amount-input']}
            inputMode="numeric"
            pattern={getMoneyAmountInputPattern(currency)}
            placeholder={getMoneyAmountInputPlaceholder(currency)}
            type="text"
            {...amountField}
            onChange={handleAmountChange}
          />
          <span className={styles['transfer-panel__currency-badge']}>
            {sourceAccount?.currency
              ? formatCurrencySymbol(sourceAccount.currency)
              : '--'}
          </span>
        </div>
      </div>
      {amountError?.message ? (
        <p
          data-testid="transfer-amount-error"
          className={styles['transfer-panel__error']}
        >
          {amountError.message}
        </p>
      ) : null}
    </Field>
  )
}
