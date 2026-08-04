import { useCallback } from 'react'

import { translations, type TranslationKey } from './translations'

export function useI18n() {
  const dictionary = translations.en
  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => {
      const message: string = dictionary[key] ?? translations.en[key]

      if (!values) return message

      return Object.entries(values).reduce(
        (result, [name, value]) =>
          result.replaceAll(`{${name}}`, String(value)),
        message,
      )
    },
    [dictionary],
  )

  return {
    t,
  }
}
