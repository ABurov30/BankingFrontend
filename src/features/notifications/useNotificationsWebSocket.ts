import { Client } from '@stomp/stompjs'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import {
  addLiveNotificationToCache,
  useGetNotificationsQuery,
} from '@/shared/api/notificationApi'
import type { NotificationResponseDto } from '@/shared/api/types'

const brokerURL =
  import.meta.env.VITE_NOTIFICATIONS_WS_URL ??
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/ws`

function asText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function normalizeNotification(payload: unknown): NotificationResponseDto {
  const source =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {}
  const fallbackMessage =
    typeof payload === 'string' ? payload : JSON.stringify(payload)

  return {
    body:
      asText(source.body) ??
      asText(source.message) ??
      asText(source.content) ??
      asText(source.description) ??
      fallbackMessage,
    title:
      asText(source.title) ??
      asText(source.subject) ??
      asText(source.type) ??
      'Notification',
  }
}

export function useNotificationsWebSocket() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  useGetNotificationsQuery(currentUser?.authUserId ? undefined : skipToken, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (!currentUser?.authUserId) return

    const client = new Client({
      brokerURL,
      reconnectDelay: 5_000,
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          let payload: unknown = message.body

          try {
            payload = JSON.parse(message.body) as unknown
          } catch {
            // Plain-text notifications are valid too.
          }

          const notification = normalizeNotification(payload)
          dispatch(addLiveNotificationToCache(notification))
          dispatch(
            showToast({
              message: notification.body ?? '',
              title: notification.title,
              variant: 'success',
            }),
          )
        })
      },
    })

    client.activate()

    return () => {
      void client.deactivate()
    }
  }, [currentUser?.authUserId, dispatch])
}
