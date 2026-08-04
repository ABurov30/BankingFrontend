import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AppThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

type AppState = {
  resolvedTheme: ResolvedTheme
  themeMode: AppThemeMode
}

const themeStorageKey = 'buro.themeMode'

const isThemeMode = (value: unknown): value is AppThemeMode =>
  value === 'system' || value === 'light' || value === 'dark'

const getStoredThemeMode = (): AppThemeMode => {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const value = window.localStorage.getItem(themeStorageKey)
  return isThemeMode(value) ? value : 'system'
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
  resolvedTheme: getResolvedTheme(initialThemeMode),
  themeMode: initialThemeMode,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
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

export const { setResolvedTheme, setThemeMode } = appSlice.actions
export default appSlice.reducer
