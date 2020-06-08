import { renderToString } from 'react-dom/server'
import TicketContainer from '../../components/TicketContainer'
import { qrCodeWithTicketDetails } from '../../../src/ticket-renderer'
import { NextApiRequest, NextApiResponse } from 'next'

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
