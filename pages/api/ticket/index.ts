import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { isString } from '../../../lib/utils'
import { Ticket } from '../../../lib/types'
import { postTicketToCRD } from '../../../lib/crd'
import { withApiKeyAuthentication } from '../../../lib/middleware'

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
 *       '500':
 *         description: Server error
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Cannot GET' })
  }
  const ticketOptionId = req.body.ticketOptionId
  if (isNaN(ticketOptionId)) {
    return res.status(400).json({
      error: `Invalid parameter ticketOptionId: ${ticketOptionId} is not a number`,
    })
  }
  let ticket: Ticket

  try {
    ticket = await createTicket(ticketOptionId, 'en')
  } catch (error) {
    console.error(error)
    if (error instanceof TypeError) {
      return res.status(400).json({ error: 'Invalid ticketOptionId' })
    }

    return res.status(500).send('Failed creating ticket')
  }

  const crdUrl = process.env.CRD_URL
  const apiToken = process.env.CRD_TOKEN
  if (!isString(crdUrl) || !isString(apiToken)) {
    return res.status(500).send('Server configuration error')
  }

  if (process.env.ALLOW_CRD === 'allow') {
    const crdResponse = await postTicketToCRD(crdUrl, apiToken, ticket)

    if (crdResponse.failed) {
      return res.status(502).send('bartrace response failed')
    }
  }

  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}

export default withApiKeyAuthentication(handler)
