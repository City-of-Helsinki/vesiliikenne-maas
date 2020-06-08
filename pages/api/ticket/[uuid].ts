import { renderToString } from 'react-dom/server'
import TicketContainer from '../../components/TicketContainer'
import { qrCodeWithTicketDetails } from '../../../src/ticket-renderer'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 *
 * /api/ticket/{ticketId}:
 *   get:
 *     summary: Ticket display
 *     description: Returns user ticket in [HSL OpenMaaS Ticket API format](https://sales-api.hsl.fi/ticket-api-doc#operation/Render%20Ticket)
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: ticket id
 *         schema:
 *           type: string
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
 *                    ticket:
 *                      type: string
 *                      description: "The ticket in html format"
 *                    validUntil:
 *                      type: string
 *                      description: "Validity"
 *       '404':
 *         description: A ticket with the ticketId was not found
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid } = req.query
  if (typeof uuid !== 'string')
    throw new Error('Argument uuid is not of type string')
  const [qrCodeContents, ticket] = await qrCodeWithTicketDetails(uuid)
  const html = renderToString(
    TicketContainer({
      ticketType: ticket.ticketTypeId,
      validUntil: new Date(ticket.validTo),
      qrCodeContents
    })
  )

  res.json({ ticketdata: { ...ticket, ticket: html } })
}
