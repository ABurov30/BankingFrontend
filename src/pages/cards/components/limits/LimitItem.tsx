import type { FieldError, UseFormRegister } from 'react-hook-form'

import { cn } from '@/lib/utils'
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
  currency: string
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
  return (
    <div className={styles['cards__main']}>
      <div className={styles['cards__limit-row']}>
        <span className={styles['cards__limit-label']}>{label}</span>
        <span className={styles['cards__limit-value']}>{value}</span>
      </div>
      {isEditing ? (
        <>
          <label className={styles['cards__limit-field']}>
            <span className={styles['cards__limit-currency']}>{currency}</span>
            <input
              className={styles['cards__limit-input']}
              disabled={disabled}
              min="0"
              step="0.01"
              type="number"
              {...register(fieldName, {
                min: {
                  message: t('limitCannotBeNegative'),
                  value: 0,
                },
                required: t('limitRequired'),
                valueAsNumber: true,
                validate: (value) =>
                  Number.isFinite(value) || t('enterValidAmount'),
              })}
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
