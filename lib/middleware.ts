import { NextApiRequest } from 'next'

export const getXAPIKEY = (req: NextApiRequest): string => {
  return req.headers['x-api-key']
}

export const validateApiKey = (req: NextApiRequest): boolean => {
  const apiKey = getXAPIKEY(req)

  return false
}
