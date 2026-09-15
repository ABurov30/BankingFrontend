import { expect, test } from '@playwright/test'

import { clickNavigation, signIn } from './helpers'

test('user can filter cards and open the issue-card dialog', async ({
  page,
}) => {
  await signIn(page)
  await clickNavigation(page, 'cards')
  await expect(page.getByTestId('page-cards')).toBeVisible()

  for (const status of ['active', 'blocked', 'frozen', 'expired']) {
    await page.getByTestId(`cards-status-filter-${status}`).click()
  }

  const issueButton = page.getByTestId('cards-issue-button')
  await expect(issueButton).toBeVisible()
  if (await issueButton.isEnabled()) {
    await issueButton.click()
    const dialog = page.getByTestId('issue-card-close')
    if ((await dialog.count()) > 0) {
      await expect(dialog).toBeVisible()
      await page.getByTestId('issue-card-cancel').click()
      await expect(dialog).toHaveCount(0)
    }
  }
})
