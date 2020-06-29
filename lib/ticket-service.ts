import { promises as fs } from 'fs'
import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { NewTicketEntry, Ticket, TSPTicket } from './types'
import { TicketRequestValidationError } from './errors'
import { getTicketFields, getAllTicketFields, storeTicket } from './ticket-storage'

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

export const getTicketOptions = async () => {
  return JSON.parse(
    await fs.readFile('./JTline-tickets.json', 'utf-8'),
  ) as TSPTicket[]
}

const getTicketOption = async (ticketTypeId: string) => {
  const ticketOptions = await getTicketOptions()
  return ticketOptions.find(ticketOption => ticketOption.id === ticketTypeId)
}

export const getTickets = async () => {
  const allTicketFields = await getAllTicketFields()

  return await Promise.all(allTicketFields.map(async ([
    ticketUuid,
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom,
    validTo,
  ]) => {
    return {
      uuid: ticketUuid,
      agency,
      ticketTypeId,
      ticketTypeInfo: await getTicketOption(ticketTypeId),
      discountGroupId,
      validFrom,
      validTo,
    }
  }))
}

export const findTicket = async (uuid: string) => {
  const [
    ticketUuid,
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom,
    validTo,
  ] = await getTicketFields(uuid)

  if (!ticketUuid) {
    return {}
  }

  const ticketTypeInfo = await getTicketOption(ticketTypeId)

  if (!ticketTypeInfo) {
    return {}
  }

  return {
    uuid: ticketUuid,
    agency,
    ticketTypeId,
    ticketTypeInfo,
    discountGroupId,
    validFrom,
    validTo,
  }
}

export const createTicket = async ({
  agency,
  discountGroupId,
  ticketTypeId,
}: NewTicketEntry): Promise<Ticket> => {
  const now = moment().tz('Europe/Helsinki')

  const ticketTypeInfo = await getTicketOption(ticketTypeId)

  if (!ticketTypeInfo) {
    throw new TicketRequestValidationError('Invalid ticketTypeId')
  }

  return {
    uuid: uuid(),
    agency,
    ticketTypeId,
    ticketTypeInfo,
    discountGroupId,
    validFrom: now.format(),
    validTo: calculateTicketValidTo(now).format(),
  }
}

export const saveTicket = async (ticket: Ticket): Promise<string> => {
  await storeTicket(ticket)

  return ticket.uuid
}
