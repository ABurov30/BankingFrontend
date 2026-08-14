import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { openRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import {
  useCreateAccountMutation,
  useFreezeAccountMutation,
  useUnfreezeAccountMutation,
} from '@/shared/api/accountApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import {
  AccountsPageHeader,
  AccountsPagination,
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
      <AccountsPageHeader
        isCreateDisabled={!ownerUserId}
        isCreatingAccount={isCreatingAccount}
        labels={{
          accounts: t('accounts'),
          newAccount: t('newAccount'),
          transfer: t('transfer'),
        }}
        onCreateAccount={() => setIsCreateFormOpen(true)}
        onOpenTransfer={() => dispatch(openRightPanel('transfer'))}
      />

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
        <AccountsPagination
          currentPage={currentPage}
          labels={{
            nextPage: t('nextPage'),
            of: t('of'),
            previousPage: t('previousPage'),
            showing: t('showing'),
            totalAccounts: t('totalAccounts'),
          }}
          onPageChange={setCurrentPage}
          totalAccounts={totalAccounts}
          totalPages={totalPages}
          visibleAccountsEnd={visibleAccountsEnd}
          visibleAccountsStart={visibleAccountsStart}
        />
      ) : null}
    </section>
  )
}

export default AccountsPage
