import styles from '../styles.module.css'
import { useI18n } from '@/shared/i18n/useI18n'

export function SignupHero() {
  const { t } = useI18n()
  const steps = [
    t('signupStepCreateProfile'),
    t('signupStepConfirmEmail'),
    t('signupStepGetCard'),
  ]

  return (
    <aside className={styles['signup__hero']}>
      <div className={styles['signup__hero-orb-primary']} />
      <div className={styles['signup__hero-orb-secondary']} />

      <div className={styles['signup__brand']}>
        <span className={styles['signup__brand-mark']} />
        <span className={styles['signup__brand-name']}>buro</span>
      </div>

      <div className={styles['signup__hero-copy']}>
        <h2 className={styles['signup__hero-title']}>{t('signupHeroTitle')}</h2>

        <ol className={styles['signup__steps']}>
          {steps.map((step, index) => (
            <li className={styles['signup__step']} key={step}>
              <span className={styles['signup__step-index']}>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
