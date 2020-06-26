import { NextApiRequest, NextApiResponse } from 'next'
import { getTickets } from '../../../lib/ticket-service'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { createJWT } from '../../../lib/utils'

/**
 * @swagger
 *
 * /api/ticket:
 *   get:
 *     summary: List tickets saved in the backend
 *     description: Lists all tickets saved in the tickets.csv 
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                ticketdata:
 *                  type: object
 *                  properties:
 *                    uuid:
 *                      type: string
 *                      example: be78e1f9-e4a4-48d2-b9fe-50aa335e5371
 *                    agency:
 *                      type: string
 *                      example: jt-line
 *                    ticketTypeId:
 *                      type: string
 *                      example: island-hopping
 *                    validFrom:
 *                      type: string
 *                      example: 2020-06-25T15:56:18+03:00
 *                    validTo:
 *                      type: string
 *                      example: 2020-06-26T03:00:00+03:00
 *                    ticket:
 *                      type: string
 *                      example: <div> ...Ticket... </div>
 *                      description: "The ticket in html format"
 *                    validUntil:
 *                      type: string
 *                      description: "Validity"
 *       '404':
 *         description: A ticket with the ticketId was not found
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const tickets = await getTickets()

  const jwToken = await createJWT({ tickets })
  res.json(jwToken)
}

export default withApiKeyAuthentication(handler)
