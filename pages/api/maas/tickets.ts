import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment-timezone'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import {
  calculateTicketValidTo,
  getTicketOptions,
} from '../../../lib/ticket-service'
import { parseNumber } from '../../../lib/utils'

/**
 * @swagger
 *
 * /api/maas/tickets:
 *   get:
 *     summary: Lists tickets available for purchase
 *     description: Lists tickets provided by ferry operators for purchase via the MaaS app
 *
 *     parameters:
 *       - name: startTime
 *         in: query
 *         required: true
 *         description: POSIX time in milliseconds
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
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
 *                   logoId:
 *                     type: string
 *                     description: "Id of the logo to display"
 *                   description:
 *                     type: string
 *                     description: "Ticket description"
 *                   name:
 *                     type: string
 *                     description: "Ticket name"
 *                   amount:
 *                     type: string
 *                     description: "Ticket price"
 *                   currency:
 *                     type: string
 *                     description: "Ticket currency"
 *                   validityseconds:
 *                     type: number
 *                     description: "How long ticket is valid in seconds"
 *       '400':
 *         description: Invalid startTime parameter
 *       '401':
 *         description: Invalid api key
 *       '500':
 *         description: Server error
 */

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let startTime

  try {
    startTime = parseNumber(req.query.startTime)
  } catch (error) {
    return res.status(400).send(`Invalid parameter startTime: ${error.message}`)
  }

  const endTimeInMilliseconds = calculateTicketValidTo(
    moment.tz(startTime, 'Europe/Helsinki'),
  ).valueOf()

  const validityseconds = Math.ceil(
    moment
      .duration(endTimeInMilliseconds - startTime, 'milliseconds')
      .asSeconds(),
  )

  try {
    const tickets = await getTicketOptions()

    const ticketsWithSeconds = tickets.map(ticket => ({
      ...ticket,
      validityseconds,
    }))

    res.json(ticketsWithSeconds)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Failed getting ticket options')
  }
}

export default withApiKeyAuthentication(handler)
