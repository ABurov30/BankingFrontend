import type { NotificationResponseDto } from '@/shared/api/types'

type NotificationEventSource = Record<string, unknown>

export type NotificationEvent = {
  eventId?: string
  notification: NotificationResponseDto
}

function asText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function toSource(payload: unknown): NotificationEventSource | null {
  return payload && typeof payload === 'object'
    ? (payload as NotificationEventSource)
    : null
}

/**
 * The REST schema currently describes title/body. The WebSocket producer may
 * additionally supply an event identifier, which is used for safe deduplication.
 */
export function parseNotificationEvent(payload: unknown): NotificationEvent {
  const source = toSource(payload)
  const fallbackBody =
    typeof payload === 'string' ? payload : JSON.stringify(payload)

  return {
    eventId:
      asText(source?.eventId) ??
      asText(source?.notificationId) ??
      asText(source?.id),
    notification: {
      body:
        asText(source?.body) ??
        asText(source?.message) ??
        asText(source?.content) ??
        asText(source?.description) ??
        fallbackBody,
      title:
        asText(source?.title) ??
        asText(source?.subject) ??
        asText(source?.type) ??
        'Notification',
    },
  }
}
