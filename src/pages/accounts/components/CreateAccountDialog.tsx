import { X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'

import {
  AccountCurrency,
  AccountType,
  accountCurrencyOptions,
  accountTypeOptions,
  type AccountCurrency as AccountCurrencyValue,
  type AccountType as AccountTypeValue,
} from '@/shared/api/enums'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { DropdownField } from './DropdownField'
import type { CreateAccountFormValues } from './types'

export function CreateAccountDialog({
  isCreatingAccount,
  onClose,
  onSubmit,
}: {
  isCreatingAccount: boolean
  onClose: () => void
  onSubmit: (values: CreateAccountFormValues) => void
}) {
  const { t } = useI18n()
  const [openDropdown, setOpenDropdown] = useState<
    keyof CreateAccountFormValues | null
  >(null)
  const { handleSubmit, register, setValue, watch } =
    useForm<CreateAccountFormValues>({
      defaultValues: {
        currency: AccountCurrency.USD,
        type: AccountType.CHECKING,
      },
    })
  const selectedType = watch('type')
  const selectedCurrency = watch('currency')

  const selectAccountType = (value: AccountTypeValue) => {
    setValue('type', value, { shouldDirty: true, shouldValidate: true })
    setOpenDropdown(null)
  }

  const selectAccountCurrency = (value: AccountCurrencyValue) => {
    setValue('currency', value, { shouldDirty: true, shouldValidate: true })
    setOpenDropdown(null)
  }

  return createPortal(
    <div className={styles['accounts__dialog-backdrop']}>
      <form
        className={`${styles['accounts__dialog']} ui-lift`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" {...register('type')} />
        <input type="hidden" {...register('currency')} />

        <header className={styles['accounts__dialog-header']}>
          <div>
            <h2 className={styles['accounts__dialog-title']}>
              {t('newAccount')}
            </h2>
            <p className={styles['accounts__dialog-subtitle']}>
              {t('selectAccountTypeCurrency')}
            </p>
          </div>
          <button
            aria-label="Close account form"
            className={styles['accounts__dialog-close']}
            onClick={onClose}
            type="button"
          >
            <X className={styles['accounts__icon']} />
          </button>
        </header>

        <DropdownField
          isOpen={openDropdown === 'type'}
          label={t('type')}
          onOpenChange={() =>
            setOpenDropdown((value) => (value === 'type' ? null : 'type'))
          }
          onSelect={selectAccountType}
          options={accountTypeOptions}
          value={selectedType}
        />

        <DropdownField
          isOpen={openDropdown === 'currency'}
          label={t('currency')}
          onOpenChange={() =>
            setOpenDropdown((value) =>
              value === 'currency' ? null : 'currency',
            )
          }
          onSelect={selectAccountCurrency}
          options={accountCurrencyOptions}
          value={selectedCurrency}
        />

        <div className={styles['accounts__dialog-actions']}>
          <button
            className={styles['accounts__dialog-secondary']}
            onClick={onClose}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['accounts__dialog-primary']}
            disabled={isCreatingAccount}
            type="submit"
          >
            {isCreatingAccount ? t('creatingAccount') : t('createAccount')}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
