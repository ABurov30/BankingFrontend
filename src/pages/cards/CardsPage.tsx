import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectCards } from '@/features/cards/cardsSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { useLazyGetAccountsWithCardsByOwnerIdQuery } from '@/shared/api/accountApi'
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
  CardsList,
  CardsPageHeader,
  IssueCardDialog,
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
  const [loadAccounts, { isFetching }] =
    useLazyGetAccountsWithCardsByOwnerIdQuery()

  useEffect(() => {
    if (user?.userProfileId) {
      void loadAccounts(user.userProfileId)
    }
  }, [loadAccounts, user?.userProfileId])
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
    if (!card?.cardId || !card.accountId) {
      return
    }

    try {
      await updateCard({
        accountId: card.accountId,
        cardId: card.cardId,
        dailyLimit: card.dailyLimit ?? 0,
        monthlyLimit: card.monthlyLimit ?? 0,
        status,
      }).unwrap()
      if (status === CardStatus.BLOCKED) {
        dispatch(
          showToast({
            message: t('cardSettingsUpdated'),
            variant: 'success',
          }),
        )
      }
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
          <CardsPageHeader
            isCreatingCard={isCreatingCard}
            labels={{
              cards: t('cards'),
              issueCard: t('issueCard'),
              issuing: t('issuing'),
            }}
            onCreateCard={handleCreateCard}
            onStatusFilterChange={setStatusFilter}
            statusFilter={statusFilter}
            statusFilters={cardStatusFilters}
          />

          {isIssueCardDialogOpen ? (
            <IssueCardDialog
              accounts={issueableAccounts}
              isCreatingCard={isCreatingCard}
              onClose={() => setIsIssueCardDialogOpen(false)}
              onSubmit={({ accountId }) => handleIssueCard(accountId)}
            />
          ) : null}

          <CardsList
            cards={visibleCards}
            emptyLabel={
              cards.length > 0 ? t('noCardsMatchStatus') : t('noCardData')
            }
            isLoading={isInitialLoading}
            onUpdateStatus={handleUpdateCardStatus}
          />
        </div>
      </div>
    </section>
  )
}

export default CardsPage
