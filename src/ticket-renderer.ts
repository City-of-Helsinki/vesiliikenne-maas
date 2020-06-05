import qrcode from 'qrcode'
import express from 'express'

export interface Ticket {
  agency: string;
  ticketTypeId: string;
  validFrom: string;
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
  let x: [string, Ticket]
  x = await Promise.all([
    qrcode.toDataURL(uuid),
    readTicketDetails(uuid)
  ])
  return x
}

export const renderTicket = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { uuid } = req.params
  const [qrCodeContents, ticket] = await qrCodeWithTicketDetails(uuid)

  res.send(`<ul>
    <li>Voimassa <span>${ticket.validTo}</span>
    <li>Asiakasryhmä <span>${ticket.ticketTypeId}</span>
    <li><img src="${qrCodeContents}"/>
  </ul>`)
}
