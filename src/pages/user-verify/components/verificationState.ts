import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  type LucideIcon,
} from 'lucide-react'
import type { TranslationKey } from '@/shared/i18n/translations'

type VerificationState = {
  icon: LucideIcon
  messageKey: TranslationKey
  titleKey: TranslationKey
  variant: 'error' | 'loading' | 'success'
}

export function getVerificationState({
  hasRequiredParams,
  isError,
  isLoading,
  isSuccess,
}: {
  hasRequiredParams: boolean
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}): VerificationState {
  if (!hasRequiredParams) {
    return {
      icon: CircleAlert,
      messageKey: 'verificationFailed' satisfies TranslationKey,
      titleKey: 'verificationFailed' satisfies TranslationKey,
      variant: 'error' as const,
    }
  }

  if (isSuccess) {
    return {
      icon: CheckCircle2,
      messageKey: 'verificationSuccess' satisfies TranslationKey,
      titleKey: 'verificationEmailVerified' satisfies TranslationKey,
      variant: 'success' as const,
    }
  }

  if (isError) {
    return {
      icon: CircleAlert,
      messageKey: 'verificationFailed' satisfies TranslationKey,
      titleKey: 'verificationFailed' satisfies TranslationKey,
      variant: 'error' as const,
    }
  }

  return {
    icon: LoaderCircle,
    messageKey: isLoading
      ? ('confirmEmail' satisfies TranslationKey)
      : ('pending' satisfies TranslationKey),
    titleKey: 'confirmEmail' satisfies TranslationKey,
    variant: 'loading' as const,
  }
}
