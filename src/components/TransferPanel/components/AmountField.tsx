import type { FieldError, UseFormRegister } from 'react-hook-form'

import type { GetAccountResponseDto } from '@/shared/api/types'
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
  return (
    <Field label={t('amount')}>
      <div className={styles['transfer-panel__amount-card']}>
        <div className={styles['transfer-panel__amount-row']}>
          <input
            aria-invalid={Boolean(amountError)}
            aria-label={t('amount')}
            className={styles['transfer-panel__amount-input']}
            inputMode="decimal"
            min="0.01"
            placeholder="0"
            step="0.01"
            type="number"
            {...register('amount', {
              required: t('enterValidAmount'),
              validate: (value) => Number(value) > 0 || t('enterValidAmount'),
            })}
          />
          <span className={styles['transfer-panel__currency-badge']}>
            {sourceAccount?.currency ?? '--'}
          </span>
        </div>
      </div>
      {amountError?.message ? (
        <p className={styles['transfer-panel__error']}>{amountError.message}</p>
      ) : null}
    </Field>
  )
}
