import { renderToString } from 'react-dom/server'
import qrcode from 'qrcode'
import TicketContainer from '../../../components/TicketContainer'
import { findTicket } from '../../../lib/ticket-service'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  withApiKeyAuthentication,
  withErrorHandler,
} from '../../../lib/middleware'
import { createJWT, parseLocale } from '../../../lib/utils'

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
 *                      description: The discount group the ticket was purchased for
 *                      example: adult
 *                    amount:
 *                      type: string
 *                      description: The price of the ticket as floating point representation in string format
 *                      example: "12.00"
 *                    currency:
 *                      type: string
 *                      description: The currency the ticket price is provided as
 *                      example: EUR
 *                    ticketName:
 *                      type: string
 *                      description: The name of ticket
 *                      example: Island Hopping
 *                    description:
 *                      type: string
 *                      description: The longer description of the ticket
 *                      example: Hop-on hop-off -style ticket at the islands Matinkylä, Porvoo, and Iisalmi.
 *                    logoData:
 *                      type: string
 *                      description: Base64 encoded SVG of the logo.
 *                      example: PHN2ZyB3aWR0aD0iNzExL...
 *                    qrCode:
 *                      type: string
 *                      description: QRCode as a base64 encoded PNG image
 *                      example: data:image/png;base64,iVBORw0KGg...
 *                    instructions:
 *                     type: string
 *                     description: "Instructions how to use the ticket"
 *                     example: "Show ticket to inspector when boarding the ferry."
 *       '404':
 *         description: A ticket with the ticketId was not found
 *       '500':
 *         description: Internal server error
 */
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid, locale } = req.query
  const language = parseLocale(locale)
  if (typeof uuid !== 'string')
    throw new TypeError('Argument uuid is not of type string')

  const ticket = await findTicket(uuid, language)
  const qrCode = await qrcode.toDataURL(ticket.uuid)
  const html = renderToString(
    TicketContainer({
      ticket,
      qrCodeContents: qrCode,
    }),
  )
  const jwToken = await createJWT({ ...ticket, ticket: html, qrCode })
  res.json({ ticketdata: jwToken })
}

export default withApiKeyAuthentication(withErrorHandler(handler))
