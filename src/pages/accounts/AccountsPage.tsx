import { ArrowLeftRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { formatMoney } from '@/lib/formatMoney'
import {
  useCreateAccountMutation,
  useFreezeAccountMutation,
  useUnfreezeAccountMutation,
} from '@/shared/api/accountApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import {
  AccountsTable,
  AccountsToolbar,
  CreateAccountDialog,
  isAccountRowModel,
  mapAccountRow,
  type AccountFilters,
  type CreateAccountFormValues,
} from './components'
import styles from './styles.module.css'

const initialFilters: AccountFilters = {
  currency: 'ALL',
  status: 'ALL',
  type: 'ALL',
}

const accountsPerPage = 10

function AccountsPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const accountsWithCards = useAppSelector(selectAccounts)
  const ownerUserId = user?.userProfileId
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [filters, setFilters] = useState<AccountFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const { isFetching } = useEnsureAccountsLoaded(ownerUserId)
  const [createAccount, { isLoading: isCreatingAccount }] =
    useCreateAccountMutation()
  const [freezeAccount] = useFreezeAccountMutation()
  const [unfreezeAccount] = useUnfreezeAccountMutation()
  const accounts = accountsWithCards
    .map(mapAccountRow)
    .filter(isAccountRowModel)
    .filter((account) => {
      return (
        (filters.status === 'ALL' || account.status === filters.status) &&
        (filters.type === 'ALL' || account.type === filters.type) &&
        (filters.currency === 'ALL' || account.currency === filters.currency)
      )
    })
  const totalAccounts = accounts.length
  const totalPages = Math.ceil(totalAccounts / accountsPerPage)
  const shouldShowPagination = totalPages > 1
  const firstVisibleAccountIndex = (currentPage - 1) * accountsPerPage
  const paginatedAccounts = accounts.slice(
    firstVisibleAccountIndex,
    firstVisibleAccountIndex + accountsPerPage,
  )
  const visibleAccountsStart =
    totalAccounts === 0 ? 0 : firstVisibleAccountIndex + 1
  const visibleAccountsEnd = firstVisibleAccountIndex + paginatedAccounts.length
  const totalBalance = accountsWithCards.reduce((sum, item) => {
    return sum + (item.account?.availableBalance ?? 0)
  }, 0)
  const isInitialLoading = isFetching && accountsWithCards.length === 0

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleCreateAccount = async (values: CreateAccountFormValues) => {
    if (!ownerUserId) {
      return
    }

    try {
      await createAccount({
        currency: values.currency,
        ownerUserId,
        type: values.type,
      }).unwrap()
      setIsCreateFormOpen(false)
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('accountCreationFailed'),
          variant: 'error',
        }),
      )
    }
  }

  const handleFreezeAccount = async (accountId: string) => {
    try {
      await freezeAccount({ accountId, ownerUserId }).unwrap()
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('accountUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  const handleUnfreezeAccount = async (accountId: string) => {
    try {
      await unfreezeAccount({ accountId, ownerUserId }).unwrap()
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('accountUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <section className={`${styles['accounts']} ui-enter`}>
      <header className={styles['accounts__header']}>
        <div>
          <h1 className={styles['accounts__title']}>{t('accounts')}</h1>
          <p className={styles['accounts__subtitle']}>
            {isInitialLoading ? (
              <Skeleton height={14} width={190} />
            ) : (
              `${accounts.length} ${t('totalAccounts')} · ${formatMoney(totalBalance)} ${t('totalBalance')}`
            )}
          </p>
        </div>

        <div className={styles['accounts__header-actions']}>
          <button
            className={`${styles['accounts__transfer-button']} ui-lift`}
            disabled={!ownerUserId}
            onClick={() => dispatch(openRightPanel('transfer'))}
            type="button"
          >
            <ArrowLeftRight className={styles['accounts__button-icon']} />
            {t('transfer')}
          </button>
          <button
            className={`${styles['accounts__add-button']} ui-lift`}
            disabled={!ownerUserId || isCreatingAccount}
            onClick={() => setIsCreateFormOpen(true)}
            type="button"
          >
            <Plus className={styles['accounts__button-icon']} />
            {t('newAccount')}
          </button>
        </div>
      </header>

      {isCreateFormOpen ? (
        <CreateAccountDialog
          isCreatingAccount={isCreatingAccount}
          onClose={() => setIsCreateFormOpen(false)}
          onSubmit={handleCreateAccount}
        />
      ) : null}

      <AccountsToolbar filters={filters} onFiltersChange={setFilters} />
      <AccountsTable
        accounts={paginatedAccounts}
        isLoading={isInitialLoading}
        onFreeze={handleFreezeAccount}
        onUnfreeze={handleUnfreezeAccount}
      />

      {shouldShowPagination ? (
        <footer className={styles['accounts__footer']}>
          <p className={styles['accounts__footer-text']}>
            {t('showing')} {visibleAccountsStart}-{visibleAccountsEnd} {t('of')}{' '}
            {totalAccounts} {t('totalAccounts')}
          </p>

          <div className={styles['accounts__pagination']}>
            <button
              aria-label={t('previousPage')}
              className={`${styles['accounts__page-button']} ui-lift`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
            >
              <ChevronLeft className={styles['accounts__page-icon']} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1

              return (
                <button
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`${styles['accounts__page-button']} ${
                    currentPage === page
                      ? styles['accounts__page-button--active']
                      : ''
                  } ui-lift`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              )
            })}

            <button
              aria-label={t('nextPage')}
              className={`${styles['accounts__page-button']} ui-lift`}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              type="button"
            >
              <ChevronRight className={styles['accounts__page-icon']} />
            </button>
          </div>
        </footer>
      ) : null}
    </section>
  )
}

export default AccountsPage
