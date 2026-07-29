import type { components, operations } from './schema'

export type ApiSchema = components['schemas']
export type ApiOperation = operations

export type SignupRequestDto = ApiSchema['SignupRequestDto']
export type LoginRequestDto = ApiSchema['LoginRequestDto']
export type CreateAccountRequestDto = ApiSchema['CreateAccountRequestDto']
export type CreateAccountResponseDto = ApiSchema['CreateAccountResponseDto']
export type GetAccountResponseDto = ApiSchema['GetAccountResponseDto']
export type GetAccountWithCardsResponseDto =
  ApiSchema['GetAccountWithCardsResponseDto']
export type GetCardByAccountIdResponseDto =
  ApiSchema['GetCardByAccountIdResponseDto']
export type CreateCardRequestDto = ApiSchema['CreateCardRequestDto']
export type CreateCardResponseDto = ApiSchema['CreateCardResponseDto']
export type UpdateCardRequestDto = ApiSchema['UpdateCardRequestDto']
export type UpdateCardResponseDto = ApiSchema['UpdateCardResponseDto']
export type GetUserInfoResponseDto = ApiSchema['GetUserInfoResponseDto']
export type VerifyAuthUserByCodeRequestDto =
  ApiSchema['VerifyAuthUserByCodeRequestDto']
export type ChangePasswordRequestDto = ApiSchema['ChangePasswordRequestDto']
export type ChangeAuthUserRoleRequestDto =
  ApiSchema['ChangeAuthUserRoleRequestDto']
export type BlockAuthUserRequestDto = ApiSchema['BlockAuthUserRequestDto']
export type UnlockAuthUserRequestDto = ApiSchema['UnlockAuthUserRequestDto']

export type SignupOperation = ApiOperation['Signup']
export type LoginOperation = ApiOperation['Login']
export type LogoutOperation = ApiOperation['Logout']
export type RefreshOperation = ApiOperation['Refresh']
export type GetUserInfoOperation = ApiOperation['getUserInfo']
export type GetAllUserInfoOperation = ApiOperation['getAllUserInfo']
export type CreateAccountOperation = ApiOperation['postCreateAccount']
export type FreezeAccountOperation = ApiOperation['freezeAccount']
export type GetAllAccountsWithCardsOperation =
  ApiOperation['getAllAccountsWithCards']
export type GetAccountsWithCardsByOwnerIdOperation =
  ApiOperation['getAccountsWithCardsByOwnerId']
export type CreateCardOperation = ApiOperation['createCard']
export type UpdateCardOperation = ApiOperation['updateCard']
export type VerifyUserOperation = ApiOperation['VerifyUser']
export type VerifyUserByManagerOperation = ApiOperation['VerifyUserByManager']
export type UnlockUserByManagerOperation = ApiOperation['UnlockUserByManager']
export type BlockUserByManagerOperation = ApiOperation['BlockUserByManager']
export type ChangePasswordOperation = ApiOperation['ChangePassword']
export type ChangeAuthUserRoleOperation = ApiOperation['ChangeAuthUserRole']

export type SignupRequest =
  SignupOperation['requestBody']['content']['application/json']
export type LoginRequest =
  LoginOperation['requestBody']['content']['application/json']
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
export type CreateAccountRequest =
  CreateAccountOperation['requestBody']['content']['application/json']
export type CreateCardRequest =
  CreateCardOperation['requestBody']['content']['application/json']
export type UpdateCardRequest =
  UpdateCardOperation['requestBody']['content']['application/json']
export type GetUserInfoResponse =
  GetUserInfoOperation['responses'][200]['content']['*/*']
export type GetAllUserInfoResponse =
  GetAllUserInfoOperation['responses'][200]['content']['*/*']
export type CreateAccountResponse =
  CreateAccountOperation['responses'][200]['content']['*/*']
export type GetAllAccountsWithCardsResponse =
  GetAllAccountsWithCardsOperation['responses'][200]['content']['*/*']
export type GetAccountsWithCardsByOwnerIdResponse =
  GetAccountsWithCardsByOwnerIdOperation['responses'][200]['content']['*/*']
export type CreateCardResponse =
  CreateCardOperation['responses'][200]['content']['*/*']
export type UpdateCardResponse =
  UpdateCardOperation['responses'][200]['content']['*/*']
