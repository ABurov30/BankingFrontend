import { CardStatus } from '@/shared/api/enums'
import type { GetCardByAccountIdResponseDto } from '@/shared/api/types'

export type EditableCardStatus =
  | typeof CardStatus.ACTIVE
  | typeof CardStatus.BLOCKED
  | typeof CardStatus.FROZEN

export type CardStatusUpdateHandler = (
  card: GetCardByAccountIdResponseDto | undefined,
  status: EditableCardStatus,
) => void
