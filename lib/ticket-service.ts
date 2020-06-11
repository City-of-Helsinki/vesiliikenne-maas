import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { NewTicketEntry, Ticket } from './types'
import { getTicketFields, storeTicket } from './ticket-storage'

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
    validTo,
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
    validTo,
  }
}

export const createTicket = ({
                               agency,
                               discountGroupId,
                               ticketTypeId,
                             }: NewTicketEntry): Ticket => {
  const now = moment()
  return {
    uuid: uuid(),
    agency,
    ticketTypeId,
    discountGroupId,
    validFrom: now.format(),
    validTo: calculateTicketValidTo(now).format(),
  }
}

export const saveTicket = async (ticket: Ticket): Promise<string> => {
  await storeTicket(ticket)

  return ticket.uuid
}
