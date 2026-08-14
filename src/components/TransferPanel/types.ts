import type { useI18n } from '@/shared/i18n/useI18n'
import type {
  GetAccountResponseDto,
  GetUserInfoResponseDto,
} from '@/shared/api/types'

export type PanelOperation =
  'TOP_UP' | 'WITHDRAW' | 'BETWEEN_OWN_ACCOUNTS' | 'TO_ANOTHER_USER'

export type TransferStage = 'TARGET' | 'OWN_OPERATION' | 'FORM'

export type AccountMenu = 'source' | 'destination' | 'recipient' | null

export type TransferFormValues = {
  amount: string
  destinationAccountId: string
  email: string
  recipientAccountId: string
  sourceAccountId: string
}

export type TransferConfirmation = {
  amount: number
  destinationAccount: GetAccountResponseDto
  idempotencyKey: string
  recipient?: GetUserInfoResponseDto
  sourceAccount: GetAccountResponseDto
}

export type TranslationFunction = ReturnType<typeof useI18n>['t']
