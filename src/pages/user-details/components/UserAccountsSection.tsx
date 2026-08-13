import { Landmark, Lock } from 'lucide-react'

import {
  AccountStatus,
  type CardStatus as CardStatusValue,
} from '@/shared/api/enums'
import type {
  GetAccountWithCardsResponseDto,
  GetCardByAccountIdResponseDto,
} from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import { formatMoney } from '@/lib/formatMoney'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import styles from '../styles.module.css'
import { UserCardItem } from './UserCardItem'

export function UserAccountsSection({
  accounts,
  isUpdatingAccount,
  isUpdatingCard,
  isLoading,
  onFreezeAccount,
  onUnfreezeAccount,
  onUpdateCardStatus,
}: {
  accounts?: GetAccountWithCardsResponseDto[]
  isUpdatingAccount: boolean
  isUpdatingCard: boolean
  isLoading: boolean
  onFreezeAccount: (accountId: string) => void
  onUnfreezeAccount: (accountId: string) => void
  onUpdateCardStatus: (
    card: GetCardByAccountIdResponseDto,
    status: CardStatusValue,
  ) => void
}) {
  const { t } = useI18n()

  return (
    <section className={styles['user-details__section']}>
      <div className={styles['user-details__section-heading']}>
        <Landmark />
        <h2>{t('accounts')}</h2>
      </div>
      {isLoading ? (
        <p className={styles['user-details__empty']}>{t('checking')}</p>
      ) : accounts?.length ? (
        <div className={styles['user-details__accounts']}>
          {accounts.map(({ account, cards }) => {
            const accountId = account?.accountId
            const isAccountFrozen = account?.status === AccountStatus.FROZEN

            return (
              <article
                className={styles['user-details__account']}
                key={accountId}
              >
                <header className={styles['user-details__account-header']}>
                  <div>
                    <strong>{account?.type ?? t('dataUnavailable')}</strong>
                    <span>
                      {account?.accountNumber ?? t('dataUnavailable')}
                    </span>
                  </div>
                  <button
                    className={styles['user-details__freeze']}
                    disabled={!accountId || isUpdatingAccount}
                    onClick={() =>
                      accountId &&
                      (isAccountFrozen
                        ? onUnfreezeAccount(accountId)
                        : onFreezeAccount(accountId))
                    }
                    type="button"
                  >
                    <Lock /> {isAccountFrozen ? t('unfreeze') : t('freeze')}
                  </button>
                </header>
                <p className={styles['user-details__balance']}>
                  {formatMoney(getAvailableFunds(account), account?.currency)}
                </p>
                <div className={styles['user-details__cards']}>
                  {cards?.length ? (
                    cards.map((card) => (
                      <UserCardItem
                        accountStatus={account?.status}
                        card={card}
                        currency={account?.currency}
                        isUpdating={isUpdatingCard}
                        key={card.cardId}
                        onUpdateStatus={onUpdateCardStatus}
                      />
                    ))
                  ) : (
                    <p className={styles['user-details__empty']}>
                      {t('dataUnavailable')}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className={styles['user-details__empty']}>{t('dataUnavailable')}</p>
      )}
    </section>
  )
}
