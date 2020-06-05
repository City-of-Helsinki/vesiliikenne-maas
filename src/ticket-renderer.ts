import { uuid } from 'uuidv4'
import qrcode from 'qrcode'
import express from 'express'

const acode = uuid()
console.log(acode)

const dummyTicket = {
  validFrom: '2018-05-26T01:30:00.000Z',
  validTo: '2018-06-26T01:30:00.000Z',
  ticketTypeId: 'Adult',
  qrcode: '',
  agency: 'JT-Line'
}

export const renderTicket = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { uuid } = req.params
  const qrCodeContents = await qrcode.toDataURL(uuid)
  const ticket = dummyTicket

  res.send(`<ul>
    <li>Voimassa <span>${ticket.validTo}</span>
    <li>Asiakasryhmä <span>${ticket.ticketTypeId}</span>
    <li><img src="${qrCodeContents}"/>
  </ul>`)
}
