import {
  AccountCurrency,
  type AccountCurrency as AccountCurrencyValue,
} from '@/shared/api/enums'

const numberFormatters = new Map<string, Intl.NumberFormat>()
const currencySymbols = {
  [AccountCurrency.CNY]: '¥',
  [AccountCurrency.EUR]: '€',
  [AccountCurrency.GBP]: '£',
  [AccountCurrency.USD]: '$',
} as const satisfies Record<AccountCurrencyValue, string>

export function formatMoney(
  value = 0,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const formatter = getNumberFormatter(currency)
  return `${formatCurrencySymbol(currency)} ${formatter.format(value)}`
}

export function formatCurrencySymbol(
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  return currencySymbols[currency]
}

function getNumberFormatter(currency: AccountCurrencyValue) {
  const cachedFormatter = numberFormatters.get(currency)

  if (cachedFormatter) {
    return cachedFormatter
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
  numberFormatters.set(currency, formatter)

  return formatter
}
