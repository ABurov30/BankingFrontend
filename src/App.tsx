import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { PageLoader } from './components/PageLoader'
import { useNotificationsWebSocket } from './features/notifications/useNotificationsWebSocket'
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import { GuestLayout } from './layouts/GuestLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { Role } from './shared/api/enums'

const AccountsPage = lazy(() => import('./pages/accounts/AccountsPage'))
const CardsPage = lazy(() => import('./pages/cards/CardsPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const LoginPage = lazy(() => import('./pages/login/LoginPage'))
const NotificationsPage = lazy(
  () => import('./pages/notifications/NotificationsPage'),
)
const NotFoundPage = lazy(() => import('./pages/not-found/NotFoundPage'))
const SignupPage = lazy(() => import('./pages/signup/SignupPage'))
const TransactionsPage = lazy(
  () => import('./pages/transactions/TransactionsPage'),
)
const UserPage = lazy(() => import('./pages/user/UserPage'))
const UserDetailsPage = lazy(
  () => import('./pages/user-details/UserDetailsPage'),
)
const UserVerifyPage = lazy(() => import('./pages/user-verify/UserVerifyPage'))
const UsersPage = lazy(() => import('./pages/users/UsersPage'))
const HealthPage = lazy(() => import('./pages/health/HealthPage'))

function App() {
  useNotificationsWebSocket()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route
              element={<RoleRoute allowedRoles={[Role.MANAGER, Role.ADMIN]} />}
            >
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:authUserId" element={<UserDetailsPage />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
              <Route path="/health" element={<HealthPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user-verify" element={<UserVerifyPage />} />
          <Route
            path="/user-verify/:authUserId/:verificationCode"
            element={<UserVerifyPage />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
