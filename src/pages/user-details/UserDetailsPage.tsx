import { ReceiptText } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { PageLoader } from '@/components/PageLoader'
import { showToast } from '@/features/toast/toastSlice'
import {
  getCardDailyLimitMinorUnits,
  getCardMonthlyLimitMinorUnits,
} from '@/lib/cardLimits'
import {
  useFreezeAccountMutation,
  useGetAccountsWithCardsByOwnerIdQuery,
  useUnfreezeAccountMutation,
} from '@/shared/api/accountApi'
import { useUpdateCardMutation } from '@/shared/api/cardApi'
import type { CardStatus as CardStatusValue } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'
import { useGetUserInfoByManagerQuery } from '@/shared/api/userApi'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'
import { UserAccountsSection } from './components/UserAccountsSection'
import { UserDetailsHeader } from './components/UserDetailsHeader'

function UserDetailsPage() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { authUserId } = useParams<{ authUserId: string }>()
  const { data: user, isLoading } = useGetUserInfoByManagerQuery(
    authUserId ? { authUserId } : skipToken,
  )
  const {
    data: accountsWithCards,
    isFetching: isAccountsFetching,
    refetch: refetchAccounts,
  } = useGetAccountsWithCardsByOwnerIdQuery(user?.userProfileId ?? skipToken)
  const [freezeAccount, { isLoading: isFreezingAccount }] =
    useFreezeAccountMutation()
  const [unfreezeAccount, { isLoading: isUnfreezingAccount }] =
    useUnfreezeAccountMutation()
  const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation()
  const handleFreezeAccount = async (accountId: string) => {
    try {
      await freezeAccount({
        accountId,
        ownerUserId: user?.userProfileId,
      }).unwrap()
      await refetchAccounts()
    } catch (error) {
      dispatch(
        showToast({ message: getApiErrorMessage(error), variant: 'error' }),
      )
    }
  }

  const handleUnfreezeAccount = async (accountId: string) => {
    try {
      await unfreezeAccount({
        accountId,
        ownerUserId: user?.userProfileId,
      }).unwrap()
      await refetchAccounts()
    } catch (error) {
      dispatch(
        showToast({ message: getApiErrorMessage(error), variant: 'error' }),
      )
    }
  }

  const handleUpdateCardStatus = async (
    card: GetCardByAccountIdResponseDto,
    status: CardStatusValue,
  ) => {
    if (!card.cardId || !card.accountId) return

    try {
      await updateCard({
        accountId: card.accountId,
        cardId: card.cardId,
        dailyLimitMinorUnits: getCardDailyLimitMinorUnits(card),
        monthlyLimitMinorUnits: getCardMonthlyLimitMinorUnits(card),
        status,
      }).unwrap()
      await refetchAccounts()
    } catch (error) {
      dispatch(
        showToast({ message: getApiErrorMessage(error), variant: 'error' }),
      )
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <section className={`${styles['user-details']} ui-enter`}>
      <UserDetailsHeader onBack={() => navigate('/users')} user={user} />

      <UserAccountsSection
        accounts={accountsWithCards}
        isUpdatingAccount={isFreezingAccount || isUnfreezingAccount}
        isUpdatingCard={isUpdatingCard}
        isLoading={isAccountsFetching}
        onFreezeAccount={(accountId) => void handleFreezeAccount(accountId)}
        onUnfreezeAccount={(accountId) => void handleUnfreezeAccount(accountId)}
        onUpdateCardStatus={(card, status) =>
          void handleUpdateCardStatus(card, status)
        }
      />

      <section className={styles['user-details__section']}>
        <div className={styles['user-details__section-heading']}>
          <ReceiptText />
          <h2>{t('transactions')}</h2>
        </div>
        <p className={styles['user-details__empty']}>{t('dataUnavailable')}</p>
      </section>
    </section>
  )
}

export default UserDetailsPage
