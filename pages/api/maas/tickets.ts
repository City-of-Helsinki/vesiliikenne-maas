import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import { withApiKeyAuthentication } from '../../../lib/middleware'

/**
 * @swagger
 *
 * /api/maas/tickets:
 *   post:
 *     summary: Lists tickets available for purchase
 *     description: Lists tickets provided by JT-Line for purchase via the MaaS app
 *     responses:
 *       '200':
 *         description: Success
 *       '401':
 *         description: Invalid api key
 *       '500':
 *         description: Server error
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.json(await fs.readFile('./JTline-tickets.json'))
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

export default withApiKeyAuthentication(handler)
