import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from './hooks'
import { setResolvedTheme, type ResolvedTheme } from '@/features/app/appSlice'

const themeQuery = '(prefers-color-scheme: dark)'

const readSystemTheme = (): ResolvedTheme =>
  window.matchMedia(themeQuery).matches ? 'dark' : 'light'

export function AppTheme() {
  const dispatch = useAppDispatch()
  const { language, resolvedTheme, themeMode } = useAppSelector(
    (state) => state.app,
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    if (themeMode !== 'system') {
      return
    }

    const media = window.matchMedia(themeQuery)
    const syncTheme = () => dispatch(setResolvedTheme(readSystemTheme()))

    syncTheme()
    media.addEventListener('change', syncTheme)

    return () => media.removeEventListener('change', syncTheme)
  }, [dispatch, themeMode])

  return null
}
