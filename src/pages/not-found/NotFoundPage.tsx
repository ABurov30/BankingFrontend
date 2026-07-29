import { NotFoundContent } from './components'
import styles from './styles.module.css'

function NotFoundPage() {
  return (
    <main className={styles['not-found']}>
      <NotFoundContent />
    </main>
  )
}

export default NotFoundPage
