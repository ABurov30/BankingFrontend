import { expect, test } from '@playwright/test'
import { signIn } from './helpers'

test('transfer wizard exposes own operations and validates recipient', async ({
  page,
}) => {
  await signIn(page)
  await page.getByTestId('dashboard-transfer-button').click()
  await page.getByTestId('transfer-operation-own').click()
  for (const operation of ['top-up', 'withdraw', 'between']) {
    await page.getByTestId(`transfer-operation-${operation}`).click()
    await expect(page.getByTestId('transfer-amount')).toBeVisible()
    await expect(
      page.getByTestId(
        operation === 'between'
          ? 'transfer-source-card'
          : 'transfer-source-account',
      ),
    ).toBeVisible()
    await page.getByTestId('transfer-back').click()
  }
  await page.getByTestId('transfer-back').click()
  await page.getByTestId('transfer-operation-recipient').click()
  await page.getByTestId('transfer-recipient-search').click()
  await expect(page.getByTestId('transfer-recipient-error')).toHaveText(
    'Enter the recipient email.',
  )
  await page.getByTestId('transfer-recipient-email').fill('invalid-email')
  await page.getByTestId('transfer-recipient-search').click()
  await expect(page.getByTestId('transfer-recipient-error')).toBeVisible()
  await page.getByTestId('transfer-header-close').click()
  await expect(page.getByTestId('transfer-panel')).toHaveCount(0)
})
