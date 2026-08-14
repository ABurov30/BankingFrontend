import type { components, operations } from './schema'

export type ApiSchema = components['schemas']
export type ApiOperation = operations

export type SignupRequestDto = ApiSchema['SignupRequestDto']
export type LoginRequestDto = ApiSchema['LoginRequestDto']
export type AccountCurrencyValue = NonNullable<
  ApiSchema['CreateAccountRequestDto']['currency']
>
export type CreateAccountRequestDto = Omit<
  ApiSchema['CreateAccountRequestDto'],
  'currency'
> & {
  currency: AccountCurrencyValue
}
export type CreateAccountResponseDto = ApiSchema['CreateAccountResponseDto']
export type UpdateAccountBalanceRequestDto =
  ApiSchema['UpdateAccountBalanceRequestDto']
export type CreateTransactionRequestDto =
  ApiSchema['CreateTransactionRequestDto']
export type TransactionResponseDto = Omit<
  ApiSchema['TransactionResponseDto'],
  'sourceAccount' | 'targetAccount'
> & {
  sourceAccount?: GetAccountResponseDto
  targetAccount?: GetAccountResponseDto
}
export type GetAccountResponseDto = Omit<
  ApiSchema['GetAccountResponseDto'],
  'currency'
> & {
  currency?: AccountCurrencyValue
}
export type GetAccountWithCardsResponseDto = Omit<
  ApiSchema['GetAccountWithCardsResponseDto'],
  'account' | 'cards'
> & {
  account?: GetAccountResponseDto
  cards?: GetCardByAccountIdResponseDto[]
}
export type GetCardByAccountIdResponseDto =
  ApiSchema['GetCardByAccountIdResponseDto']
export type CreateCardRequestDto = ApiSchema['CreateCardRequestDto']
export type CreateCardResponseDto = ApiSchema['CreateCardResponseDto']
export type UpdateCardRequestDto = ApiSchema['UpdateCardRequestDto']
export type UpdateCardResponseDto = ApiSchema['UpdateCardResponseDto']
export type NotificationResponseDto = ApiSchema['NotificationResponseDto']
export type MarkNotificationsAsReadedRequestDto =
  ApiSchema['MarkNotificationsAsReadedRequestDto']
export type GetUserInfoResponseDto = ApiSchema['GetUserInfoResponseDto']
export type GetUserInfoWithAccountResponseDto = Omit<
  ApiSchema['GetUserInfoWithAccountResponseDto'],
  'accounts' | 'userInfo'
> & {
  accounts?: GetAccountWithCardsResponseDto[]
  userInfo?: GetUserInfoResponseDto
}
export type GetUserInfoWithAuthInfoResponseDto =
  ApiSchema['GetUserInfoWithAuthInfoResponseDto']
export type VerifyAuthUserByCodeRequestDto =
  ApiSchema['VerifyAuthUserByCodeRequestDto']
export type ChangePasswordRequestDto = ApiSchema['ChangePasswordRequestDto']
export type ChangeAuthUserRoleRequestDto =
  ApiSchema['ChangeAuthUserRoleRequestDto']
export type BlockAuthUserRequestDto = ApiSchema['BlockAuthUserRequestDto']
export type UnlockAuthUserRequestDto = ApiSchema['UnlockAuthUserRequestDto']

export type SignupOperation = ApiOperation['signup']
export type LoginOperation = ApiOperation['login']
export type LogoutOperation = ApiOperation['logout']
export type RefreshOperation = ApiOperation['refresh']
export type GetUserInfoOperation = ApiOperation['getUserInfo']
export type GetUserInfoWithAccountsByEmailOperation =
  ApiOperation['getUserInfoWithAccountsByEmail']
export type GetUserInfoByManagerOperation = ApiOperation['getUserInfoByManager']
export type GetAllUserInfoOperation = ApiOperation['getAllUserInfo']
export type CreateAccountOperation = ApiOperation['postCreateAccount']
export type TopUpAccountOperation = ApiOperation['topUpAccount']
export type WithdrawAccountOperation = ApiOperation['withdrawAccount']
export type CreateTransactionOperation = ApiOperation['createTransaction']
export type GetTransactionsByUserIdOperation =
  ApiOperation['getTransactionsByUserId']
