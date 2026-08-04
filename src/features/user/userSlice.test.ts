import { describe, expect, it } from 'vitest'

import reducer, { clearCurrentUser, setCurrentUser } from './userSlice'

describe('userSlice', () => {
  it('sets and clears the current user', () => {
    const user = {
      authUserId: 'auth-1',
      email: 'user@example.test',
      firstName: 'Buro',
      role: 'USER' as const,
    }
    const loaded = reducer(undefined, setCurrentUser(user))

    expect(loaded.currentUser).toEqual(user)
    expect(reducer(loaded, clearCurrentUser()).currentUser).toBeNull()
  })
})
