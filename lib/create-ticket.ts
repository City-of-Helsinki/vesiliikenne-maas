import { promises as fs } from 'fs'
import moment from 'moment'
import { uuid } from 'uuidv4'
import { Ticket } from './ticket-renderer'

export const createTicket = async (
  agency: string,
  discountGroupId: string,
  ticketTypeId: string
) => {
  const now = moment()
  const ticket: Ticket = {
    agency,
    discountGroupId,
    ticketTypeId,
    uuid: uuid(),
    validFrom: now.format(),
    validTo: now.add(1, 'days').format() // TODO: Fix
  }

  await storeTicket(ticketAsCsv(ticket))
  return ticket
}

const storeTicket = async (ticketCsv: string) => {
  await fs.appendFile('./tickets.csv', ticketCsv)
  console.log('Ticket appended')
}

const ticketAsCsv = (ticket: Ticket) => {
  return `${ticket.uuid},${ticket.agency},${ticket.ticketTypeId},${ticket.discountGroupId},${ticket.validFrom},${ticket.validFrom}`
}
