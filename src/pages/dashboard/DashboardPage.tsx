import { skipToken } from '@reduxjs/toolkit/query'

import { useAppSelector } from '@/app/hooks'
import { DashboardBankCardVisual } from '@/components/BankCardVisual'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { selectCards } from '@/features/cards/cardsSlice'
import type { CardWithAccount } from '@/features/cards/cardsSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { useGetAccountsWithCardsByOwnerIdQuery } from '@/shared/api/accountApi'
import { AccountType } from '@/shared/api/enums'
import { Skeleton } from '@/components/Skeleton'
import {
  AccountsGrid,
  ActivityCard,
  BalanceHero,
  LimitsCard,
  NotificationsCard,
  SpendingCard,
  Topbar,
} from './components'
import styles from './styles.module.css'

function getCardLimitTotal(card: {
  dailyLimit?: number
  monthlyLimit?: number
}) {
  return (card.dailyLimit ?? 0) + (card.monthlyLimit ?? 0)
}

function getHighestLimitCard(cards: CardWithAccount[]) {
  return cards.reduce<CardWithAccount | null>((highestCard, currentCard) => {
    if (!highestCard) {
      return currentCard
    }

    return getCardLimitTotal(currentCard.card) >
      getCardLimitTotal(highestCard.card)
      ? currentCard
      : highestCard
  }, null)
}

function DashboardPage() {
  const user = useAppSelector(selectCurrentUser)
  const accounts = useAppSelector(selectAccounts)
  const cards = useAppSelector(selectCards)
  const { isFetching } = useGetAccountsWithCardsByOwnerIdQuery(
    user?.userProfileId ?? skipToken,
  )
  const isInitialCardsLoading = isFetching && cards.length === 0
  const highestDebitCard = getHighestLimitCard(
    cards.filter(({ account }) => {
      const accountType = account.account?.type
      return (
        accountType === AccountType.CHECKING ||
        accountType === AccountType.SAVINGS
      )
    }),
  )
  const highestCreditCard = getHighestLimitCard(
    cards.filter(({ account }) => account.account?.type === AccountType.CREDIT),
  )
  const highlightedCards = [highestDebitCard, highestCreditCard].filter(
    (item): item is CardWithAccount => item !== null,
  )
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')

  return (
    <section className={`${styles['dashboard']} ui-enter`}>
      <Topbar userName={userName} />

      <div className={styles['dashboard__layout']}>
        <div className={styles['dashboard__main']}>
          <BalanceHero accounts={accounts} isFetching={isFetching} />
          <AccountsGrid accounts={accounts} isLoading={isFetching} />
          <SpendingCard />
          <ActivityCard />
        </div>

        <aside className={styles['dashboard__aside']}>
          {isInitialCardsLoading
            ? Array.from({ length: 2 }, (_, index) => (
                <div className={styles['dashboard__card-stack']} key={index}>
                  <Skeleton height={190} radius={20} />
                  <Skeleton height={112} radius={18} />
                </div>
              ))
            : highlightedCards.map(({ account, card }, index) => (
                <div
                  className={styles['dashboard__card-stack']}
                  key={card.cardId ?? `${card.accountId}-${index}`}
                >
                  <DashboardBankCardVisual
                    account={account}
                    card={card}
                    holderName={userName}
                  />
                  <LimitsCard account={account} card={card} />
                </div>
              ))}
          <NotificationsCard />
        </aside>
      </div>
    </section>
  )
}

export default DashboardPage
