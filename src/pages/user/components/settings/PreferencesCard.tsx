import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setThemeMode, type ResolvedTheme } from '@/features/app/appSlice'
import { useI18n } from '@/shared/i18n/useI18n'
import { CardTitle } from '../CardTitle'
import { PreferenceSegment } from './PreferenceSegment'
import styles from '../../styles.module.css'

export function PreferencesCard() {
  const dispatch = useAppDispatch()
  const { resolvedTheme } = useAppSelector((state) => state.app)
  const { t } = useI18n()

  const handleThemeChange = (theme: ResolvedTheme) => {
    dispatch(setThemeMode(theme))
  }

  return (
    <section className={`${styles['user__settings-card']} ui-lift`}>
      <CardTitle>{t('preferences')}</CardTitle>

      <div className={styles['user__preference-list']}>
        <PreferenceSegment
          label={t('theme')}
          options={[
            { label: t('light'), value: 'light' },
            { label: t('dark'), value: 'dark' },
          ]}
          value={resolvedTheme}
          onChange={(value) => handleThemeChange(value as ResolvedTheme)}
        />
      </div>
    </section>
  )
}
