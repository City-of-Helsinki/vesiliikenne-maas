import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import { withApiKeyAuthentication } from '../../../lib/middleware'

/**
 * @swagger
 *
 * /api/maas/tickets:
 *   get:
 *     summary: Lists tickets available for purchase
 *     description: Lists tickets provided by JT-Line for purchase via the MaaS app
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: "Ticket id"
 *                   description:
 *                     type: string
 *                     description: "Ticket description"
 *                   name:
 *                     type: string
 *                     description: "Ticket name"
 *                   amount:
 *                     type: number
 *                     description: "Ticket price"
 *                   currency:
 *                     type: string
 *                     description: "Ticket currency"
 *                   validityseconds:
 *                     type: number
 *                     description: "How long ticket is available"
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
