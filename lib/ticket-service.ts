import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { Ticket, TicketOptions, TicketOption } from './types'
import { pool } from './db'
import { isRight } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { TicketOptionsType, TicketOptionType, TicketType } from './types'

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

export const getTicketOptions = async (): Promise<TicketOptions> => {
  const ticketOptionsQuery = `with ticket_options as (
        select id,
        description,
        name,
        discount_group,
        amount,
        currency,
        agency,
        logoId
  from public.ticket_options)
  select jsonb_agg(
      json_build_object(
          'id', id,
          'description', description,
          'amount', to_char(amount / 100, 'FM9999.00'),
          'currency', currency,
          'ticketName', name,
          'agency', agency,
          'discountGroup', discount_group,
          'logoId', logoId
      )
  ) as aggregated_out
  from ticket_options;
  `

  const queryResult = await pool.query(ticketOptionsQuery)
  const tickets = TicketOptionsType.decode(
    queryResult.rows[0]['aggregated_out'],
  )

  if (isRight(tickets)) return tickets.right
  throw new Error(PathReporter.report(tickets).toString())
}

const getTicketOption = async (
  ticketOptionId: number,
): Promise<TicketOption> => {
  const ticketOptionsQuery = `with ticket_options as (
    select id,
    description,
    name,
    discount_group,
    amount,
    currency,
    agency,
    logoId
from public.ticket_options where id = $1)
select jsonb_agg(
  json_build_object(
      'id', id,
      'description', description,
      'ticketName', name,
      'amount', to_char(amount / 100, 'FM9999.00'),
      'currency', currency,
      'agency', agency,
      'discountGroup', discount_group,
      'logoId', logoId
  )
) as aggregated_out
from ticket_options;
`

  const queryResult = await pool.query(ticketOptionsQuery, [ticketOptionId])
  const ticket = TicketOptionType.decode(
    queryResult.rows[0]['aggregated_out'][0],
  )
  if (isRight(ticket)) return ticket.right
  throw new Error(PathReporter.report(ticket).toString())
}

export const getTickets = async () => {
  const findTicketQuery = `
    select json_agg(tickets.*) as tickets
    from (SELECT 
      uuid, 
      valid_from, 
      valid_to,
      public.ticket_options.agency,
      public.ticket_options.discount_group as discountGroup,
      public.ticket_options.name,
      public.ticket_options.description
    from public.tickets join public.ticket_options on ticket_option_id = id) 
    as tickets;
  `

  const queryResult = await pool.query(findTicketQuery)
  console.log(queryResult.rows[0].tickets)

  if (queryResult.rows.length === 0) {
    return []
  }
  return queryResult.rows[0].tickets
}

export const findTicket = async (uuid: string): Promise<Ticket> => {
  const findTicketQuery = `with single_ticket as (
    select uuid,
    ticket_option_id,
    valid_from,
    valid_to,
    ticket_options.agency as agency,
    ticket_options.discount_group as discount_group,
    ticket_options.description as description,
    ticket_options.logoid as logoid,
    ticket_options.amount as amount,
    ticket_options.name as ticket_name,
    ticket_options.currency as currency
  from public.tickets
      join public.ticket_options on ticket_option_id = id
  where uuid = $1)
  select jsonb_agg(
    json_build_object(
        'uuid', uuid,
        'ticketOptionId', ticket_option_id,
        'validFrom', valid_from,
        'validTo', valid_to,
        'agency', agency,
        'discountGroup', discount_group,
        'description', description,
        'logoId', logoid,
        'amount', to_char(amount / 100, 'FM9999.00'),
        'currency', currency,
        'ticketName', ticket_name
    )
  ) as aggregated_out
  from single_ticket;
  `

  const queryResult = await pool.query(findTicketQuery, [uuid])

  const ticket = TicketType.decode(queryResult.rows[0]['aggregated_out'][0])

  if (isRight(ticket)) return ticket.right
  throw new Error(PathReporter.report(ticket).toString())
}

export const createTicket = async (optionId: number): Promise<Ticket> => {
  const now = moment().tz('Europe/Helsinki')

  const { id: ticketOptionId, ...rest } = await getTicketOption(optionId)

  return {
    uuid: uuid(),
    ticketOptionId,
    validFrom: now.format(),
    validTo: calculateTicketValidTo(now).format(),
    ...rest,
  }
}

export const saveTicket = async (ticket: Ticket): Promise<string> => {
  const ticketOptionsQuery = `insert into public.tickets (
    uuid,
    ticket_option_id,
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
    ticket.ticketOptionId,
    ticket.validFrom,
    ticket.validTo,
  ])

  return queryResult.rows[0]['uuid']
}
