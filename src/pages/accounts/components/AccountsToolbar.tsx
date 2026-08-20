import {
  accountCurrencyOptions,
  accountStatusOptions,
  accountTypeOptions,
} from '@/shared/api/enums'
import { formatCurrencySymbol } from '@/lib/formatMoney'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'
import { FilterButton } from './FilterButton'
import type {
  AccountCurrencyFilter,
  AccountFilters,
  AccountStatusFilter,
  AccountTypeFilter,
} from './types'

const accountStatusFilterOptions: AccountStatusFilter[] = [
  'ALL',
  ...accountStatusOptions,
]
const accountTypeFilterOptions: AccountTypeFilter[] = [
  'ALL',
  ...accountTypeOptions,
]
const accountCurrencyFilterOptions: AccountCurrencyFilter[] = [
  'ALL',
  ...accountCurrencyOptions,
]

export function AccountsToolbar({
  filters,
  onFiltersChange,
}: {
  filters: AccountFilters
  onFiltersChange: (filters: AccountFilters) => void
}) {
  const { t } = useI18n()

  return (
    <div className={styles['accounts__toolbar']}>
      <div className={styles['accounts__filters']}>
        <FilterButton
          label={t('status')}
          onSelect={(status) => onFiltersChange({ ...filters, status })}
          options={accountStatusFilterOptions}
          value={filters.status}
        />
        <FilterButton
          label={t('type')}
          onSelect={(type) => onFiltersChange({ ...filters, type })}
          options={accountTypeFilterOptions}
          value={filters.type}
        />
        <FilterButton
          label={t('currency')}
          onSelect={(currency) => onFiltersChange({ ...filters, currency })}
          options={accountCurrencyFilterOptions}
          renderOption={(currency) =>
            currency === 'ALL' ? t('all') : formatCurrencySymbol(currency)
          }
          value={filters.currency}
        />
      </div>
    </div>
  )
}
