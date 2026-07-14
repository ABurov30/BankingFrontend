import styles from './styles.module.css'

export function PageLoader() {
  return (
    <main className={styles['page-loader']}>
      <section className={styles['page-loader__shell']}>
        <div className={styles['page-loader__brand']}>
          <span className={styles['page-loader__mark']} />
          <span className={styles['page-loader__name']}>buro</span>
        </div>
        <div className={styles['page-loader__spinner']} />
      </section>
    </main>
  )
}
