import { describe, expect, it } from 'vitest'

import { parseNotificationEvent } from './notificationEvent'

describe('parseNotificationEvent', () => {
  it('preserves the typed notification payload and event identifier', () => {
    expect(
      parseNotificationEvent({
        body: 'Your account was frozen',
        eventId: 'event-1',
        title: 'Account frozen',
      }),
    ).toEqual({
      eventId: 'event-1',
      notification: {
        body: 'Your account was frozen',
        title: 'Account frozen',
      },
      shouldRefreshAccounts: true,
      shouldRefreshTransactions: false,
    })
  })

  it('keeps equal-looking events distinct when the backend sends no identifier', () => {
    const first = parseNotificationEvent({
      body: 'Card frozen',
      title: 'Card frozen',
    })
    const second = parseNotificationEvent({
      body: 'Card frozen',
      title: 'Card frozen',
    })

    expect(first.eventId).toBeUndefined()
    expect(second.eventId).toBeUndefined()
    expect(first.notification).toEqual(second.notification)
    expect(first).toMatchObject({
      shouldRefreshAccounts: true,
      shouldRefreshTransactions: false,
    })
    expect(second).toMatchObject({
      shouldRefreshAccounts: true,
      shouldRefreshTransactions: false,
    })
  })

  it('supports plain-text messages while producing a renderable notification', () => {
    expect(parseNotificationEvent('Connection restored')).toEqual({
      eventId: undefined,
      notification: {
        body: 'Connection restored',
        title: 'Notification',
      },
      shouldRefreshAccounts: false,
      shouldRefreshTransactions: false,
    })
  })

  it.each([
    'ACCOUNT_CREATED',
    'ACCOUNT_FROZEN',
    'ACCOUNT_UNFROZEN',
    'CARD_CREATED',
    'CARD_FROZEN',
    'CARD_UNFROZEN',
    'TRANSACTION_FAILED',
    'TRANSACTION_COMPLETED',
    'TRANSACTION_RECEIVED',
    'Funds received',
  ])('marks %s events for an account refresh', (eventType) => {
    expect(
      parseNotificationEvent({
        body: 'Your account balance has changed',
        title: eventType,
      }).shouldRefreshAccounts,
    ).toBe(true)
  })

  it.each([
    'TRANSACTION_FAILED',
    'TRANSACTION_COMPLETED',
    'TRANSACTION_RECEIVED',
  ])('marks %s events for a transaction refresh', (eventType) => {
    expect(
      parseNotificationEvent({
        body: 'Your transaction state has changed',
        notificationType: eventType,
      }).shouldRefreshTransactions,
    ).toBe(true)
  })
})
