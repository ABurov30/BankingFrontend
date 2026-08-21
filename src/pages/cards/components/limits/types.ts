import type { useI18n } from '@/shared/i18n/useI18n'

export type LimitsFormValues = {
  dailyLimit: string
  monthlyLimit: string
}

export type LimitsTranslationFunction = ReturnType<typeof useI18n>['t']
