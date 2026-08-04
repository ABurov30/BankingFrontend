import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('appSlice', () => {
  beforeEach(() => {
    vi.resetModules()
    window.localStorage.clear()
  })

  it('uses persisted theme preferences and persists explicit updates', async () => {
    window.localStorage.setItem('buro.themeMode', 'dark')
    const module = await import('./appSlice')
    let state = module.default(undefined, { type: 'init' })

    expect(state).toMatchObject({
      resolvedTheme: 'dark',
      themeMode: 'dark',
    })

    state = module.default(state, module.setThemeMode('light'))
    state = module.default(state, module.setResolvedTheme('dark'))

    expect(state).toMatchObject({
      resolvedTheme: 'dark',
      themeMode: 'light',
    })
    expect(window.localStorage.getItem('buro.themeMode')).toBe('light')
  })

  it('falls back to system preferences for invalid persisted values', async () => {
    window.localStorage.setItem('buro.themeMode', 'invalid')
    const { default: reducer } = await import('./appSlice')

    expect(reducer(undefined, { type: 'init' })).toMatchObject({
      resolvedTheme: 'light',
      themeMode: 'system',
    })
  })
})
