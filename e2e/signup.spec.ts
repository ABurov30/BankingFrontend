import { expect, test } from '@playwright/test'

test('guest can complete signup form fields and toggle password visibility', async ({
  page,
}) => {
  await page.goto('/signup')
  await expect(page.getByTestId('signup-first-name')).toBeVisible()
  await page.getByTestId('signup-first-name').fill('Ada')
  await page.getByTestId('signup-last-name').fill('Lovelace')
  await page.getByTestId('signup-email').fill('ada.e2e@example.test')
  await page.getByTestId('signup-password').fill('StrongPassword1!')
  await expect(page.getByTestId('signup-password')).toHaveAttribute(
    'type',
    'password',
  )
  await page.getByTestId('signup-password-toggle').click()
  await expect(page.getByTestId('signup-password')).toHaveAttribute(
    'type',
    'text',
  )
  await page.getByTestId('signup-terms-toggle').click()
  await expect(page.getByTestId('signup-submit')).toBeEnabled()
})
