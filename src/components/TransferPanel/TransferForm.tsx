import type { ChangeEventHandler } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { parseMoneyAmountInput } from '@/lib/moneyAmount'
import {
  useTopUpAccountMutation,
  useWithdrawAccountMutation,
} from '@/shared/api/accountApi'
import { AccountStatus, CardStatus } from '@/shared/api/enums'
import { getApiErrorMessage } from '@/shared/api/error'
import type {
  GetAccountWithCardsResponseDto,
  GetUserInfoResponseDto,
} from '@/shared/api/types'
import { useCreateTransactionMutation } from '@/shared/api/transactionApi'
import { useGetUserInfoWithAccountsByEmailMutation } from '@/shared/api/userApi'
import { useI18n } from '@/shared/i18n/useI18n'
import {
  AccountPicker,
  AmountField,
  CardPicker,
  Field,
  OwnAccountOperationTabs,
  RecipientFields,
  TransferConfirmationDialog,
  TransferPanelHeader,
  TransferSubmitBlock,
  TransferTargetTabs,
} from './components'
import type {
  AccountMenu,
  PanelOperation,
  TransferConfirmation,
  TransferFormValues,
  TransferSourceCardOption,
  TransferStage,
} from './types'
import { emailPattern } from './utils'
import styles from './styles.module.css'

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
    GetAccountWithCardsResponseDto[]
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
      sourceCardId: '',
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
  const sourceCardId = watch('sourceCardId')
  const destinationAccountId = watch('destinationAccountId')
  const recipientAccountId = watch('recipientAccountId')
  const isTransfer =
    operation === 'BETWEEN_OWN_ACCOUNTS' || operation === 'TO_ANOTHER_USER'
  const isExternalTransfer = operation === 'TO_ANOTHER_USER'
  const sourceCardOptions = useMemo<TransferSourceCardOption[]>(
    () =>
      accounts.flatMap(({ account, cards }) =>
        account?.accountId && account.status === AccountStatus.ACTIVE
          ? (cards ?? []).flatMap((card) =>
              card.cardId && card.status === CardStatus.ACTIVE
                ? [{ account, card }]
                : [],
            )
          : [],
      ),
    [accounts],
  )
  const selectedSourceCardOption = sourceCardOptions.find(
    ({ card }) => card.cardId === sourceCardId,
  )
  const selectedSourceAccount = eligibleAccounts.find(
    (account) => account.accountId === sourceAccountId,
  )
  const sourceAccount = isTransfer
    ? selectedSourceCardOption?.account
    : selectedSourceAccount
  const sourceCard = selectedSourceCardOption?.card
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
      recipientAccounts.flatMap(({ account }) =>
        account?.accountId && account.status === AccountStatus.ACTIVE
          ? [account]
          : [],
      ),
    [recipientAccounts],
  )
  const recipientAccount = activeRecipientAccounts.find(
    (account) => account.accountId === recipientAccountId,
  )
  const isSubmitting = isToppingUp || isWithdrawing || isCreatingTransaction
  const hasAvailableSource = isTransfer
    ? sourceCardOptions.length > 0
    : eligibleAccounts.length > 0
  const recipientEmailField = register('email')

  useEffect(() => {
    if (isTransfer) return

    if (
      !sourceAccountId ||
      !eligibleAccounts.some((account) => account.accountId === sourceAccountId)
    ) {
      setValue('sourceAccountId', eligibleAccounts[0]?.accountId ?? '')
    }
  }, [eligibleAccounts, isTransfer, setValue, sourceAccountId])

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
    if (!isTransfer) return

    const selectedOption = sourceCardOptions.find(
      ({ card }) => card.cardId === sourceCardId,
    )
    const fallbackOption = sourceCardOptions[0]

    if (!sourceCardId || !selectedOption) {
      setValue('sourceCardId', fallbackOption?.card.cardId ?? '')
      setValue('sourceAccountId', fallbackOption?.account.accountId ?? '')
      clearErrors('sourceCardId')
      clearErrors('sourceAccountId')
      return
    }

    if (selectedOption.account.accountId !== sourceAccountId) {
      setValue('sourceAccountId', selectedOption.account.accountId ?? '')
    }
  }, [
    clearErrors,
    isTransfer,
    setValue,
    sourceAccountId,
    sourceCardId,
    sourceCardOptions,
  ])

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

  const toggleAccountMenu = (menu: Exclude<AccountMenu, null>) => {
    setOpenAccountMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }

  const selectAccount = (
    field:
      | 'sourceAccountId'
      | 'sourceCardId'
      | 'destinationAccountId'
      | 'recipientAccountId',
    accountId: string,
  ) => {
    setValue(field, accountId, { shouldValidate: true })
    clearErrors(field)

    if (field === 'sourceAccountId') {
      clearErrors('sourceCardId')
    }

    setOpenAccountMenu(null)
  }

  const selectSourceCard = (cardId: string) => {
    const option = sourceCardOptions.find(({ card }) => card.cardId === cardId)

    setValue('sourceCardId', cardId, { shouldValidate: true })
    setValue('sourceAccountId', option?.account.accountId ?? '', {
      shouldValidate: true,
    })
    clearErrors('sourceCardId')
    clearErrors('sourceAccountId')
    setOpenAccountMenu(null)
  }

  const handleRecipientEmailChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    recipientEmailField.onChange(event)
    clearErrors('email')
    resetRecipient()
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

    const parsedAmount = parseMoneyAmountInput(values.amount)

    if (!parsedAmount) {
      setError('amount', { message: t('enterValidAmount') })
      return
    }

    const { amount, minorUnits } = parsedAmount

    if (!sourceAccount) {
      setError(isTransfer ? 'sourceCardId' : 'sourceAccountId', {
        message: isTransfer ? t('sourceCardUnavailable') : t('selectAccount'),
      })
      return
    }

    if (operation === 'TOP_UP' || operation === 'WITHDRAW') {
      try {
        if (operation === 'TOP_UP') {
          await topUpAccount({
            accountId: sourceAccount.accountId!,
            minorUnits,
          }).unwrap()
        } else {
          await withdrawAccount({
            accountId: sourceAccount.accountId!,
            minorUnits,
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

    if (!sourceCard?.cardId) {
      setError('sourceCardId', { message: t('sourceCardUnavailable') })
      return
    }

    const transferSourceCard = sourceCard
    const transferSourceCardId = sourceCard.cardId

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
        minorUnits,
        sourceAccount,
        sourceCard: transferSourceCard,
        sourceCardId: transferSourceCardId,
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
      minorUnits,
      recipient,
      sourceAccount,
      sourceCard: transferSourceCard,
      sourceCardId: transferSourceCardId,
    })
  }

  const confirmTransfer = async () => {
    if (!confirmation) return

    const { destinationAccount, sourceAccount } = confirmation

    if (
      !sourceAccount.accountId ||
      !confirmation.sourceCardId ||
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
        currency: sourceAccount.currency,
        idempotencyKey: confirmation.idempotencyKey,
        minorUnits: confirmation.minorUnits,
        sourceAccountId: sourceAccount.accountId,
        sourceCardId: confirmation.sourceCardId,
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
      <TransferPanelHeader
        backLabel={t('back')}
        canGoBack={transferStage !== 'TARGET'}
        closeLabel={t('closeTransferPanel')}
        onBack={goBack}
        onClose={() => dispatch(closeRightPanel())}
        title={t('transfer')}
      />

      {transferStage === 'TARGET' ? (
        <TransferTargetTabs onSelectTarget={chooseTransferTarget} t={t} />
      ) : null}

      {transferStage === 'OWN_OPERATION' ? (
        <OwnAccountOperationTabs
          onSelectOperation={chooseOwnAccountOperation}
          t={t}
        />
      ) : null}

      {transferStage === 'FORM' ? (
        <form
          className={styles['transfer-panel__form']}
          onSubmit={handleSubmit(submit)}
        >
          <input type="hidden" {...register('sourceAccountId')} />

          {isTransfer ? (
            <input type="hidden" {...register('sourceCardId')} />
          ) : null}

          {isExternalTransfer ? (
            <>
              <input type="hidden" {...register('recipientAccountId')} />
              <RecipientFields
                activeRecipientAccounts={activeRecipientAccounts}
                emailError={errors.email}
                isLookingUpRecipient={isLookingUpRecipient}
                isRecipientMenuOpen={openAccountMenu === 'recipient'}
                onEmailChange={handleRecipientEmailChange}
                onRecipientAccountSelect={(accountId) =>
                  selectAccount('recipientAccountId', accountId)
                }
                onRecipientMenuToggle={() => toggleAccountMenu('recipient')}
                onSearchRecipient={searchRecipient}
                recipient={recipient}
                recipientAccount={recipientAccount}
                recipientAccountError={errors.recipientAccountId}
                recipientAccountId={recipientAccountId}
                recipientEmailField={recipientEmailField}
                t={t}
              />
            </>
          ) : null}

          {!isTransfer ? (
            <Field label={t('selectAccount')}>
              <AccountPicker
                accounts={eligibleAccounts}
                disabled={isInitialLoading || eligibleAccounts.length === 0}
                emptyLabel={t('noActiveAccounts')}
                isLoading={isInitialLoading}
                isOpen={openAccountMenu === 'source'}
                onOpenChange={() => toggleAccountMenu('source')}
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
          ) : null}

          {isTransfer ? (
            <Field label={t('sourceCard')}>
              <CardPicker
                disabled={isInitialLoading || sourceCardOptions.length === 0}
                emptyLabel={t('noActiveSourceCards')}
                isOpen={openAccountMenu === 'sourceCard'}
                onOpenChange={() => toggleAccountMenu('sourceCard')}
                onSelect={selectSourceCard}
                options={sourceCardOptions}
                selectedOption={selectedSourceCardOption}
                selectedCardId={sourceCardId}
                t={t}
              />
              {sourceCardOptions.length === 0 && !isInitialLoading ? (
                <p className={styles['transfer-panel__hint']}>
                  {t('noActiveSourceCards')}
                </p>
              ) : null}
              {errors.sourceCardId?.message ? (
                <p className={styles['transfer-panel__error']}>
                  {errors.sourceCardId.message}
                </p>
              ) : null}
            </Field>
          ) : null}

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
                onOpenChange={() => toggleAccountMenu('destination')}
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

          <AmountField
            amountError={errors.amount}
            register={register}
            sourceAccount={sourceAccount}
            t={t}
          />

          <TransferSubmitBlock
            disabled={isSubmitting || isInitialLoading || !hasAvailableSource}
            isSubmitting={isSubmitting}
            operation={operation}
            t={t}
          />
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
