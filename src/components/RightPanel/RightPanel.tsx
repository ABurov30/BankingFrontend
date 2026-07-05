import { Children, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import './styles.css'

type RightPanelProps = {
  children?: ReactNode
}

export function RightPanel({ children }: RightPanelProps) {
  const hasChildren = Children.count(children) > 0

  return (
    <aside
      aria-hidden={!hasChildren}
      className={cn(
        hasChildren ? 'right-panel-style-1 ui-enter' : 'right-panel-style-2',
      )}
    >
      {children}
    </aside>
  )
}
