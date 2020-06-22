import { promises as fs } from 'fs'
import { Ticket } from './types'

const readTicketLines = async (): Promise<string[]> => {
  const ticketsCsv = (await fs.readFile('./tickets.csv')).toString()
  return ticketsCsv.split(/[\r\n]+/)
}

export const getTicketFields = async (uuid: string) => {
  const ticketsAsLines = await readTicketLines()

  const ticketCsv = ticketsAsLines.find(
    csvLine => csvLine.split(',')[0] === uuid,
  )

  if (!ticketCsv) {
    return []
  }

  return ticketCsv.split(',')
}

export const storeTicket = async (ticket: Ticket) => {
  await fs.appendFile('./tickets.csv', ticketAsCsv(ticket))
  console.log('Ticket appended')
}

const ticketAsCsv = (ticket: Ticket) => {
  return `${ticket.uuid},${ticket.agency},${ticket.ticketTypeId},${ticket.discountGroupId},${ticket.validFrom},${ticket.validTo}\r\n`
}
