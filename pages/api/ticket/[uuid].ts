import { renderToString } from 'react-dom/server'
import TicketContainer from '../../components/TicketContainer'
import { qrCodeWithTicketDetails } from '../../../src/ticket-renderer'

export default async (req, res) => {
  const { uuid } = req.query
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
