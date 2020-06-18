import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { isString, toNewTicketEntry } from '../../../lib/utils'
import { NewTicketEntry } from '../../../lib/types'
import { postTicketToCRD } from '../../../lib/crd'
import { withApiKeyAuthentication } from '../../../lib/middleware'

/**
 * @swagger
 *
 * /api/ticket:
 *   post:
 *     summary: Ticket purchase
 *     description: Creates a ticket and returns the UUID of the created ticket
 *     responses:
 *       '200':
 *         description: Success
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

  const ticket = createTicket(newTicketEntry)

  const crdUrl = process.env.CRD_URL
  const apiToken = process.env.CRD_TOKEN
  if (!isString(crdUrl) || !isString(apiToken)) {
    return res.status(500).send('Server configuration error')
  }
  const crdResponse = await postTicketToCRD(crdUrl, apiToken, ticket)

  if (crdResponse.failed) {
    return res.send(502)
  }

  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}

export default withApiKeyAuthentication(handler)
