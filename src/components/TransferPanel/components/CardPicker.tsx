import { ChevronDown, CreditCard } from 'lucide-react'

import { getCardDailyLimit, getCardMonthlyLimit } from '@/lib/cardLimits'
import { formatMoney } from '@/lib/formatMoney'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import { AccountCurrency } from '@/shared/api/enums'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import type { TransferSourceCardOption, TranslationFunction } from '../types'
import styles from '../styles.module.css'

export function CardPicker({
  disabled = false,
  emptyLabel,
  isOpen,
  onOpenChange,
  onSelect,
  options,
  selectedOption,
  selectedCardId,
  t,
}: {
  disabled?: boolean
  emptyLabel: string
  isOpen: boolean
  onOpenChange: () => void
  onSelect: (cardId: string) => void
  options: TransferSourceCardOption[]
  selectedOption?: TransferSourceCardOption
  selectedCardId: string
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
        <CardSummary option={selectedOption} emptyLabel={emptyLabel} t={t} />
        <ChevronDown className={styles['transfer-panel__chevron']} />
      </button>

      {isOpen ? (
        <div className={styles['transfer-panel__account-menu']} role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option.card.cardId === selectedCardId}
              className={styles['transfer-panel__account-option']}
              key={option.card.cardId}
              onClick={() => option.card.cardId && onSelect(option.card.cardId)}
              role="option"
              type="button"
            >
              <CardSummary option={option} emptyLabel={emptyLabel} t={t} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CardSummary({
  emptyLabel,
  option,
  t,
}: {
  emptyLabel: string
  option?: TransferSourceCardOption
  t: TranslationFunction
}) {
  const account = option?.account
  const card = option?.card
  const availableFunds = getAvailableFunds(account)
  const currency = account?.currency ?? AccountCurrency.USD

  return (
    <div className={styles['transfer-panel__account-summary']}>
      <span className={styles['transfer-panel__account-icon']}>
        <CreditCard className={styles['transfer-panel__icon']} />
      </span>
      <div>
        <p className={styles['transfer-panel__account-name']}>
          {getCardLabel(card) ?? emptyLabel}
        </p>
        <p className={styles['transfer-panel__account-meta']}>
          {availableFunds == null
            ? t('balanceUnavailable')
            : `${t('balance')}: ${formatMoney(availableFunds, currency)}`}
        </p>
        {card ? (
          <p className={styles['transfer-panel__account-meta']}>
            {t('dailyLimit')}{' '}
            {formatMoney(getCardDailyLimit(card), currency)}{' '}
            · {t('monthlyLimit')}{' '}
            {formatMoney(getCardMonthlyLimit(card), currency)}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function getCardLabel(card?: GetCardByAccountIdResponseDto) {
  if (!card) return undefined

  if (card.pan) {
    return `Buro card •• ${card.pan.slice(-4)}`
  }

  return card.cardId ? `Buro card · ${card.cardId.slice(0, 8)}` : undefined
}
