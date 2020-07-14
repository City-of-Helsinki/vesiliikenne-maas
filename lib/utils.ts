/* eslint-disable @typescript-eslint/no-explicit-any */
import jsonwebtoken from 'jsonwebtoken'

export const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String
}

export const parseString = (string: any, objectKey: string): string => {
  if (!string || !isString(string)) {
    throw new Error(`Incorrect or missing ${objectKey}: ${string}`)
  }

  return string
}

export const parseNumber = (num: any): number => {
  if (isNaN(num) || !num) {
    throw new Error(`${num} is not a number`)
  }
  return Number(num)
}

export const parseLocale = (locale: string | string[]): string =>
  locale ? locale.toString() : 'en'

const base64decode = (input: string): string =>
  Buffer.from(input, 'base64').toString('utf-8')

const base64encode = (input: string): string =>
  Buffer.from(input).toString('base64')

export const readPublicKeyData = (): string => {
  return base64decode(process.env.GWT_SIGNING_PUBLIC_KEY_BASE64 || '')
}

const readPrivateKeyData = (): string => {
  return base64decode(process.env.GWT_SIGNING_PRIVATE_KEY_BASE64 || '')
}

export const createJWT = async (object: any): Promise<string> => {
  const privatekey = readPrivateKeyData()
  return jsonwebtoken.sign(object, privatekey, { algorithm: 'RS256' })
}
