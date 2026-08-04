import { baseApi } from './baseApi'

export type ServiceHealthResult = {
  data?: unknown
  error?: unknown
}

export type ServiceHealth = Record<string, ServiceHealthResult>

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
            const result = await baseQuery({
              responseHandler: 'text',
              url,
            })
            return [service, result] as const
          }),
        )

        return {
          data: Object.fromEntries(
            entries.map(([service, result]) => [
              service,
              result.error ? { error: result.error } : { data: result.data },
            ]),
          ) as ServiceHealth,
        }
      },
      providesTags: ['Health'],
    }),
  }),
})

export const { useGetServiceHealthQuery } = healthApi
