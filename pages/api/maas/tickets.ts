import { NextApiRequest, NextApiResponse } from 'next'
import moment, { lang } from 'moment-timezone'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import {
  calculateTicketValidTo,
  getTicketOptions,
} from '../../../lib/ticket-service'
import { parseNumber } from '../../../lib/utils'
import { isString } from 'util'
import { constant } from 'fp-ts/lib/function'

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
 *                     type: number
 *                     description: "Ticket id"
 *                     example: 1
 *                   logoId:
 *                     type: string
 *                     description: "Id of the logo to display"
 *                     example: "waterbus.png"
 *                   agency:
 *                     type: string
 *                     example: waterbusOY
 *                   discountGroup:
 *                     type: string
 *                     example: adult
 *                   description:
 *                     type: string
 *                     description: "Ticket description"
 *                     example: "Hop-on hop-off ticket"
 *                   instructions:
 *                     type: string
 *                     description: "Instructions how to use the ticket"
 *                     example: "show ticket to inspector when boarding the ferry"
 *                   ticketName:
 *                     type: string
 *                     description: "Ticket name"
 *                     example: "island hopping"
 *                   amount:
 *                     type: string
 *                     description: "Ticket price"
 *                     example: "10.00"
 *                   currency:
 *                     type: string
 *                     description: "Ticket currency"
 *                     example: "EUR"
 *                   validityseconds:
 *                     type: number
 *                     description: "How long ticket is valid in seconds"
 *                     example: 124232
 *       '400':
 *         description: Invalid startTime parameter
 *       '401':
 *         description: Invalid api key
 *       '500':
 *         description: Server error
 */

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let startTime
  const language = req.query.locale ? req.query.locale.toString() : undefined
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
    const tickets = await getTicketOptions(language)

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
