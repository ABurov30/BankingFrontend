import { Plus } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectCards } from '@/features/cards/cardsSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { cn } from '@/lib/utils'
import { useGetAccountsWithCardsByOwnerIdQuery } from '@/shared/api/accountApi'
import {
  useCreateCardMutation,
  useUpdateCardMutation,
} from '@/shared/api/cardApi'
import {
  CardStatus,
  cardStatusOptions,
  type CardStatus as CardStatusValue,
} from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import {
  IssueCardDialog,
  LimitsPanel,
  PaymentCard,
  type EditableCardStatus,
} from './components'
import styles from './styles.module.css'

const cardStatusFilters: CardStatusValue[] = cardStatusOptions

function CardsPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const accounts = useAppSelector(selectAccounts)
  const cards = useAppSelector(selectCards)
  const { isFetching } = useGetAccountsWithCardsByOwnerIdQuery(
    user?.userProfileId ?? skipToken,
  )
  const [statusFilter, setStatusFilter] = useState<CardStatusValue>(
    CardStatus.ACTIVE,
  )
  const [isIssueCardDialogOpen, setIsIssueCardDialogOpen] = useState(false)
  const [createCard, { isLoading: isCreatingCard }] = useCreateCardMutation()
  const [updateCard] = useUpdateCardMutation()
  const issueableAccounts = accounts.filter((item) => item.account?.accountId)
  const visibleCards = cards.filter(({ card }) => {
    return (card.status ?? CardStatus.ACTIVE) === statusFilter
  })
  const isInitialLoading = isFetching && cards.length === 0

  const handleIssueCard = async (accountId: string) => {
    try {
      await createCard({ accountId }).unwrap()
      setIsIssueCardDialogOpen(false)
      dispatch(
        showToast({
          message: t('cardIssued'),
          variant: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('cardIssueFailed'),
          variant: 'error',
        }),
      )
    }
  }

  const handleCreateCard = () => {
    if (issueableAccounts.length === 0) {
      dispatch(
        showToast({
          message: t('createAccountBeforeCard'),
          title: t('cardIssueUnavailable'),
          variant: 'error',
        }),
      )
      return
    }

    if (issueableAccounts.length > 1) {
      setIsIssueCardDialogOpen(true)
      return
    }

    const accountId = issueableAccounts[0].account?.accountId

    if (accountId) {
      void handleIssueCard(accountId)
    }
  }

  const handleUpdateCardStatus = async (
    card: GetCardByAccountIdResponseDto | undefined,
    status: EditableCardStatus,
  ) => {
    if (!card?.cardId) {
      return
    }

    try {
      await updateCard({
        cardId: card.cardId,
        dailyLimit: card.dailyLimit,
        monthlyLimit: card.monthlyLimit,
        status,
      }).unwrap()
      dispatch(
        showToast({
          message: t('cardSettingsUpdated'),
          variant: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('cardUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <section className={`${styles['cards']} ui-enter`}>
      <div className={styles['cards__layout']}>
        <div className={styles['cards__main']}>
          <header className={styles['cards__stack']}>
            <h1 className={styles['cards__header']}>{t('cards')}</h1>

            <div className={styles['cards__header-actions']}>
              <div className={styles['cards__status-filters']}>
                {cardStatusFilters.map((filter) => (
                  <button
                    className={cn(
                      styles['cards__status-filter-button'],
                      filter === statusFilter &&
                        styles['cards__status-filter-button--active'],
                    )}
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                className={`${styles['cards__title']} ui-lift`}
                disabled={isCreatingCard}
                onClick={handleCreateCard}
                type="button"
              >
                <Plus className={styles['cards__add-button']} />
                {isCreatingCard ? t('issuing') : t('issueCard')}
              </button>
            </div>
          </header>

          {isIssueCardDialogOpen ? (
            <IssueCardDialog
              accounts={issueableAccounts}
              isCreatingCard={isCreatingCard}
              onClose={() => setIsIssueCardDialogOpen(false)}
              onSubmit={({ accountId }) => handleIssueCard(accountId)}
            />
          ) : null}

          <div className={styles['cards__button-icon']}>
            {isInitialLoading ? (
              Array.from({ length: 2 }, (_, index) => (
                <div className={styles['cards__card-group']} key={index}>
                  <Skeleton height={230} radius={20} />
                  <Skeleton height={220} radius={18} />
                </div>
              ))
            ) : visibleCards.length > 0 ? (
              visibleCards.map(({ account, card }, index) => (
                <div
                  className={styles['cards__card-group']}
                  key={card.cardId ?? `${card.accountId}-${index}`}
                >
                  <PaymentCard
                    account={account}
                    card={card}
                    onUpdateStatus={handleUpdateCardStatus}
                  />
                  <LimitsPanel account={account} card={card} />
                </div>
              ))
            ) : (
              <section className={`${styles['cards__limits-card']} ui-lift`}>
                <p className={styles['cards__card-subtitle']}>
                  {cards.length > 0
                    ? t('noCardsMatchStatus')
                    : t('noCardData')}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CardsPage
