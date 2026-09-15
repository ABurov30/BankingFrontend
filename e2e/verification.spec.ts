import { expect, test } from '@playwright/test'

test('guest sees verification failure when required parameters are missing', async ({
  page,
}) => {
  await page.goto('/user-verify')
  await expect(page.getByTestId('user-verify-panel')).toBeVisible()
  await expect(page.getByTestId('user-verify-panel')).toContainText(
    'Verification failed',
  )
})
