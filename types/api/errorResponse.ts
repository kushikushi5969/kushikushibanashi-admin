import { ErrorResponse } from './error'

export const NotFoundResponse: ErrorResponse = {
  message: 'Item is not found.',
} as const
export const UnAuthorized: ErrorResponse = {
  message: 'Un Authorized.',
} as const

export const ServerError: ErrorResponse = {
  message: 'Internal Server Error.',
} as const

export const BadRequest: ErrorResponse = {
  message: 'Request is invalid.',
} as const
