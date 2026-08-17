import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { useLoginMutation } from '@/shared/api/authApi'
import { getApiEndpointUrl } from '@/shared/api/baseApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import { LoginForm, LoginHero, type LoginFormValues } from './components'
import styles from './styles.module.css'

function LoginPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false)
  const [login, { isLoading }] = useLoginMutation()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap()
      navigate('/')
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error),
          title: t('signInFailed'),
          variant: 'error',
        }),
      )
    }
  }

  const onGoogleLogin = () => {
    setIsGoogleLoginLoading(true)
    window.location.assign(getApiEndpointUrl('/auth/oauth/google'))
  }

  return (
    <main className={`${styles['login']} ui-enter`}>
      <section className={styles['login__shell']}>
        <LoginHero />
        <LoginForm
          isGoogleLoginLoading={isGoogleLoginLoading}
          isLoading={isLoading}
          onGoogleLogin={onGoogleLogin}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  )
}

export default LoginPage
