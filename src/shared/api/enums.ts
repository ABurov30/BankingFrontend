import type {
  ChangeAuthUserRoleRequestDto,
  CreateAccountRequestDto,
  GetAccountResponseDto,
  GetCardByAccountIdResponseDto,
  GetUserInfoResponseDto,
} from './types'

export type AccountCurrency = CreateAccountRequestDto['currency']
export type AccountType = CreateAccountRequestDto['type']
export type AccountStatus = NonNullable<GetAccountResponseDto['status']>
export type AuthUserStatus = NonNullable<GetUserInfoResponseDto['status']>
export type Role = ChangeAuthUserRoleRequestDto['role']
export type CardStatus = NonNullable<GetCardByAccountIdResponseDto['status']>
export type UserProfileStatus = NonNullable<GetUserInfoResponseDto['status']>

export const AccountCurrency = {
  CNY: 'CNY',
  EUR: 'EUR',
  GBP: 'GBP',
  RUB: 'RUB',
  USD: 'USD',
} as const satisfies Record<AccountCurrency, AccountCurrency>

export const AccountType = {
  CHECKING: 'CHECKING',
  CREDIT: 'CREDIT',
  SAVINGS: 'SAVINGS',
} as const satisfies Record<AccountType, AccountType>

export const AccountStatus = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  FROZEN: 'FROZEN',
} as const satisfies Record<AccountStatus, AccountStatus>

export const AuthUserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
} as const satisfies Record<AuthUserStatus, AuthUserStatus>

export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const satisfies Record<Role, Role>

export const CardStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  EXPIRED: 'EXPIRED',
  FROZEN: 'FROZEN',
} as const satisfies Record<CardStatus, CardStatus>

export const UserProfileStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
} as const satisfies Record<UserProfileStatus, UserProfileStatus>

export const accountCurrencyOptions = Object.values(AccountCurrency)
export const accountTypeOptions = Object.values(AccountType)
export const accountStatusOptions = Object.values(AccountStatus)
export const authUserStatusOptions = Object.values(AuthUserStatus)
export const roleOptions = Object.values(Role)
export const cardStatusOptions = Object.values(CardStatus)
export const userProfileStatusOptions = Object.values(UserProfileStatus)
