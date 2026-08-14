import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { useUpdateCardMutation } from '@/shared/api/cardApi'
import { AccountCurrency, CardStatus } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import {
  getLimitUsageWidth,
  getLimitValue,
  LimitActions,
  LimitItem,
  type LimitsFormValues,
} from './limits'
import { formatMoney } from './utils'

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
  const currency = account?.account?.currency ?? AccountCurrency.USD
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
      error: errors.dailyLimit,
      fieldName: 'dailyLimit' as const,
      label: t('dailyLimit'),
      value: formatMoney(
        isEditingLimits && Number.isFinite(dailyLimit)
          ? dailyLimit
          : getLimitValue(card?.dailyLimit),
        currency,
      ),
      width: getLimitUsageWidth(card?.spendDailyLimit, card?.dailyLimit),
    },
    {
      colorClassName: styles['cards__card--secondary'],
      error: errors.monthlyLimit,
      fieldName: 'monthlyLimit' as const,
      label: t('monthlyLimit'),
      value: formatMoney(
        isEditingLimits && Number.isFinite(monthlyLimit)
          ? monthlyLimit
          : getLimitValue(card?.monthlyLimit),
        currency,
      ),
      width: getLimitUsageWidth(card?.spendMonthlyLimit, card?.monthlyLimit),
    },
  ]

  useEffect(() => {
    reset({
      dailyLimit: getLimitValue(card?.dailyLimit),
      monthlyLimit: getLimitValue(card?.monthlyLimit),
    })
  }, [card?.dailyLimit, card?.monthlyLimit, reset])

  const handleSaveLimits = async (values: LimitsFormValues) => {
    if (!card?.cardId || !card.accountId) {
      return
    }

    try {
      await updateCard({
        accountId: card.accountId,
        cardId: card.cardId,
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        status: card.status ?? CardStatus.ACTIVE,
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
        {t('limits')} {card?.pan ? `- Buro card •• ${card.pan.slice(-4)}` : ''}
      </h2>

      <form
        className={styles['cards__limits-form']}
        onSubmit={handleSubmit(handleSaveLimits)}
      >
        <div className={styles['cards__limit-list']}>
          {limits.map(
            ({ colorClassName, error, fieldName, label, value, width }) => (
              <LimitItem
                colorClassName={colorClassName}
                currency={currency}
                disabled={!card || isUpdatingLimits}
                error={error}
                fieldName={fieldName}
                isEditing={isEditingLimits}
                key={label}
                label={label}
                register={register}
                t={t}
                value={value}
                width={width}
              />
            ),
          )}
        </div>

        <LimitActions
          hasCard={Boolean(card)}
          isDirty={isDirty}
          isEditing={isEditingLimits}
          isUpdating={isUpdatingLimits}
          onCancel={() => {
            reset({
              dailyLimit: getLimitValue(card?.dailyLimit),
              monthlyLimit: getLimitValue(card?.monthlyLimit),
            })
            setIsEditingLimits(false)
          }}
          onEdit={() => setIsEditingLimits(true)}
          t={t}
        />
      </form>
    </section>
  )
}
