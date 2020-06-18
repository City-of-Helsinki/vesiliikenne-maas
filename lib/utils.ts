/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewTicketEntry } from './types'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs/promises'

export const isString = (text: any): text is string => {
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
    ticketTypeId,
  }
}

export const readPublicKeyData = async () => {
  return await fs.readFile('./public_key.pem', 'utf8')
}

const readPrivateKeyData = async () => {
  return await fs.readFile('./private_key.pem', 'utf8')
}

export const createJWT = async (object: any): Promise<string> => {
  const privatekey = await readPrivateKeyData()
  const jwtoken = jsonwebtoken.sign(object, privatekey, { algorithm: 'RS256' })
  return jwtoken
}
