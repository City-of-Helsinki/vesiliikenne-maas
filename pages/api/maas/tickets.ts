import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import moment from 'moment-timezone'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { calculateTicketValidTo } from '../../../lib/ticket-service'
import { parseNumber } from '../../../lib/utils'
import { TSPTicket } from '../../../lib/types'

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
 *                     description: "How long ticket is valid in seconds"
 *       '401':
 *         description: Invalid api key
 *       '500':
 *         description: Server error
 */

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let startTime: number

  try {
    startTime = parseNumber(req.query.startTime)
  } catch (error) {
    return res.status(400).send(error.message)
  }

  const endTimeInMilliseconds = calculateTicketValidTo(
    moment(startTime),
  ).valueOf()

  const validityseconds = moment
    .duration(endTimeInMilliseconds - startTime, 'milliseconds')
    .asSeconds()

  try {
    const tickets = JSON.parse(
      await fs.readFile('./JTline-tickets.json', 'utf-8'),
    ) as TSPTicket[]

    const ticketsWithSeconds = tickets.map(ticket => ({
      ...ticket,
      validityseconds,
    }))

    res.json(ticketsWithSeconds)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

export default withApiKeyAuthentication(handler)
