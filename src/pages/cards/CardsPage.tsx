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
import './styles.css'

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
    colorClassName: 'cards-style-35',
    label: 'Daily spend',
    value: '$640 / $2,000',
    width: '32%',
  },
  {
    colorClassName: 'cards-style-36',
    label: 'Online payments',
    value: '$1,240 / $1,500',
    width: '83%',
  },
  {
    colorClassName: 'cards-style-35',
    label: 'ATM withdrawal',
    value: '$0 / $800',
    width: '2%',
  },
]

function CardsPage() {
  return (
    <section className="cards-style-1 ui-enter">
      <div className="cards-style-2">
        <div className="cards-style-3">
          <header className="cards-style-4">
            <h1 className="cards-style-5">Cards</h1>

            <button className="cards-style-6 ui-lift" type="button">
              <Plus className="cards-style-7" />
              Issue card
            </button>
          </header>

          <div className="cards-style-8">
            <PaymentCard variant="primary" />
            <PaymentCard variant="virtual" />
          </div>

          <LimitsPanel />
        </div>

        <aside className="cards-style-9">
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
    <article className="cards-style-3">
      <div
        className={cn(
          'cards-style-37',
          'ui-lift',
          isPrimary ? 'cards-style-38' : 'cards-style-39',
        )}
      >
        {isPrimary ? (
          <>
            <div className="cards-style-10" />
            <div className="cards-style-11" />
          </>
        ) : (
          <div className="cards-style-12">
            <span className="cards-style-13">Frozen</span>
          </div>
        )}

        <div className="cards-style-14">
          <span
            className={cn(
              'cards-style-61',
              isPrimary ? 'cards-style-40' : 'cards-style-41',
            )}
          >
            beam
          </span>
          <span
            className={cn(
              'cards-style-42',
              isPrimary ? 'cards-style-43' : 'cards-style-44',
            )}
          >
            {isPrimary ? 'DEBIT' : 'VIRTUAL'}
          </span>
        </div>

        <p
          className={cn(
            'cards-style-45',
            isPrimary ? 'cards-style-40' : 'cards-style-44',
          )}
        >
          •••• •••• •••• {isPrimary ? '4823' : '7710'}
        </p>

        <div className="cards-style-15">
          <span className="cards-style-16">ALEX RIVERA</span>
          <span className="cards-style-16">
            {isPrimary ? '09/28' : '03/27'}
          </span>
          {isPrimary ? (
            <span className="cards-style-17">
              <span className="cards-style-18" />
              <span className="cards-style-19" />
            </span>
          ) : null}
        </div>
      </div>

      <div className="cards-style-20">
        <div className="cards-style-3">
          <h2 className="cards-style-21">
            {isPrimary ? 'Beam Debit · physical' : 'Beam Virtual · online'}
          </h2>
          <p className="cards-style-22">Linked to Main checking</p>
        </div>
        <span
          className={cn(
            'cards-style-46',
            isPrimary ? 'cards-style-47' : 'cards-style-48',
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
    <section className="cards-style-23 ui-lift">
      <h2 className="cards-style-24">Limits - Beam Debit •• 4823</h2>

      <div className="cards-style-25">
        {limits.map(({ colorClassName, label, value, width }) => (
          <div className="cards-style-3" key={label}>
            <div className="cards-style-26">
              <span className="cards-style-27">{label}</span>
              <span className="cards-style-28">{value}</span>
            </div>
            <div className="cards-style-29">
              <div
                className={cn('cards-style-49', colorClassName)}
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
    <section className="cards-style-30 ui-lift">
      {cardControls.map(({ enabled, icon: Icon, label }, index) => (
        <div
          className={cn(
            'cards-style-50',
            index < cardControls.length - 1 && 'cards-style-51',
          )}
          key={label}
        >
          <span className="cards-style-31">
            <Icon className="cards-style-32" />
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
    <section className="cards-style-30 ui-lift">
      {cardActions.map(({ danger, icon: Icon, label }, index) => (
        <button
          className={cn(
            'cards-style-52',
            index < cardActions.length - 1 && 'cards-style-51',
          )}
          key={label}
          type="button"
        >
          <span
            className={cn(
              'cards-style-53',
              danger ? 'cards-style-54' : 'cards-style-55',
            )}
          >
            <Icon
              className={cn(
                'cards-style-56',
                danger ? 'cards-style-54' : 'cards-style-57',
              )}
            />
            {label}
          </span>
          <ChevronRight className="cards-style-33" />
        </button>
      ))}
    </section>
  )
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        'cards-style-58',
        enabled ? 'cards-style-59' : 'cards-style-60',
      )}
      aria-hidden="true"
    >
      <span className="cards-style-34" />
    </span>
  )
}

export default CardsPage
