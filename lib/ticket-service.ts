import { promises as fs } from 'fs'
import moment from 'moment'
import { uuid } from 'uuidv4'
import { NewTicketEntry } from '../lib/types'

export interface Ticket {
  uuid: string
  agency: string
  ticketTypeId: string
  discountGroupId: string
  validFrom: string
  validTo: string
}

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

const readTicketLines = async (): Promise<string[]> => {
  const ticketsCsv = (await fs.readFile('./tickets.csv')).toString()
  return ticketsCsv.split('\r\n')
}

const findTicketFields = async (uuid: string) => {
  const ticketsAsLines = await readTicketLines()

  const ticketCsv = ticketsAsLines.find(csvLine => csvLine.startsWith(uuid))

  if (!ticketCsv) {
    return []
  }

  return ticketCsv.split(',')
}

export const findTicket = async (uuid: string) => {
  const [
    ticketUuid,
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom,
    validTo
  ] = await findTicketFields(uuid)

  if (!ticketUuid) {
    return {}
  }

  return {
    uuid: ticketUuid,
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom,
    validTo
  }
}

export const createTicket = async ({
  agency,
  discountGroupId,
  ticketTypeId
}: NewTicketEntry): Promise<string> => {
  const now = moment()
  const ticket: Ticket = {
    uuid: uuid(),
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom: now.format(),
    validTo: calculateTicketValidTo(now).format() // TODO: Fix
  }

  await storeTicket(ticketAsCsv(ticket))
  return ticket.uuid
}

const storeTicket = async (ticketCsv: string) => {
  await fs.appendFile('./tickets.csv', ticketCsv)
  console.log('Ticket appended')
}

const ticketAsCsv = (ticket: Ticket) => {
  return `${ticket.uuid},${ticket.agency},${ticket.ticketTypeId},${ticket.discountGroupId},${ticket.validFrom},${ticket.validTo}\r\n`
}
