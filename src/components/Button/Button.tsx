/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import styles from './styles.module.css'

const buttonVariants = cva(styles['button'], {
  variants: {
    variant: {
      default: styles['button--default'],
      destructive: styles['button--destructive'],
      outline: styles['button--outline'],
      secondary: styles['button--secondary'],
      ghost: styles['button--ghost'],
      link: styles['button--link'],
    },
    size: {
      default: styles['button--size-default'],
      sm: styles['button--size-sm'],
      lg: styles['button--size-lg'],
      icon: styles['button--size-icon'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
