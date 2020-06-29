import { NextApiRequest, NextApiResponse } from 'next'

/**
 *
 * /api/dev-api-key:
 *   get:
 *     summary: Dev api key
 *     description:  MaaS api key for frontend development
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === 'development') {
    res.json({ apikey: process.env.DEV_API_KEY })
  }
}
