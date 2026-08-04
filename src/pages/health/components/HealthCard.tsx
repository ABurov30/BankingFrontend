import type { LucideIcon } from 'lucide-react'

import { Skeleton } from '@/components/Skeleton'
import type { ServiceHealthResult } from '@/shared/api/healthApi'
import { useI18n } from '@/shared/i18n/useI18n'
import styles from '../styles.module.css'

function serializeHealth(value: unknown, isHealthy: boolean) {
  if (typeof value === 'string') return value
  if (value === undefined) {
    return isHealthy ? '{"status":"UP"}' : '{"status":"UNKNOWN"}'
  }

  try {
    return JSON.stringify(value)
  } catch {
    return '{"status":"UNKNOWN"}'
  }
}

export function HealthCard({
  icon: Icon,
  isLoading,
  name,
  result,
}: {
  icon: LucideIcon
  isLoading: boolean
  name: string
  result?: ServiceHealthResult
}) {
  const { t } = useI18n()
  const isHealthy = result !== undefined && !result.error

  return (
    <article className={styles['health__card']}>
      <div className={styles['health__card-header']}>
        <div className={styles['health__service']}>
          <span className={styles['health__service-icon']}>
            <Icon />
          </span>
          <h2>{name}</h2>
        </div>
        {isLoading ? (
          <Skeleton height={24} width={82} />
        ) : (
          <span
            className={
              isHealthy
                ? styles['health__status--healthy']
                : styles['health__status--failed']
            }
          >
            <i /> {isHealthy ? t('healthy') : t('unavailable')}
          </span>
        )}
      </div>
      {isLoading ? (
        <Skeleton height={42} radius={9} />
      ) : (
        <code className={styles['health__payload']}>
          {serializeHealth(
            result?.error ? { status: 'DOWN' } : result?.data,
            isHealthy,
          )}
        </code>
      )}
      <p className={styles['health__endpoint']}>
        /{name.toLowerCase()}/health ·{' '}
        {isLoading ? t('checking') : t('checkedNow')}
      </p>
    </article>
  )
}
