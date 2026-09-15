import { describe, expect, it } from 'vitest'

import { emailPattern, getInitials, getUserName } from './utils'

describe('transfer panel user helpers', () => {
  it('validates email addresses', () => {
    expect(emailPattern.test('person@example.com')).toBe(true)
    expect(emailPattern.test('invalid-email')).toBe(false)
  })

  it('builds a full name or falls back to email and placeholder', () => {
    expect(
      getUserName({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      }),
    ).toBe('Ada Lovelace')
    expect(getUserName({ email: 'ada@example.com' })).toBe('ada@example.com')
    expect(getUserName({})).toBe('—')
  })

  it('builds initials from names or email', () => {
    expect(getInitials({ firstName: 'Ada', lastName: 'Lovelace' })).toBe('AL')
    expect(getInitials({ email: 'ada@example.com' })).toBe('A')
    expect(getInitials({})).toBe('?')
  })
})
