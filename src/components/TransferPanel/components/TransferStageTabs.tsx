import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Landmark,
  Send,
} from 'lucide-react'

import type { PanelOperation, TranslationFunction } from '../types'
import { OperationTab } from './OperationTab'
import styles from '../styles.module.css'

export function TransferTargetTabs({
  onSelectTarget,
  t,
}: {
  onSelectTarget: (target: 'OWN_ACCOUNT' | 'ANOTHER_PERSON') => void
  t: TranslationFunction
}) {
  return (
    <div className={styles['transfer-panel__tabs']}>
      <OperationTab
        active={false}
        icon={<Landmark className={styles['transfer-panel__tab-icon']} />}
        label={t('toYourAccount')}
        onClick={() => onSelectTarget('OWN_ACCOUNT')}
      />
      <OperationTab
        active={false}
        icon={<Send className={styles['transfer-panel__tab-icon']} />}
        label={t('toAnotherPerson')}
        onClick={() => onSelectTarget('ANOTHER_PERSON')}
      />
    </div>
  )
}

export function OwnAccountOperationTabs({
  onSelectOperation,
  t,
}: {
  onSelectOperation: (
    operation: Exclude<PanelOperation, 'TO_ANOTHER_USER'>,
  ) => void
  t: TranslationFunction
}) {
  return (
    <div
      className={`${styles['transfer-panel__tabs']} ${styles['transfer-panel__tabs--own-operations']}`}
    >
      <OperationTab
        active={false}
        icon={<ArrowDownLeft className={styles['transfer-panel__tab-icon']} />}
        label={t('topUp')}
        onClick={() => onSelectOperation('TOP_UP')}
      />
      <OperationTab
        active={false}
        icon={<ArrowUpRight className={styles['transfer-panel__tab-icon']} />}
        label={t('withdraw')}
        onClick={() => onSelectOperation('WITHDRAW')}
      />
      <OperationTab
        active={false}
        icon={<ArrowLeftRight className={styles['transfer-panel__tab-icon']} />}
        label={t('betweenMyAccounts')}
        onClick={() => onSelectOperation('BETWEEN_OWN_ACCOUNTS')}
      />
    </div>
  )
}
