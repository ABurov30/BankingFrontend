import { describe, expect, it } from 'vitest'

import { getNavigationItems } from './navigation'

describe('getNavigationItems', () => {
  it('does not expose manager navigation to a regular user', () => {
    expect(getNavigationItems('USER').map((item) => item.to)).not.toContain(
      '/users',
    )
    expect(getNavigationItems('USER').map((item) => item.to)).not.toContain(
      '/health',
    )
  })

  it('exposes users to managers and health only to administrators', () => {
    expect(getNavigationItems('MANAGER').map((item) => item.to)).toContain(
      '/users',
    )
    expect(getNavigationItems('MANAGER').map((item) => item.to)).not.toContain(
      '/health',
    )
    expect(getNavigationItems('ADMIN').map((item) => item.to)).toEqual(
      expect.arrayContaining(['/users', '/health']),
    )
  })
})
