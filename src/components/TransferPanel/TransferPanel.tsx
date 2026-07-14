import {
  ChevronDown,
  Landmark,
  Repeat2,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { useAppDispatch } from '@/app/hooks'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import styles from './styles.module.css'

export function TransferPanel() {
  const dispatch = useAppDispatch()

  return (
    <>
      <header className={styles['transfer-panel__header']}>
        <h2 className={styles['transfer-panel__title']}>New transfer</h2>
        <button
          aria-label="Close transfer panel"
          className={styles['transfer-panel__close-button']}
          onClick={() => dispatch(closeRightPanel())}
          type="button"
        >
          <X className={styles['transfer-panel__close-icon']} />
        </button>
      </header>

      <div className={styles['transfer-panel__tabs']} role="tablist">
        <button
          className={styles['transfer-panel__tab']}
          role="tab"
          type="button"
        >
          <Repeat2 className={styles['transfer-panel__tab-icon']} />
          My accounts
        </button>
        <button
          aria-selected="true"
          className={styles['transfer-panel__tab--inactive']}
          role="tab"
          type="button"
        >
          <User className={styles['transfer-panel__tab-icon']} />
          To someone
        </button>
      </div>

      <div className={styles['transfer-panel__form']}>
        <Field label="From">
          <div className={styles['transfer-panel__account-select']}>
            <div className={styles['transfer-panel__account-summary']}>
              <span className={styles['transfer-panel__account-icon']}>
                <Landmark className={styles['transfer-panel__icon']} />
              </span>
              <div>
                <p className={styles['transfer-panel__account-name']}>
                  Main checking
                </p>
                <p className={styles['transfer-panel__account-meta']}>
                  $12,480.50
                </p>
              </div>
            </div>
            <ChevronDown className={styles['transfer-panel__chevron']} />
          </div>
        </Field>

        <Field label="To">
          <div className={styles['transfer-panel__recipient']}>
            <span className={styles['transfer-panel__recipient-avatar']}>
              NK
            </span>
            <div>
              <p className={styles['transfer-panel__account-name']}>Nadia K.</p>
              <p className={styles['transfer-panel__account-meta']}>
                •• 5561 · Buro
              </p>
            </div>
          </div>
        </Field>

        <Field label="Amount">
          <div className={styles['transfer-panel__amount-card']}>
            <div className={styles['transfer-panel__amount-row']}>
              <p className={styles['transfer-panel__amount']}>
                $250
                <span className={styles['transfer-panel__amount-cents']}>
                  .00
                </span>
              </p>
              <span className={styles['transfer-panel__currency-badge']}>
                USD
              </span>
            </div>
          </div>
          <p className={styles['transfer-panel__fee-note']}>
            Available after transfer: $12,230.50
          </p>
        </Field>

        <Field label="Note · optional">
          <div className={styles['transfer-panel__memo']}>Dinner split 🍜</div>
        </Field>
      </div>

      <div className={styles['transfer-panel__security']}>
        <div className={styles['transfer-panel__account-summary']}>
          <ShieldCheck className={styles['transfer-panel__security-icon']} />
          <p className={styles['transfer-panel__security-copy']}>
            Funds & card limits are verified before authorization
          </p>
        </div>
        <button
          className={`${styles['transfer-panel__submit']} ui-lift`}
          type="button"
        >
          Send $250.00
        </button>
      </div>
    </>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className={styles['transfer-panel__field']}>
      <span className={styles['transfer-panel__label']}>{label}</span>
      {children}
    </label>
  )
}
