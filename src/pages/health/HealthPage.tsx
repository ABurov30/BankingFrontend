import {
  BellRing,
  CreditCard,
  HeartPulse,
  Landmark,
  ShieldCheck,
  UserRound,
  WalletCards,
} from 'lucide-react'

import { useGetServiceHealthQuery } from '@/shared/api/healthApi'
import { useI18n } from '@/shared/i18n/useI18n'
import { HealthCard } from './components'
import styles from './styles.module.css'

const services = [
  { icon: Landmark, key: 'account', name: 'Account' },
  { icon: ShieldCheck, key: 'auth', name: 'Auth' },
  { icon: CreditCard, key: 'card', name: 'Card' },
  { icon: BellRing, key: 'notification', name: 'Notification' },
  { icon: WalletCards, key: 'transaction', name: 'Transaction' },
  { icon: UserRound, key: 'user', name: 'User' },
] as const

function HealthPage() {
  const { t } = useI18n()
  const isAdmin = true
  // const isAdmin = useAppSelector((state) => state.user.currentUser?.role) === Role.ADMIN
  const { data, isLoading, refetch } = useGetServiceHealthQuery(undefined, {
    pollingInterval: 30_000,
  })
  // if (!isAdmin) return <AccessDenied />
  void isAdmin

  const healthyCount = services.filter(
    ({ key }) => Boolean(data?.[key]) && !data?.[key]?.error,
  ).length

  return (
    <section className={`${styles['health']} ui-enter`}>
      <header className={styles['health__header']}>
        <div>
          <h1 className={styles['health__title']}>{t('serviceHealth')}</h1>
          <p className={styles['health__subtitle']}>
            {t('serviceHealthSubtitle')}
          </p>
        </div>
        <button
          className={`${styles['health__refresh']} ui-lift`}
          disabled={isLoading}
          onClick={() => refetch()}
          type="button"
        >
          <HeartPulse /> {t('refresh')}
        </button>
      </header>
      <div className={styles['health__summary']}>
        <span>{t('servicesHealthy')}</span>
        <strong>
          {isLoading ? '...' : `${healthyCount}/${services.length}`}
        </strong>
      </div>
      <div className={styles['health__grid']}>
        {services.map(({ icon, key, name }) => (
          <HealthCard
            icon={icon}
            isLoading={isLoading}
            key={key}
            name={name}
            result={data?.[key]}
          />
        ))}
      </div>
    </section>
  )
}

export default HealthPage
