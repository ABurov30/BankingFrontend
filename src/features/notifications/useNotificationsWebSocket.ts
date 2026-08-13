import { Client } from '@stomp/stompjs'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { invalidateAccounts } from '@/features/accounts/accountsSlice'
import { showToast } from '@/features/toast/toastSlice'
import { selectCurrentUser } from '@/features/user/userSlice'
import { accountApi } from '@/shared/api/accountApi'
import {
  addLiveNotificationToCache,
  useGetNotificationsQuery,
} from '@/shared/api/notificationApi'
import { parseNotificationEvent } from './notificationEvent'

const brokerURL =
  import.meta.env.VITE_NOTIFICATIONS_WS_URL ??
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/ws`

async function refreshAccounts(
  dispatch: typeof import('@/app/store').store.dispatch,
  ownerUserId?: string,
) {
  if (!ownerUserId) return

  dispatch(invalidateAccounts())
  const request = dispatch(
    accountApi.endpoints.getAccountsWithCardsByOwnerId.initiate(ownerUserId, {
      forceRefetch: true,
    }),
  )

  try {
    await request.unwrap()
  } catch {
    // Keep the existing account snapshot if the refresh request fails.
  } finally {
    request.unsubscribe()
  }
}

export function useNotificationsWebSocket() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  const { refetch } = useGetNotificationsQuery(
    currentUser?.authUserId ? undefined : skipToken,
    { refetchOnMountOrArgChange: true },
  )
  const hasConnectedRef = useRef(false)
  const refetchNotificationsRef = useRef(refetch)
  const receivedEventIdsRef = useRef(new Set<string>())

  useEffect(() => {
    refetchNotificationsRef.current = refetch
  }, [refetch])

  useEffect(() => {
    if (!currentUser?.authUserId) return

    hasConnectedRef.current = false
    receivedEventIdsRef.current.clear()

    const client = new Client({
      brokerURL,
      connectionTimeout: 10_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      reconnectDelay: 5_000,
      onConnect: () => {
        if (hasConnectedRef.current) {
          void refetchNotificationsRef.current()
        }

        hasConnectedRef.current = true
        client.subscribe('/user/queue/notifications', (message) => {
          let payload: unknown = message.body

          try {
            payload = JSON.parse(message.body) as unknown
          } catch {
            // Plain-text notifications are valid too.
          }

          const { eventId, notification, shouldRefreshAccounts } =
            parseNotificationEvent(payload)

          if (eventId && receivedEventIdsRef.current.has(eventId)) {
            return
          }

          if (eventId) {
            receivedEventIdsRef.current.add(eventId)
          }

          if (shouldRefreshAccounts) {
            void refreshAccounts(dispatch, currentUser.userProfileId)
          }

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
  }, [currentUser?.authUserId, currentUser?.userProfileId, dispatch])
}
