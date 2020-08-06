import { CrdResponse } from './types'

export class TicketRequestValidationError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class TicketNotFoundError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class TicketOptionNotFoundError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class TypeValidationError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class BarTraceError extends Error {
  crdResponse: CrdResponse

  constructor(crdResponse: CrdResponse, message?: string) {
    super(message)
    this.crdResponse = crdResponse
  }
}
