import {
  AccountCurrency,
  type AccountCurrency as AccountCurrencyValue,
} from '@/shared/api/enums'

const numberFormatters = new Map<string, Intl.NumberFormat>()

export function formatMoney(
  value = 0,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const formatter = getNumberFormatter(currency)
  return `${currency} ${formatter.format(value)}`
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
