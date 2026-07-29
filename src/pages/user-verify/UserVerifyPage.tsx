import { useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useAppDispatch } from '@/app/hooks'
import { showToast } from '@/features/toast/toastSlice'
import { useVerifyUserMutation } from '@/shared/api/authApi'
import { getApiErrorMessage } from '@/shared/api/error'
import { useI18n } from '@/shared/i18n/useI18n'
import { VerificationPanel } from './components'

type VerificationParams = {
  authUserId: string | null
  verificationCode: string | null
}

function UserVerifyPage() {
  const dispatch = useAppDispatch()
  const { t } = useI18n()
  const params = useParams<{
    authUserId?: string
    verificationCode?: string
  }>()
  const [searchParams] = useSearchParams()
  const [verifyUser, { error, isError, isLoading, isSuccess }] =
    useVerifyUserMutation()
  const requestSentRef = useRef(false)
  const verificationParams = useMemo<VerificationParams>(
    () => ({
      authUserId:
        searchParams.get('authUserId') ??
        searchParams.get('userId') ??
        params.authUserId ??
        null,
      verificationCode:
        searchParams.get('verificationCode') ??
        searchParams.get('code') ??
        params.verificationCode ??
        null,
    }),
    [params.authUserId, params.verificationCode, searchParams],
  )
  const hasRequiredParams = Boolean(
    verificationParams.authUserId && verificationParams.verificationCode,
  )

  useEffect(() => {
    if (!hasRequiredParams || requestSentRef.current) {
      return
    }

    requestSentRef.current = true
    verifyUser({
      authUserId: verificationParams.authUserId as string,
      verificationCode: verificationParams.verificationCode as string,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToast({
            message: t('verificationSuccess'),
            title: t('verificationEmailVerified'),
            variant: 'success',
          }),
        )
      })
      .catch((requestError) => {
        dispatch(
          showToast({
            message: getApiErrorMessage(requestError),
            title: t('verificationFailed'),
            variant: 'error',
          }),
        )
      })
  }, [dispatch, hasRequiredParams, t, verificationParams, verifyUser])

  return (
    <VerificationPanel
      error={error}
      hasRequiredParams={hasRequiredParams}
      isError={isError}
      isLoading={isLoading}
      isSuccess={isSuccess}
    />
  )
}

export default UserVerifyPage
