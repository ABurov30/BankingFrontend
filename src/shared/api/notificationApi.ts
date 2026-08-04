import { baseApi } from './baseApi'
import type {
  GetNotificationsResponse,
  MarkNotificationsAsReadedRequest,
  NotificationResponseDto,
} from './types'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => '/notification/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationsAsReaded: builder.mutation<
      void,
      MarkNotificationsAsReadedRequest
    >({
      query: (body) => ({
        body,
        method: 'PATCH',
        url: '/notification/notifications/mark-as-readed',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadedMutation,
} = notificationApi

export function addLiveNotificationToCache(
  notification: NotificationResponseDto,
) {
  return notificationApi.util.updateQueryData(
    'getNotifications',
    undefined,
    (notifications) => {
      const alreadyPresent = notifications.some(
        (item) =>
          item.title === notification.title && item.body === notification.body,
      )

      if (!alreadyPresent) notifications.unshift(notification)
    },
  )
}
