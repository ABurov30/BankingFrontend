import {
  ChevronDown,
  Landmark,
  Repeat2,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Skeleton } from '@/components/Skeleton'
import { selectAccounts } from '@/features/accounts/accountsSlice'
import { useEnsureAccountsLoaded } from '@/features/accounts/useEnsureAccountsLoaded'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { formatMoney } from '@/lib/formatMoney'
import { AccountCurrency } from '@/shared/api/enums'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from './styles.module.css'

export function TransferPanel() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const user = useAppSelector(selectCurrentUser)
  const accounts = useAppSelector(selectAccounts)
  const { isFetching } = useEnsureAccountsLoaded(user?.userProfileId)
  const isInitialLoading = isFetching && accounts.length === 0
  const sourceAccount = accounts.find((item) => item.account)?.account
  const sourceAccountName = sourceAccount?.type
    ? `${sourceAccount.type.charAt(0)}${sourceAccount.type.slice(1).toLowerCase()} account`
    : t('noAccountSelected')

  return (
    <>
      <header className={styles['transfer-panel__header']}>
        <h2 className={styles['transfer-panel__title']}>{t('newTransfer')}</h2>
        <button
          aria-label={t('closeTransferPanel')}
          className={styles['transfer-panel__close-button']}
          onClick={() => dispatch(closeRightPanel())}
          type="button"
        >
          <X className={styles['transfer-panel__close-icon']} />
        </button>
      </header>

      <div className={styles['transfer-panel__tabs']} role="tablist">
        <button
          className={styles['transfer-panel__tab']}
          role="tab"
          type="button"
        >
          <Repeat2 className={styles['transfer-panel__tab-icon']} />
          {t('myAccounts')}
        </button>
        <button
          aria-selected="true"
          className={styles['transfer-panel__tab--inactive']}
          role="tab"
          type="button"
        >
          <User className={styles['transfer-panel__tab-icon']} />
          {t('to')}
        </button>
      </div>

      <div className={styles['transfer-panel__form']}>
        <Field label={t('from')}>
          <div className={styles['transfer-panel__account-select']}>
            <div className={styles['transfer-panel__account-summary']}>
              <span className={styles['transfer-panel__account-icon']}>
                <Landmark className={styles['transfer-panel__icon']} />
              </span>
              <div>
                {isInitialLoading ? (
                  <>
                    <Skeleton height={16} width={150} />
                    <Skeleton height={13} width={110} />
                  </>
                ) : (
                  <>
                    <p className={styles['transfer-panel__account-name']}>
                      {sourceAccountName}
                    </p>
                    <p className={styles['transfer-panel__account-meta']}>
                      {sourceAccount?.availableBalance == null
                        ? t('balanceUnavailable')
                        : formatMoney(
                            sourceAccount.availableBalance,
                            sourceAccount.currency ?? AccountCurrency.USD,
                          )}
                    </p>
                  </>
                )}
              </div>
            </div>
            <ChevronDown className={styles['transfer-panel__chevron']} />
          </div>
        </Field>

        <Field label={t('to')}>
          <div className={styles['transfer-panel__recipient']}>
            <span className={styles['transfer-panel__recipient-avatar']}>
              --
            </span>
            <div>
              <p className={styles['transfer-panel__account-name']}>
                {t('noRecipientSelected')}
              </p>
              <p className={styles['transfer-panel__account-meta']}>
                {t('transferApiNotConnected')}
              </p>
            </div>
          </div>
        </Field>

        <Field label={t('amount')}>
          <div className={styles['transfer-panel__amount-card']}>
            <div className={styles['transfer-panel__amount-row']}>
              <p className={styles['transfer-panel__amount']}>
                --
                <span className={styles['transfer-panel__amount-cents']}>
                  --
                </span>
              </p>
              <span className={styles['transfer-panel__currency-badge']}>
                {sourceAccount?.currency ?? '--'}
              </span>
            </div>
          </div>
          <p className={styles['transfer-panel__fee-note']}>
            {t('transferAmountNotEntered')}
          </p>
        </Field>

        <Field label={t('noteOptional')}>
          <div className={styles['transfer-panel__memo']}>{t('noNote')}</div>
        </Field>
      </div>

      <div className={styles['transfer-panel__security']}>
        <div className={styles['transfer-panel__account-summary']}>
          <ShieldCheck className={styles['transfer-panel__security-icon']} />
          <p className={styles['transfer-panel__security-copy']}>
            {t('fundsVerified')}
          </p>
        </div>
        <button
          className={`${styles['transfer-panel__submit']} ui-lift`}
          disabled
          type="button"
        >
          {t('sendTransfer')}
        </button>
      </div>
    </>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className={styles['transfer-panel__field']}>
      <span className={styles['transfer-panel__label']}>{label}</span>
      {children}
    </label>
  )
}
