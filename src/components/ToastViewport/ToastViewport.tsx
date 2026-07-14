import { X } from 'lucide-react'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { cn } from '@/lib/utils'
import { dismissToast } from '@/features/toast/toastSlice'
import styles from './styles.module.css'

const toastLifetimeMs = 5000

export function ToastViewport() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.toast.items)

  useEffect(() => {
    if (toasts.length === 0) {
      return
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(
        () => dispatch(dismissToast(toast.id)),
        toastLifetimeMs,
      ),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [dispatch, toasts])

  if (toasts.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      className={styles['toast-viewport']}
    >
      {toasts.map(({ id, message, title, variant }) => (
        <article
          className={cn(
            styles['toast-viewport__toast'],
            styles[`toast-viewport__toast--${variant}`],
          )}
          key={id}
        >
          <div className={styles['toast-viewport__content']}>
            <h2 className={styles['toast-viewport__title']}>{title}</h2>
            <p className={styles['toast-viewport__message']}>{message}</p>
          </div>
          <button
            aria-label="Dismiss notification"
            className={styles['toast-viewport__dismiss']}
            onClick={() => dispatch(dismissToast(id))}
            type="button"
          >
            <X className={styles['toast-viewport__dismiss-icon']} />
          </button>
        </article>
      ))}
    </section>
  )
}
