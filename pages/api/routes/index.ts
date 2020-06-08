import { getFilteredRoutes } from '../../../lib/create-routes-json'
import { NextApiResponse } from 'next'

/**
 * @swagger
 *
 * /api/routes:
 *   get:
 *     summary: JT-Line ferry routes
 *     description: Returns JT-Line ferry routes and their patterns. Fetched from [digitransit](https://digitransit.fi/en/developers/)
 *     parameters:
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Routes not found
 */
export default async (_, res: NextApiResponse) => {
  res.json(await getFilteredRoutes())
}
