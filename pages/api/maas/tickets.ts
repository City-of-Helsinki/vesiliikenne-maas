import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment-timezone'
import {
  withApiKeyAuthentication,
  withErrorHandler,
} from '../../../lib/middleware'
import {
  calculateTicketValidTo,
  getTicketOptions,
} from '../../../lib/ticket-service'
import { parseNumber, parseLocale, dateBetween } from '../../../lib/utils'

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
 *       - name: locale
 *         in: query
 *         required: false
 *         description: Language used in tickets. Currently supported languages are 'fi' and 'en'. Defaults to english.
 *         example: 'fi'
 *         schema:
 *           type: string
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
 *                   logoData:
 *                     type: string
 *                     description: Base64 encoded SVG of the logo.
 *                     example: PHN2ZyB3aWR0aD0iNzExL...
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
 *                     example: "Show ticket to inspector when boarding the ferry."
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

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const language = parseLocale(req.query.locale)

  const startTime = parseNumber('startTime', req.query.startTime)

  const endTimeInMilliseconds = calculateTicketValidTo(
    moment.tz(startTime, 'Europe/Helsinki'),
  ).valueOf()

  const validityseconds = Math.ceil(
    moment
      .duration(endTimeInMilliseconds - startTime, 'milliseconds')
      .asSeconds(),
  )

  const ticketOptions = await getTicketOptions(language)

  const ticketOptionsWithSeconds = ticketOptions.map(ticket => ({
    ...ticket,
    validityseconds,
  }))

  // TODO: This block is for the launch campaign discount.
  // TODO: Remove after launch campaign is done.
  const campaignStart = moment('2020-09-26 00:00')
  const campaignEnd = moment('2020-09-28 00:00')
  if (dateBetween(campaignStart, campaignEnd, moment())) {
    const ticketsWithReducedPrice = ticketOptionsWithSeconds.map(ticketOption =>
      ticketOption.id === 1
        ? { ...ticketOption, amount: '10.00' }
        : ticketOption,
    )
    return res.json(ticketsWithReducedPrice)
  }

  res.json(ticketOptionsWithSeconds)
}

export default withApiKeyAuthentication(withErrorHandler(handler))
