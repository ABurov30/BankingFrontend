import { Outlet } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { BottomNavigation } from '@/components/BottomNavigation'
import { Sidebar } from '@/components/Sidebar'
import { TransferPanel } from '@/components/TransferPanel'
import styles from './styles.module.css'

export function AuthenticatedLayout() {
  const rightPanelContent = useAppSelector((state) => state.rightPanel.content)
  const isTransferPanelOpen = rightPanelContent === 'transfer'

  return (
    <main className={styles['auth-layout']}>
      <div className={styles['auth-layout__shell']}>
        <Sidebar />
        <div className={styles['auth-layout__content']}>
          <Outlet />
        </div>
        <BottomNavigation />
        {isTransferPanelOpen ? <TransferPanel /> : null}
      </div>
    </main>
  )
}
