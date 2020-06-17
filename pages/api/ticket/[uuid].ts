import { renderToString } from 'react-dom/server'
import qrcode from 'qrcode'
import moment from 'moment-timezone'
import TicketContainer from '../../../components/TicketContainer'
import { findTicket } from '../../../lib/ticket-service'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { createJWT } from '../../../lib/utils'

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
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid } = req.query
  if (typeof uuid !== 'string')
    throw new Error('Argument uuid is not of type string')

  const ticket = await findTicket(uuid)

  if (!ticket.uuid) {
    return res.status(404).json({ error: 'Ticket not found.' })
  }

  const html = renderToString(
    TicketContainer({
      ticketType: ticket.ticketTypeId,
      validTo: moment(ticket.validTo),
      qrCodeContents: await qrcode.toDataURL(ticket.uuid),
    }),
  )
  const jwToken = await createJWT({ ...ticket, ticket: html })
  res.json({ ticketdata: jwToken })
}

export default withApiKeyAuthentication(handler)
