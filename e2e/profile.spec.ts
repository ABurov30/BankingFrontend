import { expect, test } from '@playwright/test'

import { clickNavigation, signIn } from './helpers'

test('user can switch profile theme preferences', async ({ page }) => {
  await signIn(page)
  await clickNavigation(page, 'profile')
  await expect(page.getByTestId('page-profile')).toBeVisible()
  await expect(page.getByTestId('profile-preferences')).toBeVisible()

  await page.getByTestId('profile-preference-dark').click()
  expect(
    await page
      .getByTestId('page-profile')
      .evaluate(() => document.documentElement.classList.contains('dark')),
  ).toBe(true)
  await page.getByTestId('profile-preference-light').click()
  expect(
    await page
      .getByTestId('page-profile')
      .evaluate(() => document.documentElement.classList.contains('dark')),
  ).toBe(false)
})
