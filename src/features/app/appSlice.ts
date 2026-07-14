import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AppThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

type AppState = {
  resolvedTheme: ResolvedTheme
  themeMode: AppThemeMode
}

const getInitialResolvedTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const initialState: AppState = {
  resolvedTheme: getInitialResolvedTheme(),
  themeMode: 'system',
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
      if (action.payload !== 'system') {
        state.resolvedTheme = action.payload
      }
    },
  },
})

export const { setResolvedTheme, setThemeMode } = appSlice.actions
export default appSlice.reducer
