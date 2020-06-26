import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { isString, toNewTicketEntry } from '../../../lib/utils'
import { NewTicketEntry, Ticket } from '../../../lib/types'
import { postTicketToCRD } from '../../../lib/crd'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { TicketRequestValidationError } from 'lib/errors'

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
 *             agency
 *             discountGroupId
 *             ticketTypeId
 *           properties:
 *             agency:
 *               type: string
 *               example: jt-line
 *               description: ferry agency
 *             discountGroupId:
 *               type: string
 *               example: adult
 *               description: discount group
 *             ticketTypeId:
 *               type: string
 *               example: 1
 *               description: ID of the ticket type
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
 *       '500':
 *         description: Server error
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ Error: 'Cannot GET' })
  }

  let newTicketEntry: NewTicketEntry

  try {
    newTicketEntry = toNewTicketEntry(req.body)
  } catch (error) {
    return res.status(400).send(error.message)
  }

  let ticket: Ticket

  try {
    ticket = await createTicket(newTicketEntry)
  } catch (error) {
    if (error instanceof TicketRequestValidationError) {
      return res.status(400).send(error.message)
    }
    return res.status(500).send(error.message)
  }

  // const crdUrl = process.env.CRD_URL
  // const apiToken = process.env.CRD_TOKEN
  // if (!isString(crdUrl) || !isString(apiToken)) {
  //   return res.status(500).send('Server configuration error')
  // }
  // const crdResponse = await postTicketToCRD(crdUrl, apiToken, ticket)

  // if (crdResponse.failed) {
  //   return res.send(502)
  // }

  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}

export default withApiKeyAuthentication(handler)
