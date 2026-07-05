import { ChevronDown, Landmark, ShieldCheck, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { useAppDispatch } from '@/app/hooks'
import { closeRightPanel } from '@/features/rightPanel/rightPanelSlice'
import './styles.css'

export function TransferPanel() {
  const dispatch = useAppDispatch()

  return (
    <>
      <header className="transfer-panel-style-1">
        <h2 className="transfer-panel-style-2">New transfer</h2>
        <button
          aria-label="Close transfer panel"
          className="transfer-panel-style-3"
          onClick={() => dispatch(closeRightPanel())}
          type="button"
        >
          <X className="transfer-panel-style-4" />
        </button>
      </header>

      <div className="transfer-panel-style-5">
        <Field label="From">
          <div className="transfer-panel-style-6">
            <div className="transfer-panel-style-7">
              <span className="transfer-panel-style-8">
                <Landmark className="transfer-panel-style-9" />
              </span>
              <div>
                <p className="transfer-panel-style-10">Main checking</p>
                <p className="transfer-panel-style-11">$12,480.50</p>
              </div>
            </div>
            <ChevronDown className="transfer-panel-style-12" />
          </div>
        </Field>

        <Field label="To">
          <div className="transfer-panel-style-13">
            <span className="transfer-panel-style-14">NK</span>
            <div>
              <p className="transfer-panel-style-10">Nadia K.</p>
              <p className="transfer-panel-style-11">•• 5561 · Beam</p>
            </div>
          </div>
        </Field>

        <Field label="Amount">
          <div className="transfer-panel-style-15">
            <div className="transfer-panel-style-16">
              <p className="transfer-panel-style-17">
                $250
                <span className="transfer-panel-style-18">.00</span>
              </p>
              <span className="transfer-panel-style-19">USD</span>
            </div>
          </div>
          <p className="transfer-panel-style-20">
            Available after transfer: $12,230.50
          </p>
        </Field>

        <Field label="Note · optional">
          <div className="transfer-panel-style-21">Dinner split</div>
        </Field>
      </div>

      <div className="transfer-panel-style-22">
        <div className="transfer-panel-style-7">
          <ShieldCheck className="transfer-panel-style-23" />
          <p className="transfer-panel-style-24">
            Funds & card limits are verified before authorization
          </p>
        </div>
        <button className="transfer-panel-style-25 ui-lift" type="button">
          Send $250.00
        </button>
      </div>
    </>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="transfer-panel-style-26">
      <span className="transfer-panel-style-27">{label}</span>
      {children}
    </label>
  )
}
