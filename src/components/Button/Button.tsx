/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import './styles.css'

const buttonVariants = cva('button-style-1', {
  variants: {
    variant: {
      default: 'button-style-2',
      destructive: 'button-style-3',
      outline: 'button-style-4',
      secondary: 'button-style-5',
      ghost: 'button-style-6',
      link: 'button-style-7',
    },
    size: {
      default: 'button-style-8',
      sm: 'button-style-9',
      lg: 'button-style-10',
      icon: 'button-style-11',
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
