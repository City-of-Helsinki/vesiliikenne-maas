import { NextApiRequest, NextApiResponse } from 'next'
import { isString } from './utils'

export const getXAPIKEY = (
  req: Pick<NextApiRequest, 'headers'>,
): string | false =>
  isString(req.headers['x-api-key']) && req.headers['x-api-key']

export const authenticateApiKey = (
  req: Pick<NextApiRequest, 'headers'>,
  token: string,
): boolean => {
  const apiKey = getXAPIKEY(req)
  return apiKey === token
}

export const withApiKeyAuthentication = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) => (req: NextApiRequest, res: NextApiResponse): Promise<void> | void => {
  const token = process.env.API_TOKEN || ''
  if (!authenticateApiKey(req, token))
    return res.status(401).send('Invalid api key')
  return handler(req, res)
}
