import { NextApiRequest, NextApiResponse } from 'next'
import { isString } from './utils'
import bcrypt from 'bcryptjs'
import {
  TicketNotFoundError,
  TicketRequestValidationError,
  TicketOptionNotFoundError,
} from '../lib/errors'

const MAAS_API_KEY_HASH = process.env.MAAS_API_KEY_HASH || ''

export const getXAPIKEY = (
  req: Pick<NextApiRequest, 'headers'>,
): string | false =>
  isString(req.headers['x-api-key']) && req.headers['x-api-key']

export const authenticateApiKey = async (
  req: Pick<NextApiRequest, 'headers'>,
  hash: string,
): Promise<boolean> => {
  const apiKey = getXAPIKEY(req)
  return apiKey ? await bcrypt.compare(apiKey, hash) : false
}

export const withApiKeyAuthentication = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const validApiKey = await authenticateApiKey(req, MAAS_API_KEY_HASH)
  if (!validApiKey) return res.status(401).send('Invalid api key')
  return handler(req, res)
}

export const withErrorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const response = await handler(req, res)
    return response
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      req.url && console.error(`Request URL: ${req.url}`)
      console.error(error)
    }

    if (error instanceof TypeError)
      return res.status(400).json({ message: error.message })
    if (error instanceof TicketRequestValidationError)
      return res.status(400).json({ message: error.message })
    if (error instanceof TicketNotFoundError)
      return res.status(404).json({ message: error.message })
    if (error instanceof TicketOptionNotFoundError)
      return res.status(404).json({ message: error.message })

    return res.status(500).json({ message: 'internal server error' })
  }
}
