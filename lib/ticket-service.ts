import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { Ticket, TicketOptions, TicketOption } from './types'
import { pool } from './db'
import { isRight } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { TicketOptionsType, TicketOptionType, TicketType } from './types'
import { TicketNotFoundError } from './errors'

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

export const getTicketOptions = async (
  language = 'en',
): Promise<TicketOptions> => {
  const ticketOptionsQuery = `
  WITH paramtable as (
    select 
      ticket_options.id as id,
      ticket_translations.description,
      ticket_translations.name as "ticketName",
      ticket_translations.discount_group "discountGroup",
      to_char(ticket_options.amount / 100, 'FM9999.00') as amount,
      currency,
      agency,
      logo_id as "logoId",
      ticket_translations.instructions
    from public.ticket_options
    join public.ticket_translations on ticket_options.id = ticket_option_id
    where language = $1),
  entable as (
    select 
      ticket_options.id as id,
      ticket_translations.description,
      ticket_translations.name as "ticketName",
      ticket_translations.discount_group "discountGroup",
      to_char(ticket_options.amount / 100, 'FM9999.00') as amount,
      currency,
      agency,
      logo_id as "logoId",
      ticket_translations.instructions
    from public.ticket_options
    join public.ticket_translations on ticket_options.id = ticket_option_id
    where ticket_options.id NOT IN (SELECT id FROM paramtable) AND language = 'en')
  SELECT * FROM entable
  UNION ALL
  SELECT * from paramtable
    ;`

  const queryResult = await pool.query(ticketOptionsQuery, [language])
  const tickets = TicketOptionsType.decode(queryResult.rows)
  if (isRight(tickets)) return tickets.right
  throw new Error(PathReporter.report(tickets).toString())
}

const getTicketOption = async (
  ticketOptionId: number,
  language = 'en',
): Promise<TicketOption> => {
  const ticketOptionQuery = `
  select ticket_options.id as id,
  ticket_translations.description,
  ticket_translations.name as "ticketName",
  ticket_translations.discount_group "discountGroup",
  to_char(ticket_options.amount / 100, 'FM9999.00') as amount,
  currency,
  agency,
  logo_id as "logoId",
  ticket_translations.instructions
from public.ticket_options
join public.ticket_translations on ticket_options.id = ticket_option_id
where language = $1 AND ticket_options.id = $2;`

  const queryResult = await pool.query(ticketOptionQuery, [
    language,
    ticketOptionId,
  ])
  if (queryResult.rows.length === 0) {
    throw new TicketNotFoundError()
  }

  const ticket = TicketOptionType.decode(queryResult.rows[0])
  if (isRight(ticket)) return ticket.right
  throw new TypeError(PathReporter.report(ticket).toString())
}

export const getTickets = async () => {
  const getTicketsQuery = `
  select
      uuid,
      valid_from as "validFrom",
      valid_to as "validTo",
      public.ticket_options.agency,
      public.ticket_translations.discount_group as "discountGroup",
      public.ticket_translations.name,
      public.ticket_translations.description
    from tickets
    join ticket_options on tickets.ticket_option_id = ticket_options.id
    join ticket_translations on ticket_translations.ticket_option_id = ticket_options.id
    where language = 'en';
  `

  const queryResult = await pool.query(getTicketsQuery)

  if (queryResult.rows.length === 0) {
    return []
  }
  return queryResult.rows
}

export const findTicket = async (
  uuid: string,
  language = 'en',
): Promise<Ticket> => {
  const findTicketQuery = `
    select 
      uuid,
      tickets.ticket_option_id as "ticketOptionId",
      to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "validFrom",
      to_char(valid_to at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "validTo",
      ticket_options.agency as agency,
      ticket_translations.discount_group as "discountGroup",
      ticket_translations.description,
      ticket_options.logo_id as "logoId",
      to_char(ticket_options.amount / 100, 'FM9999.00') as amount,
      ticket_translations.name as "ticketName",
      ticket_options.currency,
      ticket_translations.instructions
    from public.tickets
      join public.ticket_options on ticket_options.id = tickets.ticket_option_id
      join public.ticket_translations on ticket_translations.ticket_option_id = ticket_options.id
    where uuid = $1 and valid_to > now() and ticket_translations.language = $2;
  `

  const queryResult = await pool.query(findTicketQuery, [uuid, language])
  if (queryResult.rows.length === 0) {
    throw new TicketNotFoundError()
  }
  const ticket = TicketType.decode(queryResult.rows[0])
  if (isRight(ticket)) return ticket.right
  throw new TypeError(PathReporter.report(ticket).toString())
}

export const createTicket = async (
  optionId: number,
  language = 'en',
): Promise<Ticket> => {
  const now = moment().tz('Europe/Helsinki')

  const { id: ticketOptionId, ...rest } = await getTicketOption(
    optionId,
    language,
  )

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
