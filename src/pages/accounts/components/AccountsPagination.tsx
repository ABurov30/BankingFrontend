import { ChevronLeft, ChevronRight } from 'lucide-react'

import styles from '../styles.module.css'

export function AccountsPagination({
  currentPage,
  labels,
  onPageChange,
  totalAccounts,
  totalPages,
  visibleAccountsEnd,
  visibleAccountsStart,
}: {
  currentPage: number
  labels: {
    nextPage: string
    of: string
    previousPage: string
    showing: string
    totalAccounts: string
  }
  onPageChange: (page: number) => void
  totalAccounts: number
  totalPages: number
  visibleAccountsEnd: number
  visibleAccountsStart: number
}) {
  return (
    <footer className={styles['accounts__footer']}>
      <p className={styles['accounts__footer-text']}>
        {labels.showing} {visibleAccountsStart}-{visibleAccountsEnd} {labels.of}{' '}
        {totalAccounts} {labels.totalAccounts}
      </p>

      <div className={styles['accounts__pagination']}>
        <button
          aria-label={labels.previousPage}
          className={`${styles['accounts__page-button']} ui-lift`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          type="button"
        >
          <ChevronLeft className={styles['accounts__page-icon']} />
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1

          return (
            <button
              aria-current={currentPage === page ? 'page' : undefined}
              className={`${styles['accounts__page-button']} ${
                currentPage === page
                  ? styles['accounts__page-button--active']
                  : ''
              } ui-lift`}
              key={page}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          )
        })}

        <button
          aria-label={labels.nextPage}
          className={`${styles['accounts__page-button']} ui-lift`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          type="button"
        >
          <ChevronRight className={styles['accounts__page-icon']} />
        </button>
      </div>
    </footer>
  )
}
