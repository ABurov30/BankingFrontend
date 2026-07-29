import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { useSignupMutation } from '@/shared/api/authApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import { SignupForm, SignupHero, type SignupFormValues } from './components'
import styles from './styles.module.css'

function SignupPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [signup, { isLoading }] = useSignupMutation()

  const onSubmit = async ({ termsAccepted, ...values }: SignupFormValues) => {
    if (!termsAccepted) {
      return
    }

    try {
      await signup(values).unwrap()
      dispatch(
        showToast({
          message: t('checkEmailVerification'),
          title: t('accountCreated'),
          variant: 'success',
        }),
      )
      navigate('/login')
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('accountCreationFailed'),
          variant: 'error',
        }),
      )
    }
  }

  return (
    <main className={`${styles['signup']} ui-enter`}>
      <section className={styles['signup__shell']}>
        <SignupHero />
        <SignupForm isLoading={isLoading} onSubmit={onSubmit} />
      </section>
    </main>
  )
}

export default SignupPage
