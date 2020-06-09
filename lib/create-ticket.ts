import { promises as fs } from 'fs'
import moment from 'moment'
import { uuid } from 'uuidv4'
import { Ticket } from './ticket-renderer'

export const calculateTicketValidTo = (validFrom: moment.Moment) => {
  // If ticket purchased between 00:00 and 03:00, it ends within the same day
  if (validFrom.hour() < 3) {
    return moment(validFrom).hour(3).minute(0).second(0).milliseconds(0)
  } else {
    // Otherwise it ends the next day
    return moment(validFrom)
      .add(1, 'day')
      .hour(3)
      .minute(0)
      .second(0)
      .milliseconds(0)
  }
}

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
    validTo: calculateTicketValidTo(now).format() // TODO: Fix
  }

  await storeTicket(ticketAsCsv(ticket))
  return ticket
}

const storeTicket = async (ticketCsv: string) => {
  await fs.appendFile('./tickets.csv', ticketCsv)
  console.log('Ticket appended')
}

const ticketAsCsv = (ticket: Ticket) => {
  return `${ticket.uuid},${ticket.agency},${ticket.ticketTypeId},${ticket.discountGroupId},${ticket.validFrom},${ticket.validFrom}\r\n`
}
