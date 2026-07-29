import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { PageLoader } from './components/PageLoader'
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import { GuestLayout } from './layouts/GuestLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'

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
const UserVerifyPage = lazy(() => import('./pages/user-verify/UserVerifyPage'))

function App() {
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
