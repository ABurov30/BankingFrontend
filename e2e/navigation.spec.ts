import { expect, test } from '@playwright/test'

import { signIn } from './helpers'

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/accounts')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByTestId('login-email')).toBeVisible()
})

test('authenticated user can open the main sections', async ({ page }) => {
  await signIn(page)

  const sections = [
    { name: 'Accounts', path: '/accounts' },
    { name: 'Cards', path: '/cards' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Profile', path: '/profile' },
    { name: 'Dashboard', path: '/' },
  ]

  for (const section of sections) {
    await page
      .getByTestId(`sidebar-nav-${section.name.toLowerCase()}`)
      .or(page.getByTestId(`bottom-nav-${section.name.toLowerCase()}`))
      .filter({ visible: true })
      .first()
      .click()
    await expect(page).toHaveURL(
      new RegExp(`${section.path.replace('/', '\\/')}$`),
    )
    await expect(
      page.getByTestId(`page-${section.name.toLowerCase()}`),
    ).toBeVisible()
  }
})

test('authenticated user can log out', async ({ page }) => {
  await signIn(page)

  await page.getByTestId('profile-menu-button').click()
  await page.getByTestId('logout-menu-item').click()

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByTestId('login-email')).toBeVisible()
})

test('user can open and close account and transfer flows', async ({ page }) => {
  await signIn(page)

  await page.getByTestId('dashboard-transfer-button').click()
  await expect(page.getByTestId('transfer-panel')).toBeVisible()
  await page.getByTestId('transfer-panel-close').click()
  await expect(page.getByTestId('transfer-panel')).toHaveCount(0)

  await page
    .getByTestId('sidebar-nav-accounts')
    .or(page.getByTestId('bottom-nav-accounts'))
    .filter({ visible: true })
    .first()
    .click()
  await expect(page.getByTestId('page-accounts')).toBeVisible()
  await page.getByTestId('accounts-create-button').click()
  await expect(page.getByTestId('create-account-dialog')).toBeVisible()
  await page.getByTestId('create-account-close').click()
  await expect(page.getByTestId('create-account-dialog')).toHaveCount(0)
})
