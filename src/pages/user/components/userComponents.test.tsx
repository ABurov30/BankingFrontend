import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { PersonalInformationCard } from './PersonalInformationCard'
import { ProfileHeader } from './ProfileHeader'
import { PreferenceSegment } from './settings/PreferenceSegment'
import { PasswordStrengthMeter } from './settings/PasswordStrengthMeter'
import { PreferencesCard } from './settings/PreferencesCard'
import { PasswordField } from './settings/PasswordField'
import { SecurityCard } from './settings/SecurityCard'
import { getPasswordStrength } from './settings/passwordStrength'

describe('profile components', () => {
  it('renders loading and populated profile header', () => {
    renderWithProviders(
      <>
        <ProfileHeader
          displayName="Ada Lovelace"
          email="ada@example.com"
          initials="AL"
          isLoading={false}
          status="ACTIVE"
        />
        <ProfileHeader displayName="" initials="" isLoading />
      </>,
    )

    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getAllByText('ada@example.com').length).toBeGreaterThan(0)
    expect(screen.getByText('ACTIVE')).toBeTruthy()
  })

  it('renders personal information and loading placeholders', () => {
    renderWithProviders(
      <>
        <PersonalInformationCard
          personalInfo={[{ label: 'Email', value: 'ada@example.com' }]}
        />
        <PersonalInformationCard isLoading personalInfo={[]} />
      </>,
    )

    expect(screen.getAllByText('Personal information').length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByText('ada@example.com').length).toBeGreaterThan(0)
    expect(
      document.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThan(0)
  })

  it('changes preference segments and theme', () => {
    const onChange = vi.fn()
    renderWithProviders(
      <>
        <PreferenceSegment
          label="Theme"
          onChange={onChange}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          value="light"
        />
        <PreferencesCard />
      </>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Dark' })[0])
    expect(onChange).toHaveBeenCalledWith('dark')
  })

  it('renders password strength meter', () => {
    renderWithProviders(
      <PasswordStrengthMeter
        strength={{
          colorClassName: 'strong',
          label: 'Strong',
          score: 4,
        }}
      />,
    )

    expect(screen.getByText('Strong')).toBeTruthy()
  })

  it('covers password rules, field visibility, and security validation', async () => {
    const registration = {
      name: 'password',
      onBlur: vi.fn(),
      onChange: vi.fn(),
      ref: vi.fn(),
    }
    renderWithProviders(
      <>
        <PasswordField
          isVisible={false}
          label="Password"
          onToggleVisibility={vi.fn()}
          registration={registration}
          toggleLabel="Show password"
        />
        <PasswordField
          isVisible
          label="Visible password"
          onToggleVisibility={vi.fn()}
          registration={registration}
          toggleLabel="Hide password"
        />
        <SecurityCard />
      </>,
    )

    expect(getPasswordStrength('', { empty: 'Empty', fair: 'Fair', good: 'Good', strong: 'Strong', weak: 'Weak' }).score).toBe(0)
    expect(getPasswordStrength('a', { empty: 'Empty', fair: 'Fair', good: 'Good', strong: 'Strong', weak: 'Weak' }).score).toBe(1)
    expect(screen.getAllByRole('button', { name: 'Show password' }).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole('button', { name: 'Change password' })[0])
    await waitFor(() =>
      expect(screen.getByText('Current password is required.')).toBeTruthy(),
    )
  })
})
