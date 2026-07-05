import { Outlet } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { RightPanel } from '@/components/RightPanel'
import { Sidebar } from '@/components/Sidebar'
import { TransferPanel } from '@/components/TransferPanel'
import { cn } from '@/lib/utils'
import './styles.css'

export function AuthenticatedLayout() {
  const rightPanelContent = useAppSelector((state) => state.rightPanel.content)
  const rightPanelChildren = getRightPanelChildren(rightPanelContent)

  return (
    <main className="layouts-style-1">
      <div
        className={cn(
          'layouts-style-2',
          rightPanelChildren && 'layouts-style-4',
        )}
      >
        <Sidebar />
        <div className="layouts-style-6">
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
