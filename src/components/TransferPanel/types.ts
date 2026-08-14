import type { useI18n } from '@/shared/i18n/useI18n'
import type {
  GetAccountResponseDto,
  GetCardByAccountIdResponseDto,
  GetUserInfoResponseDto,
} from '@/shared/api/types'

export type PanelOperation =
  'TOP_UP' | 'WITHDRAW' | 'BETWEEN_OWN_ACCOUNTS' | 'TO_ANOTHER_USER'

export type TransferStage = 'TARGET' | 'OWN_OPERATION' | 'FORM'

export type AccountMenu =
  'source' | 'sourceCard' | 'destination' | 'recipient' | null

export type TransferFormValues = {
  amount: string
  destinationAccountId: string
  email: string
  recipientAccountId: string
  sourceAccountId: string
  sourceCardId: string
}

export type TransferConfirmation = {
  amount: number
  destinationAccount: GetAccountResponseDto
  idempotencyKey: string
  recipient?: GetUserInfoResponseDto
  sourceAccount: GetAccountResponseDto
  sourceCard: GetCardByAccountIdResponseDto
  sourceCardId: string
}

export type TransferSourceCardOption = {
  account: GetAccountResponseDto
  card: GetCardByAccountIdResponseDto
}

export type TranslationFunction = ReturnType<typeof useI18n>['t']
