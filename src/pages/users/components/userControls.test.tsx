import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthUserStatus, Role } from '@/shared/api/enums'
import { renderWithProviders } from '@/test/renderWithProviders'
import { BlockUserDialog } from './BlockUserDialog'
import { RoleSelect } from './RoleSelect'
import { UserStatusSelect } from './UserStatusSelect'
import { UserVerificationSelect } from './UserVerificationSelect'
import { UsersTable } from './UsersTable'

afterEach(cleanup)

describe('user management controls', () => {
  it('selects roles and statuses', async () => {
    const onRole = vi.fn()
    const onStatus = vi.fn().mockResolvedValue(undefined)
    renderWithProviders(
      <>
        <RoleSelect disabled={false} onChange={onRole} value={Role.USER} />
        <UserStatusSelect disabled={false} onChange={onStatus} value={AuthUserStatus.ACTIVE} />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'USER' }))
    fireEvent.click(screen.getByRole('option', { name: 'ADMIN' }))
    fireEvent.click(screen.getByRole('button', { name: 'ACTIVE' }))
    fireEvent.click(screen.getByRole('option', { name: 'BLOCKED' }))
    expect(onRole).toHaveBeenCalledWith(Role.ADMIN)
    expect(onStatus).toHaveBeenCalledWith(AuthUserStatus.BLOCKED)
  })

  it('verifies pending users and renders table empty/loading branches', async () => {
    const onVerify = vi.fn().mockResolvedValue(undefined)
    renderWithProviders(
      <>
        <UserVerificationSelect disabled={false} isPending onVerify={onVerify} />
        <UsersTable currentRole={Role.USER} isLoading={false} isMutating={false} onChangeRole={vi.fn()} onStatusChange={vi.fn()} onVerify={vi.fn()} users={[]} />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Pending' }))
    fireEvent.click(screen.getByRole('option', { name: 'VERIFIED' }))
    expect(onVerify).toHaveBeenCalled()
    expect(screen.getByText('No users found.')).toBeTruthy()
  })

  it('renders blocking dialog and action callbacks', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()
    renderWithProviders(
      <BlockUserDialog
        isBlocking={false}
        onClose={onClose}
        onConfirm={onConfirm}
        user={{ email: 'ada@example.com', firstName: 'Ada', lastName: 'Lovelace' } as never}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Block user' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onConfirm).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
