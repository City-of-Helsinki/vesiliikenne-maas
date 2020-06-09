import qrcode from 'qrcode'
import { findTicket } from './ticket-service'

export interface Ticket {
  agency: string
  discountGroupId: string
  ticketTypeId: string
  validFrom: string
  validTo: string
  uuid: string
}

export const qrCodeWithTicketDetails = async (uuid: string) => {
  let qrCodeWithTicketTuple: [string, Ticket]
  qrCodeWithTicketTuple = await Promise.all([
    qrcode.toDataURL(uuid),
    findTicket(uuid)
  ])
  return qrCodeWithTicketTuple
}
