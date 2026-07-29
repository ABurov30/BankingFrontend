import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AppThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'
export type AppLanguage = 'en' | 'ru'

type AppState = {
  language: AppLanguage
  resolvedTheme: ResolvedTheme
  themeMode: AppThemeMode
}

const themeStorageKey = 'buro.themeMode'
const languageStorageKey = 'buro.language'

const isThemeMode = (value: unknown): value is AppThemeMode =>
  value === 'system' || value === 'light' || value === 'dark'

const isLanguage = (value: unknown): value is AppLanguage =>
  value === 'en' || value === 'ru'

const getStoredThemeMode = (): AppThemeMode => {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const value = window.localStorage.getItem(themeStorageKey)
  return isThemeMode(value) ? value : 'system'
}

const getStoredLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const value = window.localStorage.getItem(languageStorageKey)
  return isLanguage(value) ? value : 'en'
}

const getInitialResolvedTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const getResolvedTheme = (themeMode: AppThemeMode): ResolvedTheme => {
  if (themeMode === 'system') {
    return getInitialResolvedTheme()
  }

  return themeMode
}

const initialThemeMode = getStoredThemeMode()

const initialState: AppState = {
  language: getStoredLanguage(),
  resolvedTheme: getResolvedTheme(initialThemeMode),
  themeMode: initialThemeMode,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(languageStorageKey, action.payload)
      }
    },
    setResolvedTheme(state, action: PayloadAction<ResolvedTheme>) {
      state.resolvedTheme = action.payload
    },
    setThemeMode(state, action: PayloadAction<AppThemeMode>) {
      state.themeMode = action.payload
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(themeStorageKey, action.payload)
      }
      if (action.payload !== 'system') {
        state.resolvedTheme = action.payload
      }
    },
  },
})

export const { setLanguage, setResolvedTheme, setThemeMode } = appSlice.actions
export default appSlice.reducer
