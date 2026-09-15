import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { store } from '@/app/store'
import { clearCurrentUser, setCurrentUser } from '@/features/user/userSlice'
import { renderWithProviders } from '@/test/renderWithProviders'
import App from '@/App'
import { RoleRoute } from './RoleRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { Sidebar } from '@/components/Sidebar'
import { BottomNavigation } from '@/components/BottomNavigation'
import type { UserInfo } from '@/shared/api/types'
const query = vi.hoisted(() => ({
  data: undefined as UserInfo | undefined,
  error: undefined as unknown,
  isLoading: false,
}))
vi.mock('@/shared/api/userApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/userApi')>()),
  useGetUserInfoQuery: () => query,
}))
vi.mock('@/features/notifications/useNotificationsWebSocket', () => ({
  useNotificationsWebSocket: vi.fn(),
}))
beforeEach(() => {
  store.dispatch(clearCurrentUser())
  query.data = undefined
  query.error = undefined
  query.isLoading = false
})
afterEach(cleanup)
it('renders public and unknown routes through the real app router', async () => {
  const view = renderWithProviders(<App />, '/login')
  expect(await screen.findByTestId('login-submit')).toBeTruthy()
  view.unmount()
  renderWithProviders(<App />, '/does-not-exist')
  expect(await screen.findByText('404')).toBeTruthy()
})
it('rejects unauthorized sessions and restores a successfully loaded user', async () => {
  query.error = { status: 401 }
  const view = renderWithProviders(
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<p>Private</p>} />
      </Route>
      <Route path="/login" element={<p>Sign in here</p>} />
    </Routes>,
  )
  expect(await screen.findByText('Sign in here')).toBeTruthy()
  view.unmount()
  query.error = undefined
  query.data = { email: 'restored@example.test', role: 'USER' }
  renderWithProviders(
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<p>Private</p>} />
      </Route>
    </Routes>,
  )
  await waitFor(() =>
    expect(store.getState().user.currentUser?.email).toBe(
      'restored@example.test',
    ),
  )
  expect(screen.getByText('Private')).toBeTruthy()
})
it('shows loader while recovering a session', () => {
  query.isLoading = true
  const view = renderWithProviders(<ProtectedRoute />)
  expect(view.container.querySelector('main')).toBeTruthy()
  expect(screen.getByText('buro')).toBeTruthy()
})
it('only renders role-protected content for an allowed role', () => {
  const ui = (
    <Routes>
      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/" element={<p>Admin only</p>} />
      </Route>
    </Routes>
  )
  const view = renderWithProviders(ui)
  expect(screen.queryByText('Admin only')).toBeNull()
  view.unmount()
  store.dispatch(setCurrentUser({ role: 'ADMIN' }))
  renderWithProviders(ui)
  expect(screen.getByText('Admin only')).toBeTruthy()
})
it('navigates with stable sidebar and mobile IDs', () => {
  const close = vi.fn()
  renderWithProviders(
    <>
      <Sidebar isOpen onClose={close} />
      <BottomNavigation />
    </>,
  )
  fireEvent.click(screen.getByTestId('sidebar-nav-accounts'))
  expect(close).toHaveBeenCalledOnce()
  expect(
    screen.getByTestId('sidebar-nav-accounts').getAttribute('aria-current'),
  ).toBe('page')
  fireEvent.click(screen.getByTestId('bottom-nav-profile'))
  expect(
    screen.getByTestId('bottom-nav-profile').getAttribute('aria-current'),
  ).toBe('page')
})
