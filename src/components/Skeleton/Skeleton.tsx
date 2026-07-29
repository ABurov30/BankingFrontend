import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

type SkeletonProps = {
  className?: string
  height?: number | string
  radius?: number | string
  width?: number | string
}

export function Skeleton({
  className,
  height = 16,
  radius,
  width = '100%',
}: SkeletonProps) {
  const style = {
    height,
    width,
    ...(radius ? { borderRadius: radius } : {}),
  } satisfies CSSProperties

  return (
    <span
      aria-hidden="true"
      className={cn(styles['skeleton'], className)}
      style={style}
    />
  )
}
