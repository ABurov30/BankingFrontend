import type { ChangeEventHandler } from 'react'
import type { FieldError, UseFormRegister } from 'react-hook-form'

import { formatCurrencySymbol } from '@/lib/formatMoney'
import { formatMinorUnitInput, parseMoneyAmountInput } from '@/lib/moneyAmount'
import { cn } from '@/lib/utils'
import type { AccountCurrency } from '@/shared/api/enums'
import type { LimitsFormValues, LimitsTranslationFunction } from './types'
import styles from '../../styles.module.css'

export function LimitItem({
  colorClassName,
  currency,
  disabled,
  error,
  fieldName,
  isEditing,
  label,
  register,
  t,
  value,
  width,
}: {
  colorClassName: string
  currency: AccountCurrency
  disabled: boolean
  error?: FieldError
  fieldName: keyof LimitsFormValues
  isEditing: boolean
  label: string
  register: UseFormRegister<LimitsFormValues>
  t: LimitsTranslationFunction
  value: string
  width: string
}) {
  const limitField = register(fieldName, {
    required: t('limitRequired'),
    validate: (value) =>
      parseMoneyAmountInput(value, { allowZero: true })
        ? true
        : t('enterValidAmount'),
  })

  const handleLimitChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.target.value = formatMinorUnitInput(event.target.value)
    void limitField.onChange(event)

    requestAnimationFrame(() => {
      const cursorPosition = event.target.value.length
      event.target.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  return (
    <div className={styles['cards__main']}>
      <div className={styles['cards__limit-row']}>
        <span className={styles['cards__limit-label']}>{label}</span>
        <span className={styles['cards__limit-value']}>{value}</span>
      </div>
      {isEditing ? (
        <>
          <label className={styles['cards__limit-field']}>
            <span className={styles['cards__limit-currency']}>
              {formatCurrencySymbol(currency)}
            </span>
            <input
              className={styles['cards__limit-input']}
              disabled={disabled}
              inputMode="numeric"
              pattern="[0-9]+[.][0-9]{2}"
              placeholder="0.00"
              type="text"
              {...limitField}
              onChange={handleLimitChange}
            />
          </label>
          {error?.message ? (
            <p className={styles['cards__limit-error']}>{error.message}</p>
          ) : null}
        </>
      ) : null}
      <div className={styles['cards__limit-track']}>
        <div
          className={cn(styles['cards__limit-fill'], colorClassName)}
          style={{ width }}
        />
      </div>
    </div>
  )
}
