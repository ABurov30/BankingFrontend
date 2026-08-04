import { describe, expect, it } from 'vitest'

import reducer, { closeRightPanel, openRightPanel } from './rightPanelSlice'

describe('rightPanelSlice', () => {
  it('opens and closes transfer content', () => {
    const opened = reducer(undefined, openRightPanel('transfer'))
    expect(opened.content).toBe('transfer')
    expect(reducer(opened, closeRightPanel()).content).toBeNull()
  })
})
