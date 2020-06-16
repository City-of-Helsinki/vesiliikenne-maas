import { NextApiRequest, NextApiResponse } from 'next'
import { isString } from './utils'
import bcrypt from 'bcrypt'

const WHIM_API_KEY_HASH = process.env.WHIM_API_KEY_HASH || ''

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
  const validApiKey = await authenticateApiKey(req, WHIM_API_KEY_HASH)
  if (!validApiKey) return res.status(401).send('Invalid api key')
  return handler(req, res)
}
