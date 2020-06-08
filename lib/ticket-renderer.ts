import qrcode from 'qrcode'

export interface Ticket {
  agency: string
  ticketTypeId: string
  validFrom: string
  validTo: string
}

const dummyTicket: Ticket = {
  validFrom: '2018-05-26T01:30:00.000Z',
  validTo: '2018-06-26T01:30:00.000Z',
  ticketTypeId: 'Adult',
  agency: 'JT-Line'
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
