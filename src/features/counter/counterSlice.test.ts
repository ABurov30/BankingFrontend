import { describe, expect, it } from 'vitest'

import reducer, {
  decrement,
  increment,
  incrementByAmount,
} from './counterSlice'

describe('counterSlice', () => {
  it('updates the counter value', () => {
    let state = reducer(undefined, increment())
    state = reducer(state, incrementByAmount(4))
    state = reducer(state, decrement())

    expect(state.value).toBe(4)
  })
})
