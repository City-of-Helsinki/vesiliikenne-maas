/* eslint-disable @typescript-eslint/no-explicit-any */
import jsonwebtoken from 'jsonwebtoken'
import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { isLeft } from 'fp-ts/lib/Either'

export const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String
}

export const parseString = (string: any, objectKey: string): string => {
  if (!string || !isString(string)) {
    throw new TypeError(`Incorrect or missing ${objectKey}: ${string}`)
  }

  return string
}

export const parseNumber = (objectKey: string, num: any): number => {
  if (isNaN(num) || !num) {
    throw new TypeError(`${objectKey} is not a number: ${num}`)
  }
  return Number(num)
}

export const parseLocale = (locale: string | string[]): string =>
  locale ? locale.toString() : 'en'

export const validate = <A, I, O>(
  runtimeType: t.Type<A, O, I>,
  inputToValidate: I,
): A => {
  const errorOrResult = runtimeType.decode(inputToValidate)
  if (isLeft(errorOrResult)) {
    throw new TypeError(PathReporter.report(errorOrResult).toString())
  } else {
    return errorOrResult.right
  }
}

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