export type FreezeAccountOperation = ApiOperation['freezeAccount']
export type UnfreezeAccountOperation = ApiOperation['unfreezeAccount']
export type GetAllAccountsWithCardsOperation =
  ApiOperation['getAllAccountsWithCards']
export type GetAccountsWithCardsByOwnerIdOperation =
  ApiOperation['getAccountsWithCardsByOwnerId']
export type CreateCardOperation = ApiOperation['createCard']
export type UpdateCardOperation = ApiOperation['updateCard']
export type GetNotificationsOperation = ApiOperation['getNotifications']
export type MarkNotificationsAsReadedOperation = ApiOperation['markAsReaded']
export type VerifyUserOperation = ApiOperation['verifyUser']
export type VerifyUserByManagerOperation = ApiOperation['verifyUserByManager']
export type UnlockUserByManagerOperation = ApiOperation['unlockUserByManager']
export type BlockUserByManagerOperation = ApiOperation['blockUserByManager']
export type ChangePasswordOperation = ApiOperation['changePassword']
export type ChangeAuthUserRoleOperation = ApiOperation['changeAuthUserRole']

export type SignupRequest =
  SignupOperation['requestBody']['content']['application/json']
export type LoginRequest =
  LoginOperation['requestBody']['content']['application/json']
export type GetUserInfoWithAccountsByEmailRequest =
  GetUserInfoWithAccountsByEmailOperation['requestBody']['content']['application/json']
export type VerifyUserRequest =
  VerifyUserOperation['requestBody']['content']['application/json']
export type UnlockUserByManagerRequest =
  UnlockUserByManagerOperation['requestBody']['content']['application/json']
export type BlockUserByManagerRequest =
  BlockUserByManagerOperation['requestBody']['content']['application/json']
export type ChangePasswordRequest =
  ChangePasswordOperation['requestBody']['content']['application/json']
export type ChangeAuthUserRoleRequest =
  ChangeAuthUserRoleOperation['requestBody']['content']['application/json']
export type CreateAccountRequest = CreateAccountRequestDto
export type UpdateAccountBalanceRequest =
  TopUpAccountOperation['requestBody']['content']['application/json']
export type CreateTransactionRequest =
  CreateTransactionOperation['requestBody']['content']['application/json']
export type GetTransactionsByUserIdResponse =
  GetTransactionsByUserIdOperation['responses'][200]['content']['*/*']
export type CreateCardRequest =
  CreateCardOperation['requestBody']['content']['application/json']
export type UpdateCardRequest =
  UpdateCardOperation['requestBody']['content']['application/json']
export type MarkNotificationsAsReadedRequest =
  MarkNotificationsAsReadedOperation['requestBody']['content']['application/json']
export type GetUserInfoWithAuthInfoResponse =
  GetUserInfoOperation['responses'][200]['content']['*/*']
export type GetUserInfoWithAccountsByEmailResponse =
  GetUserInfoWithAccountResponseDto
export type GetUserInfoByManagerResponse =
  GetUserInfoByManagerOperation['responses'][200]['content']['*/*']
export type GetAllUserInfoWithAuthInfoResponse =
  GetAllUserInfoOperation['responses'][200]['content']['*/*']

/** Application-facing user model, normalized from the API's user/auth wrapper. */
export type UserInfo = Omit<GetUserInfoResponseDto, 'status'> & {
  authUserId?: GetUserInfoResponseDto['autUserId']
  role?: GetUserInfoWithAuthInfoResponseDto['role']
  status?: GetUserInfoWithAuthInfoResponseDto['status']
}
export type CreateAccountResponse = GetAccountResponseDto
export type UpdateAccountBalanceResponse =
  TopUpAccountOperation['responses'][200]['content']['*/*']
export type GetAllAccountsWithCardsResponse = GetAccountWithCardsResponseDto[]
export type GetAccountsWithCardsByOwnerIdResponse =
  GetAccountWithCardsResponseDto[]
export type CreateCardResponse =
  CreateCardOperation['responses'][200]['content']['*/*']
export type UpdateCardResponse =
  UpdateCardOperation['responses'][200]['content']['*/*']
export type GetNotificationsResponse =
  GetNotificationsOperation['responses'][200]['content']['*/*']
