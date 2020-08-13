import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { isString, parseNumber } from '../../../lib/utils'
import { postTicketToCRD } from '../../../lib/crd'
import {
  withApiKeyAuthentication,
  withErrorHandler,
} from '../../../lib/middleware'
import { BarTraceError } from '../../../lib/errors'

/**
 * @swagger
 *
 * /api/ticket:
 *   post:
 *     summary: Ticket purchase
 *     description: Creates a ticket and returns the UUID of the created ticket
 *
 *     parameters:
 *       - in: body
 *         required: true
 *         description: the ticket to buy
 *         schema:
 *           type: object
 *           required:
 *             ticketOptionId
 *           properties:
 *             ticketOptionId:
 *               type: number
 *               example: 1
 *               description: ID of the ticket option
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                    type: string
 *                    example: 20ca08a3-dfd9-4b74-97bf-eb414e143def
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Invalid api key
 *       '404':
 *         description: TicketOptionId is invalid
 *       '405':
 *         desciption: Method not allowed
 *       '500':
 *         description: Server error
 *       '502':
 *         description: Failed to send ticket information to the ticket provider backend
 */
export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Cannot GET' })
  }
  const ticketOptionId = parseNumber('ticketOptionId', req.body.ticketOptionId)

  const ticket = await createTicket(ticketOptionId)

  if (process.env.ALLOW_CRD === 'allow') {
    const crdUrl = process.env.CRD_URL
    const apiToken = process.env.CRD_TOKEN
    if (!isString(crdUrl) || !isString(apiToken)) {
      return res.status(500).send('Server configuration error')
    }
    const crdResponse = await postTicketToCRD(crdUrl, apiToken, ticket)

    if (crdResponse.success === 0) {
      throw new BarTraceError(
        crdResponse,
        'Unable to send ticket to the ticket provider backend',
      )
    }
  }

  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}

export default withApiKeyAuthentication(withErrorHandler(handler))
