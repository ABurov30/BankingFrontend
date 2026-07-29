import { useCallback } from 'react'

import { useAppSelector } from '@/app/hooks'
import { translations, type TranslationKey } from './translations'

export function useI18n() {
  const language = useAppSelector((state) => state.app.language)
  const dictionary = translations[language]
  const t = useCallback(
    (key: TranslationKey) => dictionary[key] ?? translations.en[key],
    [dictionary],
  )

  return {
    language,
    t,
  }
}
