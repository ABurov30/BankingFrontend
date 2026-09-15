import { expect, type Page } from '@playwright/test'

export async function signIn(page: Page) {
  const email =
    process.env.E2E_USER_EMAIL || process.env.AUTH_BOOTSTRAP_ADMIN_EMAIL
  const password =
    process.env.E2E_USER_PASSWORD || process.env.AUTH_BOOTSTRAP_ADMIN_PASSWORD
  if (!email || !password)
    throw new Error(
      'Set E2E_USER_EMAIL/E2E_USER_PASSWORD or AUTH_BOOTSTRAP_ADMIN_EMAIL/AUTH_BOOTSTRAP_ADMIN_PASSWORD in .env',
    )

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto('/login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    const response = page.waitForResponse(
      (result) =>
        result.url().endsWith('/auth/login') &&
        result.request().method() === 'POST',
    )
    await page.getByTestId('login-submit').click()
    if ((await response).status() === 200) {
      await expect(page.getByTestId('page-dashboard')).toBeVisible()
      await expect(page).toHaveURL(/\/$/)
      return
    }
    await page.waitForTimeout(500)
  }

  throw new Error('Backend login returned 503 three times')
}

export async function clickNavigation(page: Page, item: string) {
  await page
    .getByTestId(`sidebar-nav-${item}`)
    .or(page.getByTestId(`bottom-nav-${item}`))
    .filter({ visible: true })
    .first()
    .click()
}
