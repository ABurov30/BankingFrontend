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
  })

  it('supports plain-text messages while producing a renderable notification', () => {
    expect(parseNotificationEvent('Connection restored')).toEqual({
      eventId: undefined,
      notification: {
        body: 'Connection restored',
        title: 'Notification',
      },
    })
  })
})
