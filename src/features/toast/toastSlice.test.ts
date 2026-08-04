import { describe, expect, it } from 'vitest'

import reducer, { dismissToast, showToast } from './toastSlice'

describe('toastSlice', () => {
  it('adds a toast with defaults and dismisses it', () => {
    const state = reducer(undefined, showToast({ message: 'Saved' }))

    expect(state.items[0]).toMatchObject({
      message: 'Saved',
      title: 'Request failed',
      variant: 'error',
    })
    expect(reducer(state, dismissToast(state.items[0].id)).items).toEqual([])
  })

  it('retains only four most recent messages', () => {
    let state = reducer(undefined, { type: 'unknown' })
    for (let index = 0; index < 5; index += 1) {
      state = reducer(state, showToast({ message: String(index) }))
    }

    expect(state.items).toHaveLength(4)
    expect(state.items[0].message).toBe('4')
  })
})
