import moment from 'moment'
import { uuid } from 'uuidv4'
import { NewTicketEntry } from '../lib/types'
import { storeTicket, getTicketFields } from './ticket-storage'

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

export const findTicket = async (uuid: string) => {
  const [
    ticketUuid,
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom,
    validTo
  ] = await getTicketFields(uuid)

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
    validTo: calculateTicketValidTo(now).format()
  }

  await storeTicket(ticket)
  return ticket.uuid
}
