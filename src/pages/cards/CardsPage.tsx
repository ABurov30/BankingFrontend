import {
  Ban,
  Banknote,
  ChevronRight,
  CreditCard,
  Eye,
  Globe2,
  Plus,
  Radio,
  Snowflake,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

const cardControls = [
  { enabled: false, icon: Snowflake, label: 'Freeze card' },
  { enabled: true, icon: Globe2, label: 'Online payments' },
  { enabled: true, icon: Radio, label: 'Contactless' },
  { enabled: true, icon: Banknote, label: 'ATM withdrawals' },
]

const cardActions = [
  { icon: CreditCard, label: 'Change PIN' },
  { icon: Eye, label: 'Show card details' },
  { danger: true, icon: Ban, label: 'Block permanently' },
]

const limits = [
  {
    colorClassName: styles['cards__card--primary'],
    label: 'Daily spend',
    value: '$640 / $2,000',
    width: '32%',
  },
  {
    colorClassName: styles['cards__card--secondary'],
    label: 'Online payments',
    value: '$1,240 / $1,500',
    width: '83%',
  },
  {
    colorClassName: styles['cards__card--primary'],
    label: 'ATM withdrawal',
    value: '$0 / $800',
    width: '2%',
  },
]

function CardsPage() {
  return (
    <section className={`${styles['cards']} ui-enter`}>
      <div className={styles['cards__layout']}>
        <div className={styles['cards__main']}>
          <header className={styles['cards__stack']}>
            <h1 className={styles['cards__header']}>Cards</h1>

            <button
              className={`${styles['cards__title']} ui-lift`}
              type="button"
            >
              <Plus className={styles['cards__add-button']} />
              Issue card
            </button>
          </header>

          <div className={styles['cards__button-icon']}>
            <PaymentCard variant="primary" />
            <PaymentCard variant="virtual" />
          </div>

          <LimitsPanel />
        </div>

        <aside className={styles['cards__cards-list']}>
          <SettingsPanel />
          <ActionsPanel />
        </aside>
      </div>
    </section>
  )
}

function PaymentCard({ variant }: { variant: 'primary' | 'virtual' }) {
  const isPrimary = variant === 'primary'

  return (
    <article className={styles['cards__main']}>
      <div
        className={cn(
          styles['cards__card--frozen'],
          'ui-lift',
          isPrimary ? styles['cards__card-state'] : styles['cards__card-state--active'],
        )}
      >
        {isPrimary ? (
          <>
            <div className={styles['cards__aside']} />
            <div className={styles['cards__card-orb-primary']} />
          </>
        ) : (
          <div className={styles['cards__card-orb-secondary']}>
            <span className={styles['cards__card-overlay']}>
              <Snowflake className={styles['cards__freeze-icon']} />
              Frozen
            </span>
          </div>
        )}

        <div className={styles['cards__freeze-badge']}>
          <span
            className={cn(
              styles['cards__card-logo'],
              isPrimary ? styles['cards__card-state--frozen'] : styles['cards__card-control'],
            )}
          >
            buro
          </span>
          <span
            className={cn(
              styles['cards__card-control--active'],
              isPrimary ? styles['cards__card-control--frozen'] : styles['cards__status--active'],
            )}
          >
            {isPrimary ? 'DEBIT' : 'VIRTUAL'}
          </span>
        </div>

        <p
          className={cn(
            styles['cards__status--online'],
            isPrimary ? styles['cards__card-state--frozen'] : styles['cards__status--active'],
          )}
        >
          •••• •••• •••• {isPrimary ? '4823' : '7710'}
        </p>

        <div className={styles['cards__card-content']}>
          <span className={styles['cards__card-meta']}>ALEX RIVERA</span>
          <span className={styles['cards__card-meta']}>
            {isPrimary ? '09/28' : '03/27'}
          </span>
          {isPrimary ? (
            <span className={styles['cards__network']}>
              <span className={styles['cards__network-dot--red']} />
              <span className={styles['cards__network-dot--orange']} />
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles['cards__card-summary']}>
        <div className={styles['cards__main']}>
          <h2 className={styles['cards__card-title']}>
            {isPrimary ? 'Buro Debit · physical' : 'Buro Virtual · online'}
          </h2>
          <p className={styles['cards__card-subtitle']}>Linked to Main checking</p>
        </div>
        <span
          className={cn(
            styles['cards__status--blocked'],
            isPrimary ? styles['cards__action-danger'] : styles['cards__action-default'],
          )}
        >
          {isPrimary ? 'ACTIVE' : 'FROZEN'}
        </span>
      </div>
    </article>
  )
}

function LimitsPanel() {
  return (
    <section className={`${styles['cards__limits-card']} ui-lift`}>
      <h2 className={styles['cards__section-title']}>Limits — Buro Debit •• 4823</h2>

      <div className={styles['cards__limit-list']}>
        {limits.map(({ colorClassName, label, value, width }) => (
          <div className={styles['cards__main']} key={label}>
            <div className={styles['cards__limit-row']}>
              <span className={styles['cards__limit-label']}>{label}</span>
              <span className={styles['cards__limit-value']}>{value}</span>
            </div>
            <div className={styles['cards__limit-track']}>
              <div
                className={cn(styles['cards__limit-fill'], colorClassName)}
                style={{ width }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SettingsPanel() {
  return (
    <section className={`${styles['cards__panel-card']} ui-lift`}>
      {cardControls.map(({ enabled, icon: Icon, label }, index) => (
        <div
          className={cn(
            styles['cards__limit-fill--spend'],
            index < cardControls.length - 1 && styles['cards__limit-fill--atm'],
          )}
          key={label}
        >
          <span className={styles['cards__action-row']}>
            <Icon className={styles['cards__action-icon']} />
            {label}
          </span>
          <Toggle enabled={enabled} />
        </div>
      ))}
    </section>
  )
}

function ActionsPanel() {
  return (
    <section className={`${styles['cards__panel-card']} ui-lift`}>
      {cardActions.map(({ danger, icon: Icon, label }, index) => (
        <button
          className={cn(
            styles['cards__toggle'],
            index < cardActions.length - 1 && styles['cards__limit-fill--atm'],
          )}
          key={label}
          type="button"
        >
          <span
            className={cn(
              styles['cards__toggle--on'],
              danger ? styles['cards__toggle--off'] : styles['cards__setting-row'],
            )}
          >
            <Icon
              className={cn(
                styles['cards__setting-title'],
                danger ? styles['cards__toggle--off'] : styles['cards__setting-meta'],
              )}
            />
            {label}
          </span>
          <ChevronRight className={styles['cards__chevron']} />
        </button>
      ))}
    </section>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        styles['cards__setting-action'],
        enabled ? styles['cards__setting-action--muted'] : styles['cards__empty-card'],
      )}
      aria-hidden="true"
    >
      <span className={styles['cards__toggle-knob']} />
    </span>
  )
}

export default CardsPage
