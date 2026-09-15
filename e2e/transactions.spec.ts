import { expect, test } from '@playwright/test'

import { clickNavigation, signIn } from './helpers'

test('user can filter transactions and start a new transfer', async ({
  page,
}) => {
  await signIn(page)
  await clickNavigation(page, 'transactions')
  await expect(page.getByTestId('page-transactions')).toBeVisible()

  for (const status of [
    'all',
    'created',
    'validated',
    'authorized',
    'completed',
    'declined',
    'cancelled',
  ]) {
    await page.getByTestId(`transaction-filter-${status}`).click()
  }

  await page.getByTestId('transactions-date-filter').click()
  await page.getByTestId('transactions-new-transfer').click()
  await expect(page.getByTestId('transfer-panel')).toBeVisible()
  await page.getByTestId('transfer-panel-close').click()
  await expect(page.getByTestId('transfer-panel')).toHaveCount(0)
})
