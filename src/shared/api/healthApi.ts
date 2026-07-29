import { baseApi } from './baseApi'

type ServiceHealth = {
  account: string
  auth: string
  card: string
  notification: string
  transaction: string
  user: string
}

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceHealth: builder.query<ServiceHealth, void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        const entries = await Promise.all(
          [
            ['account', '/account/health'],
            ['auth', '/auth/health'],
            ['card', '/card/health'],
            ['notification', '/notification/health'],
            ['transaction', '/transaction/health'],
            ['user', '/user/health'],
          ].map(async ([service, url]) => {
            const result = await baseQuery(url)
            return [service, result] as const
          }),
        )

        const failed = entries.find((entry) => entry[1].error)

        if (failed?.[1].error) {
          return { error: failed[1].error }
        }

        return {
          data: Object.fromEntries(
            entries.map(([service, result]) => [service, result.data]),
          ) as ServiceHealth,
        }
      },
      providesTags: ['Health'],
    }),
  }),
})

export const { useGetServiceHealthQuery } = healthApi
