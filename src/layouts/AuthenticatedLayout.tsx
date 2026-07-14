import { Outlet } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { RightPanel } from '@/components/RightPanel'
import { Sidebar } from '@/components/Sidebar'
import { TransferPanel } from '@/components/TransferPanel'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

export function AuthenticatedLayout() {
  const rightPanelContent = useAppSelector((state) => state.rightPanel.content)
  const rightPanelChildren = getRightPanelChildren(rightPanelContent)

  return (
    <main className={styles['auth-layout']}>
      <div
        className={cn(
          styles['auth-layout__shell'],
          rightPanelChildren && styles['auth-layout__shell--with-panel'],
        )}
      >
        <Sidebar />
        <div className={styles['auth-layout__content']}>
          <Outlet />
        </div>
        <RightPanel>{rightPanelChildren}</RightPanel>
      </div>
    </main>
  )
}

function getRightPanelChildren(content: 'transfer' | null) {
  if (content === 'transfer') {
    return <TransferPanel />
  }

  return null
}
