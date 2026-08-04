import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Landmark,
  ShieldCheck,
  X,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { formatMoney } from '@/lib/formatMoney'
import {
  useTopUpAccountMutation,
  useWithdrawAccountMutation,
} from '@/shared/api/accountApi'
import { AccountCurrency, AccountStatus } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type { GetAccountResponseDto } from '@/shared/api/types'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

type BalanceOperation = 'TOP_UP' | 'WITHDRAW'

type TransferFormValues = {
  accountId: string
  amount: string
}

export function TransferForm() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const accounts = useAppSelector(selectAccounts)
  const { isFetching } = useEnsureAccountsLoaded(user?.userProfileId)
  const [operation, setOperation] = useState<BalanceOperation>('TOP_UP')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [topUpAccount, { isLoading: isToppingUp }] = useTopUpAccountMutation()
  const [withdrawAccount, { isLoading: isWithdrawing }] =
    useWithdrawAccountMutation()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<TransferFormValues>({
    defaultValues: { accountId: '', amount: '' },
  })
  const isInitialLoading = isFetching && accounts.length === 0
  const eligibleAccounts = useMemo(
    () =>
      accounts.filter(
        (item): item is typeof item & { account: GetAccountResponseDto } =>
          Boolean(item.account?.accountId) &&
          item.account?.status === AccountStatus.ACTIVE,
      ),
    [accounts],
  )
  const selectedAccountId = watch('accountId')
  const selectedAccount = eligibleAccounts.find(
    (item) => item.account.accountId === selectedAccountId,
  )?.account
  const isSubmitting = isToppingUp || isWithdrawing

  useEffect(() => {
    if (
      !selectedAccountId ||
      !eligibleAccounts.some(
        (item) => item.account.accountId === selectedAccountId,
      )
    ) {
      setValue('accountId', eligibleAccounts[0]?.account.accountId ?? '')
    }
  }, [eligibleAccounts, selectedAccountId, setValue])

  const selectAccount = (accountId: string) => {
    setValue('accountId', accountId, { shouldValidate: true })
    setIsAccountMenuOpen(false)
  }

  const submit = async ({ accountId, amount }: TransferFormValues) => {
    const normalizedAmount = Number(amount)

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setError('amount', { message: t('enterValidAmount') })
      return
    }

    if (!accountId) {
      setError('accountId', { message: t('selectAccount') })
      return
    }

    try {
      if (operation === 'TOP_UP') {
        await topUpAccount({ accountId, amount: normalizedAmount }).unwrap()
      } else {
        await withdrawAccount({ accountId, amount: normalizedAmount }).unwrap()
      }

      setValue('amount', '')
      dispatch(
        showToast({
          message:
            operation === 'TOP_UP'
              ? t('accountTopUpSuccess')
              : t('accountWithdrawSuccess'),
          title: t('accounts'),
          variant: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('accountBalanceUpdateFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <>
      <header className={styles['transfer-panel__header']}>
        <h2 className={styles['transfer-panel__title']}>{t('transfer')}</h2>
        <button
          aria-label={t('closeTransferPanel')}
          className={styles['transfer-panel__close-button']}
          onClick={() => dispatch(closeRightPanel())}
          type="button"
        >
          <X className={styles['transfer-panel__close-icon']} />
        </button>
      </header>

      <div className={styles['transfer-panel__tabs']}>
        <button
          aria-pressed={operation === 'TOP_UP'}
          className={
            operation === 'TOP_UP'
              ? styles['transfer-panel__tab--active']
              : styles['transfer-panel__tab']
          }
          onClick={() => setOperation('TOP_UP')}
          type="button"
        >
          <ArrowDownLeft className={styles['transfer-panel__tab-icon']} />
          {t('topUp')}
        </button>
        <button
          aria-pressed={operation === 'WITHDRAW'}
          className={
            operation === 'WITHDRAW'
              ? styles['transfer-panel__tab--active']
              : styles['transfer-panel__tab']
          }
          onClick={() => setOperation('WITHDRAW')}
          type="button"
        >
          <ArrowUpRight className={styles['transfer-panel__tab-icon']} />
          {t('withdraw')}
        </button>
      </div>

      <form
        className={styles['transfer-panel__form']}
        onSubmit={handleSubmit(submit)}
      >
        <input type="hidden" {...register('accountId')} />

        <Field label={t('selectAccount')}>
          <div className={styles['transfer-panel__account-picker']}>
            <button
              aria-expanded={isAccountMenuOpen}
              aria-invalid={Boolean(errors.accountId)}
              className={styles['transfer-panel__account-select']}
              disabled={isInitialLoading || eligibleAccounts.length === 0}
              onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <AccountSummary
                account={selectedAccount}
                isLoading={isInitialLoading}
                t={t}
              />
              <ChevronDown className={styles['transfer-panel__chevron']} />
            </button>

            {isAccountMenuOpen ? (
              <div
                className={styles['transfer-panel__account-menu']}
                role="listbox"
              >
                {eligibleAccounts.map(({ account }) => (
                  <button
                    aria-selected={account.accountId === selectedAccountId}
                    className={styles['transfer-panel__account-option']}
                    key={account.accountId}
                    onClick={() =>
                      account.accountId && selectAccount(account.accountId)
                    }
                    role="option"
                    type="button"
                  >
                    <AccountSummary account={account} t={t} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {eligibleAccounts.length === 0 && !isInitialLoading ? (
            <p className={styles['transfer-panel__hint']}>
              {t('noActiveAccounts')}
            </p>
          ) : null}
          {errors.accountId?.message ? (
            <p className={styles['transfer-panel__error']}>
              {errors.accountId.message}
            </p>
          ) : null}
        </Field>

        <Field label={t('amount')}>
          <div className={styles['transfer-panel__amount-card']}>
            <div className={styles['transfer-panel__amount-row']}>
              <input
                aria-invalid={Boolean(errors.amount)}
                aria-label={t('amount')}
                className={styles['transfer-panel__amount-input']}
                inputMode="numeric"
                min="1"
                placeholder="0"
                step="1"
                type="number"
                {...register('amount', {
                  required: t('enterValidAmount'),
                  validate: (value) =>
                    Number(value) > 0 || t('enterValidAmount'),
                })}
              />
              <span className={styles['transfer-panel__currency-badge']}>
                {selectedAccount?.currency ?? '--'}
              </span>
            </div>
          </div>
          {errors.amount?.message ? (
            <p className={styles['transfer-panel__error']}>
              {errors.amount.message}
            </p>
          ) : null}
        </Field>

        <div className={styles['transfer-panel__security']}>
          <div className={styles['transfer-panel__account-summary']}>
            <ShieldCheck className={styles['transfer-panel__security-icon']} />
            <p className={styles['transfer-panel__security-copy']}>
              {t('fundsVerified')}
            </p>
          </div>
          <button
            className={`${styles['transfer-panel__submit']} ui-lift`}
            disabled={
              isSubmitting || isInitialLoading || eligibleAccounts.length === 0
            }
            type="submit"
          >
            {isSubmitting
              ? t('processing')
              : operation === 'TOP_UP'
                ? t('topUp')
                : t('withdraw')}
          </button>
        </div>
      </form>
    </>
  )
}

function AccountSummary({
  account,
  isLoading = false,
  t,
}: {
  account?: GetAccountResponseDto
  isLoading?: boolean
  t: ReturnType<typeof useI18n>['t']
}) {
  return (
    <div className={styles['transfer-panel__account-summary']}>
      <span className={styles['transfer-panel__account-icon']}>
        <Landmark className={styles['transfer-panel__icon']} />
      </span>
      <div>
        {isLoading ? (
          <>
            <Skeleton height={16} width={150} />
            <Skeleton height={13} width={110} />
          </>
        ) : (
          <>
            <p className={styles['transfer-panel__account-name']}>
              {account?.accountNumber ?? t('noAccountSelected')}
            </p>
            <p className={styles['transfer-panel__account-meta']}>
              {account?.availableBalance == null
                ? t('balanceUnavailable')
                : formatMoney(
                    account.availableBalance,
                    account.currency ?? AccountCurrency.USD,
                  )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={styles['transfer-panel__field']}>
      <span className={styles['transfer-panel__label']}>{label}</span>
      {children}
    </div>
  )
}
