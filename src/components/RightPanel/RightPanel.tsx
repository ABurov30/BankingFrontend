import { Children, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

type RightPanelProps = {
  children?: ReactNode
}

export function RightPanel({ children }: RightPanelProps) {
  const hasChildren = Children.count(children) > 0

  return (
    <aside
      aria-hidden={!hasChildren}
      className={cn(
        hasChildren
          ? `${styles['right-panel']} ui-enter`
          : styles['right-panel--hidden'],
      )}
    >
      {children}
    </aside>
  )
}
