import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import { GuestLayout } from './layouts/GuestLayout'

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

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Route>

        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function PageLoader() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-5 text-foreground">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </main>
  )
}

export default App
