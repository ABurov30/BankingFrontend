import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronDown,
  Landmark,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { formatMoney } from '@/lib/formatMoney'
import { getAvailableFunds } from '@/lib/getAvailableFunds'
import {
  useTopUpAccountMutation,
  useWithdrawAccountMutation,
} from '@/shared/api/accountApi'
import { AccountCurrency, AccountStatus } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type {
  GetAccountResponseDto,
  GetUserInfoResponseDto,
} from '@/shared/api/types'
import { useCreateTransactionMutation } from '@/shared/api/transactionApi'
import { useGetUserInfoWithAccountsByEmailMutation } from '@/shared/api/userApi'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

type PanelOperation =
  'TOP_UP' | 'WITHDRAW' | 'BETWEEN_OWN_ACCOUNTS' | 'TO_ANOTHER_USER'

type TransferStage = 'TARGET' | 'OWN_OPERATION' | 'FORM'

type AccountMenu = 'source' | 'destination' | 'recipient' | null

type TransferFormValues = {
  amount: string
  destinationAccountId: string
  email: string
  recipientAccountId: string
  sourceAccountId: string
}

type TransferConfirmation = {
  amount: number
  destinationAccount: GetAccountResponseDto
  idempotencyKey: string
  recipient?: GetUserInfoResponseDto
  sourceAccount: GetAccountResponseDto
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function TransferForm() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const accounts = useAppSelector(selectAccounts)
  const { isFetching } = useEnsureAccountsLoaded(user?.userProfileId)
  const [operation, setOperation] = useState<PanelOperation | null>(null)
  const [transferStage, setTransferStage] = useState<TransferStage>('TARGET')
  const [openAccountMenu, setOpenAccountMenu] = useState<AccountMenu>(null)
  const [recipient, setRecipient] = useState<GetUserInfoResponseDto>()
  const [recipientAccounts, setRecipientAccounts] = useState<
    GetAccountResponseDto[]
  >([])
  const [confirmation, setConfirmation] = useState<TransferConfirmation>()
  const [topUpAccount, { isLoading: isToppingUp }] = useTopUpAccountMutation()
  const [withdrawAccount, { isLoading: isWithdrawing }] =
    useWithdrawAccountMutation()
  const [createTransaction, { isLoading: isCreatingTransaction }] =
    useCreateTransactionMutation()
  const [getUserInfoWithAccountsByEmail, { isLoading: isLookingUpRecipient }] =
    useGetUserInfoWithAccountsByEmailMutation()
  const {
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<TransferFormValues>({
    defaultValues: {
      amount: '',
      destinationAccountId: '',
      email: '',
      recipientAccountId: '',
      sourceAccountId: '',
    },
    shouldUnregister: true,
  })
  const isInitialLoading = isFetching && accounts.length === 0
  const eligibleAccounts = useMemo(
    () =>
      accounts.flatMap(({ account }) =>
        account?.accountId && account.status === AccountStatus.ACTIVE
          ? [account]
          : [],
      ),
    [accounts],
  )
  const sourceAccountId = watch('sourceAccountId')
  const destinationAccountId = watch('destinationAccountId')
  const recipientAccountId = watch('recipientAccountId')
  const sourceAccount = eligibleAccounts.find(
    (account) => account.accountId === sourceAccountId,
  )
  const ownDestinationAccounts = useMemo(
    () =>
      eligibleAccounts.filter(
        (account) => account.accountId !== sourceAccount?.accountId,
      ),
    [eligibleAccounts, sourceAccount?.accountId],
  )
  const destinationAccount = ownDestinationAccounts.find(
    (account) => account.accountId === destinationAccountId,
  )
  const activeRecipientAccounts = useMemo(
    () =>
      recipientAccounts.filter(
        (account) =>
          Boolean(account.accountId) && account.status === AccountStatus.ACTIVE,
      ),
    [recipientAccounts],
  )
  const recipientAccount = activeRecipientAccounts.find(
    (account) => account.accountId === recipientAccountId,
  )
  const isSubmitting = isToppingUp || isWithdrawing || isCreatingTransaction
  const isTransfer =
    operation === 'BETWEEN_OWN_ACCOUNTS' || operation === 'TO_ANOTHER_USER'
  const isExternalTransfer = operation === 'TO_ANOTHER_USER'
  const recipientEmailField = register('email')

  useEffect(() => {
    if (
      !sourceAccountId ||
      !eligibleAccounts.some((account) => account.accountId === sourceAccountId)
    ) {
      setValue('sourceAccountId', eligibleAccounts[0]?.accountId ?? '')
    }
  }, [eligibleAccounts, setValue, sourceAccountId])

  useEffect(() => {
    if (
      !destinationAccountId ||
      !ownDestinationAccounts.some(
        (account) => account.accountId === destinationAccountId,
      )
    ) {
      setValue(
        'destinationAccountId',
        ownDestinationAccounts[0]?.accountId ?? '',
      )
    }
  }, [destinationAccountId, ownDestinationAccounts, setValue])

  useEffect(() => {
    if (
      !recipientAccountId ||
      !activeRecipientAccounts.some(
        (account) => account.accountId === recipientAccountId,
      )
    ) {
      setValue(
        'recipientAccountId',
        activeRecipientAccounts[0]?.accountId ?? '',
      )
    }
  }, [activeRecipientAccounts, recipientAccountId, setValue])

  const resetRecipient = () => {
    setRecipient(undefined)
    setRecipientAccounts([])
    setValue('recipientAccountId', '')
  }

  const changeOperation = (nextOperation: PanelOperation) => {
    setOperation(nextOperation)
    setOpenAccountMenu(null)
    clearErrors()

    if (nextOperation !== 'TO_ANOTHER_USER') {
      resetRecipient()
      setValue('email', '')
    }
  }

  const chooseTransferTarget = (target: 'OWN_ACCOUNT' | 'ANOTHER_PERSON') => {
    setOpenAccountMenu(null)
    clearErrors()

    if (target === 'OWN_ACCOUNT') {
      resetRecipient()
      setValue('email', '')
      setOperation(null)
      setTransferStage('OWN_OPERATION')
      return
    }

    changeOperation('TO_ANOTHER_USER')
    setTransferStage('FORM')
  }

  const chooseOwnAccountOperation = (
    nextOperation: Exclude<PanelOperation, 'TO_ANOTHER_USER'>,
  ) => {
    changeOperation(nextOperation)
    setTransferStage('FORM')
  }

  const goBack = () => {
    setConfirmation(undefined)
    setOpenAccountMenu(null)
    clearErrors()

    if (transferStage === 'OWN_OPERATION') {
      setTransferStage('TARGET')
      return
    }

    if (operation === 'TO_ANOTHER_USER') {
      resetRecipient()
      setValue('email', '')
      setOperation(null)
      setTransferStage('TARGET')
      return
    }

    setOperation(null)
    setTransferStage('OWN_OPERATION')
  }

  const selectAccount = (
    field: 'sourceAccountId' | 'destinationAccountId' | 'recipientAccountId',
    accountId: string,
  ) => {
    setValue(field, accountId, { shouldValidate: true })
    setOpenAccountMenu(null)
  }

  const searchRecipient = async () => {
    const email = getValues('email').trim()

    if (!email) {
      setError('email', { message: t('enterRecipientEmail') })
      return
    }

    if (!emailPattern.test(email)) {
      setError('email', { message: t('enterValidEmail') })
      return
    }

    resetRecipient()
    clearErrors('email')

    try {
      const data = await getUserInfoWithAccountsByEmail({ email }).unwrap()

      if (!data.userInfo) {
        setError('email', { message: t('recipientLookupFailed') })
        return
      }

      if (data.userInfo.userProfileId === user?.userProfileId) {
        setError('email', { message: t('recipientCannotBeYourself') })
        return
      }

      setRecipient(data.userInfo)
      setRecipientAccounts(data.accounts ?? [])
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('recipientLookupFailed'),
          variant: 'error',
        }),
      )
    }
  }

  const submit = async (values: TransferFormValues) => {
    if (!operation) return

    const amount = Number(values.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('amount', { message: t('enterValidAmount') })
      return
    }

    if (!sourceAccount) {
      setError('sourceAccountId', { message: t('selectAccount') })
      return
    }

    if (operation === 'TOP_UP' || operation === 'WITHDRAW') {
      try {
        if (operation === 'TOP_UP') {
          await topUpAccount({
            accountId: sourceAccount.accountId!,
            amount,
          }).unwrap()
        } else {
          await withdrawAccount({
            accountId: sourceAccount.accountId!,
            amount,
          }).unwrap()
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

      return
    }

    if (operation === 'BETWEEN_OWN_ACCOUNTS') {
      if (!destinationAccount) {
        setError('destinationAccountId', {
          message: t('selectDifferentAccount'),
        })
        return
      }

      setConfirmation({
        amount,
        destinationAccount,
        idempotencyKey: crypto.randomUUID(),
        sourceAccount,
      })
      return
    }

    if (!recipient) {
      setError('email', { message: t('noRecipientSelected') })
      return
    }

    if (!recipientAccount) {
      setError('recipientAccountId', { message: t('selectRecipientAccount') })
      return
    }

    setConfirmation({
      amount,
      destinationAccount: recipientAccount,
      idempotencyKey: crypto.randomUUID(),
      recipient,
      sourceAccount,
    })
  }

  const confirmTransfer = async () => {
    if (!confirmation) return

    const { destinationAccount, sourceAccount } = confirmation

    if (
      !sourceAccount.accountId ||
      !destinationAccount.accountId ||
      !sourceAccount.currency
    ) {
      dispatch(
        showToast({
          message: t('balanceUnavailable'),
          title: t('transfer'),
          variant: 'error',
        }),
      )
      return
    }

    try {
      await createTransaction({
        amount: confirmation.amount,
        currency: sourceAccount.currency,
        idempotencyKey: confirmation.idempotencyKey,
        sourceAccountId: sourceAccount.accountId,
        targetAccountId: destinationAccount.accountId,
      }).unwrap()

      setValue('amount', '')
      setConfirmation(undefined)
      dispatch(
        showToast({
          message: t('transferSent'),
          title: t('transfer'),
          variant: 'success',
        }),
      )
      dispatch(closeRightPanel())
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('transfer'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <>
      <header className={styles['transfer-panel__header']}>
        <div className={styles['transfer-panel__header-start']}>
          {transferStage !== 'TARGET' ? (
            <button
              aria-label={t('back')}
              className={styles['transfer-panel__back-button']}
              onClick={goBack}
              type="button"
            >
              <ArrowLeft />
            </button>
          ) : null}
          <h2 className={styles['transfer-panel__title']}>{t('transfer')}</h2>
        </div>
        <button
          aria-label={t('closeTransferPanel')}
          className={styles['transfer-panel__close-button']}
          onClick={() => dispatch(closeRightPanel())}
          type="button"
        >
          <X className={styles['transfer-panel__close-icon']} />
        </button>
      </header>

      {transferStage === 'TARGET' ? (
        <div className={styles['transfer-panel__tabs']}>
          <OperationTab
            active={false}
            icon={<Landmark className={styles['transfer-panel__tab-icon']} />}
            label={t('toYourAccount')}
            onClick={() => chooseTransferTarget('OWN_ACCOUNT')}
          />
          <OperationTab
            active={false}
            icon={<Send className={styles['transfer-panel__tab-icon']} />}
            label={t('toAnotherPerson')}
            onClick={() => chooseTransferTarget('ANOTHER_PERSON')}
          />
        </div>
      ) : null}

      {transferStage === 'OWN_OPERATION' ? (
        <div
          className={`${styles['transfer-panel__tabs']} ${styles['transfer-panel__tabs--own-operations']}`}
        >
          <OperationTab
            active={false}
            icon={
              <ArrowDownLeft className={styles['transfer-panel__tab-icon']} />
            }
            label={t('topUp')}
            onClick={() => chooseOwnAccountOperation('TOP_UP')}
          />
          <OperationTab
            active={false}
            icon={
              <ArrowUpRight className={styles['transfer-panel__tab-icon']} />
            }
            label={t('withdraw')}
            onClick={() => chooseOwnAccountOperation('WITHDRAW')}
          />
          <OperationTab
            active={false}
            icon={
              <ArrowLeftRight className={styles['transfer-panel__tab-icon']} />
            }
            label={t('betweenMyAccounts')}
            onClick={() => chooseOwnAccountOperation('BETWEEN_OWN_ACCOUNTS')}
          />
        </div>
      ) : null}

      {transferStage === 'FORM' ? (
        <form
          className={styles['transfer-panel__form']}
          onSubmit={handleSubmit(submit)}
        >
          <input type="hidden" {...register('sourceAccountId')} />

          {isExternalTransfer ? (
            <>
              <Field label={t('emailAddress')}>
                <div className={styles['transfer-panel__email-row']}>
                  <input
                    {...recipientEmailField}
                    aria-invalid={Boolean(errors.email)}
                    className={styles['transfer-panel__email-input']}
                    onChange={(event) => {
                      recipientEmailField.onChange(event)
                      clearErrors('email')
                      resetRecipient()
                    }}
                    placeholder="name@example.com"
                    type="email"
                  />
                  <button
                    className={styles['transfer-panel__search-button']}
                    disabled={isLookingUpRecipient}
                    onClick={searchRecipient}
                    type="button"
                  >
                    <Search className={styles['transfer-panel__search-icon']} />
                    {isLookingUpRecipient ? t('searching') : t('search')}
                  </button>
                </div>
                {errors.email?.message ? (
                  <p className={styles['transfer-panel__error']}>
                    {errors.email.message}
                  </p>
                ) : null}
              </Field>

              {recipient ? (
                <div className={styles['transfer-panel__recipient']}>
                  <span className={styles['transfer-panel__recipient-avatar']}>
                    {getInitials(recipient)}
                  </span>
                  <div>
                    <p className={styles['transfer-panel__recipient-name']}>
                      {getUserName(recipient)}
                    </p>
                    <p className={styles['transfer-panel__recipient-email']}>
                      {recipient.email}
                    </p>
                  </div>
                </div>
              ) : null}

              {recipient ? (
                <Field label={t('recipientAccount')}>
                  <input type="hidden" {...register('recipientAccountId')} />
                  <AccountPicker
                    accounts={activeRecipientAccounts}
                    emptyLabel={t('noActiveRecipientAccounts')}
                    isOpen={openAccountMenu === 'recipient'}
                    onOpenChange={() =>
                      setOpenAccountMenu((menu) =>
                        menu === 'recipient' ? null : 'recipient',
                      )
                    }
                    onSelect={(accountId) =>
                      selectAccount('recipientAccountId', accountId)
                    }
                    selectedAccount={recipientAccount}
                    selectedAccountId={recipientAccountId}
                    t={t}
                  />
                  {activeRecipientAccounts.length === 0 ? (
                    <p className={styles['transfer-panel__hint']}>
                      {t('noActiveRecipientAccounts')}
                    </p>
                  ) : null}
                  {errors.recipientAccountId?.message ? (
                    <p className={styles['transfer-panel__error']}>
                      {errors.recipientAccountId.message}
                    </p>
                  ) : null}
                </Field>
              ) : null}
            </>
          ) : null}

          <Field label={isTransfer ? t('fromAccount') : t('selectAccount')}>
            <AccountPicker
              accounts={eligibleAccounts}
              disabled={isInitialLoading || eligibleAccounts.length === 0}
              emptyLabel={t('noActiveAccounts')}
              isLoading={isInitialLoading}
              isOpen={openAccountMenu === 'source'}
              onOpenChange={() =>
                setOpenAccountMenu((menu) =>
                  menu === 'source' ? null : 'source',
                )
              }
              onSelect={(accountId) =>
                selectAccount('sourceAccountId', accountId)
              }
              selectedAccount={sourceAccount}
              selectedAccountId={sourceAccountId}
              t={t}
            />
            {eligibleAccounts.length === 0 && !isInitialLoading ? (
              <p className={styles['transfer-panel__hint']}>
                {t('noActiveAccounts')}
              </p>
            ) : null}
            {errors.sourceAccountId?.message ? (
              <p className={styles['transfer-panel__error']}>
                {errors.sourceAccountId.message}
              </p>
            ) : null}
          </Field>

          {operation === 'BETWEEN_OWN_ACCOUNTS' ? (
            <Field label={t('toAccount')}>
              <input type="hidden" {...register('destinationAccountId')} />
              <AccountPicker
                accounts={ownDestinationAccounts}
                disabled={
                  isInitialLoading || ownDestinationAccounts.length === 0
                }
                emptyLabel={t('selectDifferentAccount')}
                isLoading={isInitialLoading}
                isOpen={openAccountMenu === 'destination'}
                onOpenChange={() =>
                  setOpenAccountMenu((menu) =>
                    menu === 'destination' ? null : 'destination',
                  )
                }
                onSelect={(accountId) =>
                  selectAccount('destinationAccountId', accountId)
                }
                selectedAccount={destinationAccount}
                selectedAccountId={destinationAccountId}
                t={t}
              />
              {ownDestinationAccounts.length === 0 && !isInitialLoading ? (
                <p className={styles['transfer-panel__hint']}>
                  {t('selectDifferentAccount')}
                </p>
              ) : null}
              {errors.destinationAccountId?.message ? (
                <p className={styles['transfer-panel__error']}>
                  {errors.destinationAccountId.message}
                </p>
              ) : null}
            </Field>
          ) : null}

          <Field label={t('amount')}>
            <div className={styles['transfer-panel__amount-card']}>
              <div className={styles['transfer-panel__amount-row']}>
                <input
                  aria-invalid={Boolean(errors.amount)}
                  aria-label={t('amount')}
                  className={styles['transfer-panel__amount-input']}
                  inputMode="decimal"
                  min="0.01"
                  placeholder="0"
                  step="0.01"
                  type="number"
                  {...register('amount', {
                    required: t('enterValidAmount'),
                    validate: (value) =>
                      Number(value) > 0 || t('enterValidAmount'),
                  })}
                />
                <span className={styles['transfer-panel__currency-badge']}>
                  {sourceAccount?.currency ?? '--'}
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
              <ShieldCheck
                className={styles['transfer-panel__security-icon']}
              />
              <p className={styles['transfer-panel__security-copy']}>
                {t('fundsVerified')}
              </p>
            </div>
            <button
              className={`${styles['transfer-panel__submit']} ui-lift`}
              disabled={
                isSubmitting ||
                isInitialLoading ||
                eligibleAccounts.length === 0
              }
              type="submit"
            >
              {isSubmitting
                ? t('processing')
                : operation === 'TOP_UP'
                  ? t('topUp')
                  : operation === 'WITHDRAW'
                    ? t('withdraw')
                    : t('reviewTransfer')}
            </button>
          </div>
        </form>
      ) : null}

      {confirmation ? (
        <TransferConfirmationDialog
          confirmation={confirmation}
          isSubmitting={isCreatingTransaction}
          onClose={() => setConfirmation(undefined)}
          onConfirm={confirmTransfer}
          t={t}
        />
      ) : null}
    </>
  )
}

function OperationTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={active}
      className={
        active
          ? styles['transfer-panel__tab--active']
          : styles['transfer-panel__tab']
      }
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}

function AccountPicker({
  accounts,
  disabled = false,
  emptyLabel,
  isLoading = false,
  isOpen,
  onOpenChange,
  onSelect,
  selectedAccount,
  selectedAccountId,
  t,
}: {
  accounts: GetAccountResponseDto[]
  disabled?: boolean
  emptyLabel: string
  isLoading?: boolean
  isOpen: boolean
  onOpenChange: () => void
  onSelect: (accountId: string) => void
  selectedAccount?: GetAccountResponseDto
  selectedAccountId: string
  t: ReturnType<typeof useI18n>['t']
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
        <AccountSummary
          account={selectedAccount}
          emptyLabel={emptyLabel}
          isLoading={isLoading}
          t={t}
        />
        <ChevronDown className={styles['transfer-panel__chevron']} />
      </button>

      {isOpen ? (
        <div className={styles['transfer-panel__account-menu']} role="listbox">
          {accounts.map((account) => (
            <button
              aria-selected={account.accountId === selectedAccountId}
              className={styles['transfer-panel__account-option']}
              key={account.accountId}
              onClick={() => account.accountId && onSelect(account.accountId)}
              role="option"
              type="button"
            >
              <AccountSummary account={account} emptyLabel={emptyLabel} t={t} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AccountSummary({
  account,
  emptyLabel,
  isLoading = false,
  t,
}: {
  account?: GetAccountResponseDto
  emptyLabel: string
  isLoading?: boolean
  t: ReturnType<typeof useI18n>['t']
}) {
  const availableFunds = getAvailableFunds(account)

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
              {account?.accountNumber ?? emptyLabel}
            </p>
            <p className={styles['transfer-panel__account-meta']}>
              {availableFunds == null
                ? t('balanceUnavailable')
                : formatMoney(
                    availableFunds,
                    account?.currency ?? AccountCurrency.USD,
                  )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function TransferConfirmationDialog({
  confirmation,
  isSubmitting,
  onClose,
  onConfirm,
  t,
}: {
  confirmation: TransferConfirmation
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  t: ReturnType<typeof useI18n>['t']
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const destinationAccountNumber =
    confirmation.destinationAccount.accountNumber ?? t('noAccountSelected')

  return createPortal(
    <div
      className={styles['transfer-panel__dialog-backdrop']}
      data-transfer-confirmation
      role="presentation"
    >
      <section
        aria-labelledby="transfer-confirmation-title"
        aria-modal="true"
        className={styles['transfer-panel__dialog']}
        role="dialog"
      >
        <button
          aria-label={t('closeDialog')}
          className={styles['transfer-panel__dialog-close']}
          onClick={onClose}
          type="button"
        >
          <X />
        </button>
        <span className={styles['transfer-panel__dialog-icon']}>
          <ShieldCheck />
        </span>
        <h2
          id="transfer-confirmation-title"
          className={styles['transfer-panel__dialog-title']}
        >
          {t('confirmTransfer')}
        </h2>
        <p className={styles['transfer-panel__dialog-copy']}>
          {t('transferConfirmationDescription')}
        </p>

        <div className={styles['transfer-panel__confirmation-details']}>
          <ConfirmationRow
            label={t('from')}
            value={
              confirmation.sourceAccount.accountNumber ?? t('noAccountSelected')
            }
          />
          <ConfirmationRow label={t('to')} value={destinationAccountNumber} />
          {confirmation.recipient ? (
            <ConfirmationRow
              label={t('recipient')}
              value={getUserName(confirmation.recipient)}
            />
          ) : null}
          <ConfirmationRow
            label={t('amount')}
            value={formatMoney(
              confirmation.amount,
              confirmation.sourceAccount.currency ?? AccountCurrency.USD,
            )}
          />
        </div>

        <div className={styles['transfer-panel__dialog-actions']}>
          <button
            className={styles['transfer-panel__dialog-cancel']}
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['transfer-panel__dialog-confirm']}
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? t('processing') : t('confirmTransfer')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles['transfer-panel__confirmation-row']}>
      <span>{label}</span>
      <strong>{value}</strong>
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

function getUserName(user: GetUserInfoResponseDto) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return fullName || user.email || '—'
}

function getInitials(user: GetUserInfoResponseDto) {
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name![0])
    .join('')

  return initials || user.email?.[0]?.toUpperCase() || '?'
}
