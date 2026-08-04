import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ActivityCard } from './dashboard/components/ActivityCard'
import { NotificationsCard } from './dashboard/components/NotificationsCard'
import { SpendingCard } from './dashboard/components/SpendingCard'
import { LoginHero } from './login/components/LoginHero'
import { NotFoundContent } from './not-found/components/NotFoundContent'
import { NotificationsEmptyCard } from './notifications/components/NotificationsEmptyCard'
import { SignupHero } from './signup/components/SignupHero'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('static page components', () => {
  it('renders dashboard empty states', () => {
    renderWithProviders(
      <>
        <ActivityCard />
        <SpendingCard />
        <NotificationsCard />
      </>,
    )

    expect(screen.getByText('Recent activity')).toBeTruthy()
    expect(screen.getByText('Spending this week')).toBeTruthy()
    expect(screen.getByText('Notifications')).toBeTruthy()
  })

  it('renders public and empty-state content', () => {
    renderWithProviders(
      <>
        <LoginHero />
        <SignupHero />
        <NotificationsEmptyCard />
        <NotFoundContent />
      </>,
    )

    expect(screen.getAllByText('buro')).toHaveLength(3)
    expect(screen.getByText('404')).toBeTruthy()
  })
})
