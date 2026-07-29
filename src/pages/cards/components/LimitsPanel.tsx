import { Pencil, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { cn } from '@/lib/utils'
import { useUpdateCardMutation } from '@/shared/api/cardApi'
import { AccountCurrency } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { formatMoney } from './utils'

type LimitsFormValues = {
  dailyLimit: number
  monthlyLimit: number
}

function getLimitValue(value?: number) {
  return value ?? 0
}

export function LimitsPanel({
  account,
  card,
}: {
  account?: GetAccountWithCardsResponseDto
  card?: GetCardByAccountIdResponseDto
}) {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const [isEditingLimits, setIsEditingLimits] = useState(false)
  const [updateCard, { isLoading: isUpdatingLimits }] = useUpdateCardMutation()
  const currency = account?.account?.currency ?? AccountCurrency.RUB
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<LimitsFormValues>({
    defaultValues: {
      dailyLimit: getLimitValue(card?.dailyLimit),
      monthlyLimit: getLimitValue(card?.monthlyLimit),
    },
  })
  const dailyLimit = watch('dailyLimit')
  const monthlyLimit = watch('monthlyLimit')
  const limits = [
    {
      colorClassName: styles['cards__card--primary'],
      error: errors.dailyLimit?.message,
      fieldName: 'dailyLimit' as const,
      label: t('dailyLimit'),
      value: formatMoney(
        isEditingLimits && Number.isFinite(dailyLimit)
          ? dailyLimit
          : getLimitValue(card?.dailyLimit),
        currency,
      ),
      width: card?.dailyLimit ? '100%' : '0%',
    },
    {
      colorClassName: styles['cards__card--secondary'],
      error: errors.monthlyLimit?.message,
      fieldName: 'monthlyLimit' as const,
      label: t('monthlyLimit'),
      value: formatMoney(
        isEditingLimits && Number.isFinite(monthlyLimit)
          ? monthlyLimit
          : getLimitValue(card?.monthlyLimit),
        currency,
      ),
      width: card?.monthlyLimit ? '100%' : '0%',
    },
  ]

  useEffect(() => {
    reset({
      dailyLimit: getLimitValue(card?.dailyLimit),
      monthlyLimit: getLimitValue(card?.monthlyLimit),
    })
  }, [card?.dailyLimit, card?.monthlyLimit, reset])

  const handleSaveLimits = async (values: LimitsFormValues) => {
    if (!card?.cardId) {
      return
    }

    try {
      await updateCard({
        cardId: card.cardId,
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        status: card.status,
      }).unwrap()
      reset(values)
      setIsEditingLimits(false)
      dispatch(
        showToast({
          message: t('cardLimitsUpdated'),
          variant: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('limitUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <section className={`${styles['cards__limits-card']} ui-lift`}>
      <h2 className={styles['cards__section-title']}>
        {t('limits')}{' '}
        {card?.pan ? `- Buro card •• ${card.pan.slice(-4)}` : ''}
      </h2>

      <form
        className={styles['cards__limits-form']}
        onSubmit={handleSubmit(handleSaveLimits)}
      >
        <div className={styles['cards__limit-list']}>
          {limits.map(
            ({ colorClassName, error, fieldName, label, value, width }) => (
              <div className={styles['cards__main']} key={label}>
                <div className={styles['cards__limit-row']}>
                  <span className={styles['cards__limit-label']}>{label}</span>
                  <span className={styles['cards__limit-value']}>{value}</span>
                </div>
                {isEditingLimits ? (
                  <>
                    <label className={styles['cards__limit-field']}>
                      <span className={styles['cards__limit-currency']}>
                        {currency}
                      </span>
                      <input
                        className={styles['cards__limit-input']}
                        disabled={!card || isUpdatingLimits}
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
                    {error ? (
                      <p className={styles['cards__limit-error']}>{error}</p>
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
            ),
          )}
        </div>

        <div className={styles['cards__limits-actions']}>
          {isEditingLimits ? (
            <>
              <button
                className={styles['cards__limits-cancel']}
                disabled={isUpdatingLimits}
                onClick={() => {
                  reset({
                    dailyLimit: getLimitValue(card?.dailyLimit),
                    monthlyLimit: getLimitValue(card?.monthlyLimit),
                  })
                  setIsEditingLimits(false)
                }}
                type="button"
              >
                {t('cancel')}
              </button>
              <button
                className={styles['cards__limits-save']}
                disabled={!card || !isDirty || isUpdatingLimits}
                type="submit"
              >
                <Save className={styles['cards__limits-save-icon']} />
                {isUpdatingLimits ? t('saving') : t('saveLimits')}
              </button>
            </>
          ) : (
            <button
              className={styles['cards__limits-save']}
              disabled={!card}
              onClick={() => setIsEditingLimits(true)}
              type="button"
            >
              <Pencil className={styles['cards__limits-save-icon']} />
              {t('editLimits')}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
