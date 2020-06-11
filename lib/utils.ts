/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewTicketEntry } from './types'

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String
}

export const parseString = (string: any, objectKey: string): string => {
  if (!string || !isString(string)) {
    throw new Error(`Incorrect or missing ${objectKey}: ${string}`)
  }

  return string
}

export const toNewTicketEntry = (object: any): NewTicketEntry => {
  const agency = parseString(object.agency, 'Agency')
  const discountGroupId = parseString(object.discountGroupId, 'DiscountGroupId')
  const ticketTypeId = parseString(object.ticketTypeId, 'ticketTypeId')
  return {
    agency,
    discountGroupId,
    ticketTypeId
  }
}
