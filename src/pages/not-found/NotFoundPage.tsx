import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import styles from './styles.module.css'

function NotFoundPage() {
  return (
    <main className={styles['not-found']}>
      <section className={styles['not-found__content']}>
        <div className={styles['not-found__brand']}>
          <span className={styles['not-found__brand-mark']} />
          <span className={styles['not-found__brand-name']}>buro</span>
        </div>

        <div className={styles['not-found__copy']}>
          <span className={styles['not-found__code']}>404</span>
          <h1 className={styles['not-found__title']}>Страница не найдена</h1>
          <p className={styles['not-found__text']}>
            Такой страницы нет или адрес был изменен.
          </p>
        </div>

        <Button asChild className={styles['not-found__action']}>
          <Link to="/">Вернуться в Buro</Link>
        </Button>
      </section>
    </main>
  )
}

export default NotFoundPage
