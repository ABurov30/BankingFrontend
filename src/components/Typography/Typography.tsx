import { type ComponentPropsWithoutRef, type ElementType } from 'react'

import { cn } from '@/lib/utils'
import './styles.css'

type TypographyMode = 'title' | 'subtitle'

type TypographyProps<T extends ElementType> = {
  as?: T
  mode: TypographyMode
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

const typographyClassNameByMode: Record<TypographyMode, string> = {
  title: 'typography-style-1',
  subtitle: 'typography-style-2',
}

function Typography<T extends ElementType = 'p'>({
  as,
  className,
  mode,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? 'p'

  return (
    <Component
      className={cn(typographyClassNameByMode[mode], className)}
      {...props}
    />
  )
}

export { Typography }
