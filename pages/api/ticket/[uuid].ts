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
 *     description: Returns user ticket in [HSL OpenMaaS Ticket API format](https://sales-api.hsl.fi/ticket-api-doc#operation/Render%20Ticket). encoded in JSON Web Token
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: ticket id
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
 *                      example: waterbus OY
 *                    ticketOptionId:
 *                      type: number
 *                      example: 1
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
 *                    discountGroup:
 *                      type: string
 *                      description: customer discount group
 *                      example: adult
 *                    description:
 *                      type: string
 *                      description: ticket description
 *                      example: island hopping
 *                    logoid:
 *                      type: string
 *                      description: agencys logoid
 *                      example: waterbusoy.jpg
 *                    qrcode:
 *                      type: string
 *                      description: qrcode png image in base64
 *                      example: data:image/png;base64,iVBORw0KGg...
 *       '404':
 *         description: A ticket with the ticketId was not found
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid } = req.query
  if (typeof uuid !== 'string')
    throw new Error('Argument uuid is not of type string')
  try {
    const ticket = await findTicket(uuid)
    const qrCode = await qrcode.toDataURL(ticket.uuid)
    const html = renderToString(
      TicketContainer({
        discountGroup: ticket.discountGroup,
        validTo: moment(ticket.validTo),
        qrCodeContents: qrCode,
      }),
    )
    console.log(qrCode)
    const jwToken = await createJWT({ ...ticket, ticket: html, qrCode })
    res.json({ ticketdata: jwToken })
  } catch (error) {
    if (error.name === 'TypeError') {
      return res.status(404).json({ error: 'invalid ticket UUID' })
    }
    res.status(500).send(error.message)
  }
}

export default withApiKeyAuthentication(handler)
