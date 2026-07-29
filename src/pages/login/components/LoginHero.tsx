import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function LoginHero() {
  const { t } = useI18n()

  return (
    <aside className={styles['login__hero']}>
      <div className={styles['login__hero-orb-primary']} />
      <div className={styles['login__hero-orb-secondary']} />

      <div className={styles['login__brand']}>
        <span className={styles['login__brand-mark']} />
        <span className={styles['login__brand-name']}>buro</span>
      </div>

      <div className={styles['login__hero-copy']}>
        <h2 className={styles['login__hero-title']}>
          {t('welcomeHeroTitle')}
        </h2>
        <p className={styles['login__hero-text']}>
          {t('welcomeHeroText')}
        </p>
      </div>
    </aside>
  )
}
