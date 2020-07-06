import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { NewTicketEntry, Ticket, TSPTicket } from './types'
import { TicketRequestValidationError } from './errors'
import { pool } from './db'

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
  const ticketOptionsQuery = `with ticket_options as (
        select id,
        description,
        name,
        discount_group,
        agency,
        amount,
        currency,
        logoId
  from public.ticket_options)
  select jsonb_agg(
      json_build_object(
          'id', id,
          'description', description,
          'name', name,
          'amount', to_char(amount / 100, 'FM9999.00'),
          'currency', currency,
          'agency', agency,
          'discount_group', discount_group,
          'logoId', logoId
      )
  ) as aggregated_out
  from ticket_options;
  `

  const queryResult = await pool.query(ticketOptionsQuery)

  return queryResult.rows[0]['aggregated_out'] as TSPTicket[]
}

const getTicketOption = async (ticketTypeId: number) => {
  const ticketOptions = await getTicketOptions()
  return ticketOptions.find(ticketOption => ticketOption.id === ticketTypeId)
}

export const getTickets = async () => {
  const findTicketQuery = `with single_ticket as (
    select uuid,
    ticket_type_id,
    valid_from,
    valid_to,
    public.ticket_options.agency AS agency,
    public.ticket_options.discount_group AS discount_group,
    json_build_object(
        'id', id,
        'description', description,
        'name', name,
        'amount', to_char(amount / 100, 'FM9999.00'),
        'currency', currency
    ) as ticket_type_info
  from public.tickets
      join public.ticket_options on ticket_type_id = id)
  select jsonb_agg(
    json_build_object(
        'uuid', uuid,
        'agency', agency,
        'discountGroupId', discount_group,
        'ticketTypeId', ticket_type_id,
        'ticketTypeInfo', ticket_type_info,
        'validFrom', valid_from,
        'validTo', valid_to
    )
  ) as aggregated_out
  from single_ticket;
  `

  const queryResult = await pool.query(findTicketQuery)

  if (queryResult.rows.length === 0) {
    return []
  }
  return queryResult.rows[0]['aggregated_out']
}

export const findTicket = async (uuid: string) => {
  const findTicketQuery = `with single_ticket as (
    select uuid,
    ticket_type_id,
    valid_from,
    valid_to,
    json_build_object(
        'id', id,
        'description', description,
        'name', name,
        'amount', to_char(amount / 100, 'FM9999.00'),
        'currency', currency,
        'agency', agency
    ) as ticket_type_info
  from public.tickets
      join public.ticket_options on ticket_type_id = id
  where uuid = $1)
  select jsonb_agg(
    json_build_object(
        'uuid', uuid,
        'ticketTypeId', ticket_type_id,
        'ticketTypeInfo', ticket_type_info,
        'validFrom', valid_from,
        'validTo', valid_to
    )
  ) as aggregated_out
  from single_ticket;
  `

  const queryResult = await pool.query(findTicketQuery, [uuid])
  if (queryResult.rows.length === 0) {
    return {}
  }

  const ticket = queryResult.rows[0]['aggregated_out'][0]

  return ticket
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
  const ticketOptionsQuery = `insert into public.tickets (
    uuid,
    ticket_type_id,
    valid_from,
    valid_to
  ) values (
    $1,
    $2,
    $3,
    $4
  ) RETURNING uuid;
  `

  const queryResult = await pool.query(ticketOptionsQuery, [
    ticket.uuid,
    ticket.ticketTypeId,
    ticket.validFrom,
    ticket.validTo,
  ])

  return queryResult.rows[0]['uuid']
}
