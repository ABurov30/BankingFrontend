import {
  AccountCurrency,
  AccountCurrencyMinorUnit,
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
  minorUnits = 0,
  currency: AccountCurrencyValue = AccountCurrency.USD,
) {
  const formatter = getNumberFormatter(currency)
  const amount = minorUnits / 10 ** getCurrencyMinorUnit(currency)

  return `${formatCurrencySymbol(currency)} ${formatter.format(amount)}`
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

  const minorUnit = getCurrencyMinorUnit(currency)
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: minorUnit,
    minimumFractionDigits: minorUnit,
  })
  numberFormatters.set(currency, formatter)

  return formatter
}

export function getCurrencyMinorUnit(
  currency: AccountCurrencyValue = AccountCurrency.USD,
): number {
  return AccountCurrencyMinorUnit[currency]
}
