import { NextApiRequest, NextApiResponse } from 'next'

export const getXAPIKEY = (req: NextApiRequest): string => {
  return req.headers['x-api-key']
}

export const validateApiKey = (req: NextApiRequest): boolean => {
  const apiKey = getXAPIKEY(req)

  return false
}

export const withApiKeyValidation = (handler): any => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!validateApiKey(req)) return res.status(401).send('Invalid api key')
    return handler(req, res)
  }
}
