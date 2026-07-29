export { formatMoney } from '@/lib/formatMoney'

export function getAccountName(type?: string) {
  if (!type) {
    return 'Account'
  }

  return `${type.charAt(0)}${type.slice(1).toLowerCase()} account`
}
