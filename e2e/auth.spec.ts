import { expect, test } from '@playwright/test'
import { signIn } from './helpers'

test('test user can sign in', async ({ page }) => {
  await signIn(page)
  await expect(page.getByTestId('page-dashboard')).toBeVisible()
})
