import { NextApiRequest, NextApiResponse } from 'next'
import { isString } from './utils'

export const getXAPIKEY = (req: NextApiRequest): string | false =>
  isString(req.headers['x-api-key']) && req.headers['x-api-key']

export const authenticateApiKey = (req: NextApiRequest): boolean => {
  const apiKey = getXAPIKEY(req)
  if (apiKey) {
    // validate
  }
  return false
}

export const withApiKeyAuthentication = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) => (req: NextApiRequest, res: NextApiResponse): Promise<void> | void => {
  if (!authenticateApiKey(req)) return res.status(401).send('Invalid api key')
  return handler(req, res)
}
