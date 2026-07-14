import type { components, operations } from './schema'

export type ApiSchema = components['schemas']
export type ApiOperation = operations

export type SignupRequestDto = ApiSchema['SignupRequestDto']
export type LoginRequestDto = ApiSchema['LoginRequestDto']

export type SignupOperation = ApiOperation['Signup']
export type LoginOperation = ApiOperation['Login']
export type LogoutOperation = ApiOperation['Logout']

export type SignupRequest =
  SignupOperation['requestBody']['content']['application/json']
export type LoginRequest =
  LoginOperation['requestBody']['content']['application/json']
