import { describe, expect, it } from 'vitest'

import { getPasswordStrength } from './passwordStrength'

const labels = {
  empty: 'Empty',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
  weak: 'Weak',
}

describe('getPasswordStrength', () => {
  it('reports the empty state', () => {
    expect(getPasswordStrength('', labels)).toMatchObject({
      label: 'Empty',
      score: 0,
    })
  })

  it('grades weak and strong passwords', () => {
    expect(getPasswordStrength('short', labels)).toMatchObject({
      label: 'Weak',
      score: 1,
    })
    expect(getPasswordStrength('StrongPassword!42', labels)).toMatchObject({
      label: 'Strong',
      score: 4,
    })
  })
})
