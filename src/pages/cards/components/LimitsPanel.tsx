import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import {
  getCardDailyLimit,
  getCardMonthlyLimit,
  getCardSpendDailyLimit,
  getCardSpendMonthlyLimit,
} from '@/lib/cardLimits'
import { parseMoneyAmountInput } from '@/lib/moneyAmount'
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
  getLimitInputValue,
  getLimitValue,
  LimitActions,
  LimitItem,
  type LimitsFormValues,
} from './limits'
import { formatMoney } from './utils'

function getEditedLimitValue(value: string, fallbackAmount?: number) {
  return (
    parseMoneyAmountInput(value, { allowZero: true })?.amount ??
    getLimitValue(fallbackAmount)
  )
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
  const currency = account?.account?.currency ?? AccountCurrency.USD
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<LimitsFormValues>({
    defaultValues: {
      dailyLimit: getLimitInputValue(getCardDailyLimit(card)),
      monthlyLimit: getLimitInputValue(getCardMonthlyLimit(card)),
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
        isEditingLimits
          ? getEditedLimitValue(dailyLimit, getCardDailyLimit(card))
          : getLimitValue(getCardDailyLimit(card)),
        currency,
      ),
      width: getLimitUsageWidth(
        getCardSpendDailyLimit(card),
        getCardDailyLimit(card),
      ),
    },
    {
      colorClassName: styles['cards__card--secondary'],
      error: errors.monthlyLimit,
      fieldName: 'monthlyLimit' as const,
      label: t('monthlyLimit'),
      value: formatMoney(
        isEditingLimits
          ? getEditedLimitValue(monthlyLimit, getCardMonthlyLimit(card))
          : getLimitValue(getCardMonthlyLimit(card)),
        currency,
      ),
      width: getLimitUsageWidth(
        getCardSpendMonthlyLimit(card),
        getCardMonthlyLimit(card),
      ),
    },
  ]

  useEffect(() => {
    reset({
      dailyLimit: getLimitInputValue(getCardDailyLimit(card)),
      monthlyLimit: getLimitInputValue(getCardMonthlyLimit(card)),
    })
  }, [card, reset])

  const handleSaveLimits = async (values: LimitsFormValues) => {
    if (!card?.cardId || !card.accountId) {
      return
    }

    const dailyLimit = parseMoneyAmountInput(values.dailyLimit, {
      allowZero: true,
    })
    const monthlyLimit = parseMoneyAmountInput(values.monthlyLimit, {
      allowZero: true,
    })

    if (!dailyLimit) {
      setError('dailyLimit', { message: t('enterValidAmount') })
      return
    }

    if (!monthlyLimit) {
      setError('monthlyLimit', { message: t('enterValidAmount') })
      return
    }

    try {
      await updateCard({
        accountId: card.accountId,
        cardId: card.cardId,
        dailyLimitMinorUnits: dailyLimit.minorUnits,
        monthlyLimitMinorUnits: monthlyLimit.minorUnits,
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
              dailyLimit: getLimitInputValue(getCardDailyLimit(card)),
              monthlyLimit: getLimitInputValue(getCardMonthlyLimit(card)),
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
