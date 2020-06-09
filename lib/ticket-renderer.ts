import qrcode from 'qrcode'

export interface Ticket {
  agency: string
  discountGroupId: string
  ticketTypeId: string
  validFrom: string
  validTo: string
  uuid: string
}

const dummyTicket: Ticket = {
  validFrom: '2018-05-26T01:30:00.000Z',
  validTo: '2018-06-26T01:30:00.000Z',
  discountGroupId: 'Adult',
  agency: 'JT-Line',
  uuid: 'foobar',
  ticketTypeId: 'Day'
}

const readTicketDetails = async (_: string) => Promise.resolve(dummyTicket)

export const qrCodeWithTicketDetails = async (uuid: string) => {
  let qrCodeWithTicketTuple: [string, Ticket]
  qrCodeWithTicketTuple = await Promise.all([
    qrcode.toDataURL(uuid),
    readTicketDetails(uuid)
  ])
  return qrCodeWithTicketTuple
}
