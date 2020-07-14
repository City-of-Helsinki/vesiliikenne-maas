import moment from 'moment-timezone'
import { uuid } from 'uuidv4'
import { Ticket, TicketOptions, TicketOption } from './types'
import { pool } from './db'
import { isRight } from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { TicketOptionsType, TicketType, TicketOptionType } from './types'
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
  WITH paramtable AS (
    SELECT 
      ticket_options.id AS id,
      ticket_translations.description,
      ticket_translations.name AS "ticketName",
      ticket_translations.discount_group "discountGroup",
      to_char(ticket_options.amount / 100, 'FM9999.00') AS amount,
      currency,
      agencies.name AS "agency",
      agencies.logo_data AS "logoData",
      ticket_translations.instructions
    FROM public.ticket_options
    JOIN public.ticket_translations ON ticket_options.id = ticket_option_id
    JOIN public.agencies ON ticket_options.agency_id = agencies.id
    WHERE language = $1),
  entable AS (
    SELECT 
      ticket_options.id AS id,
      ticket_translations.description,
      ticket_translations.name AS "ticketName",
      ticket_translations.discount_group "discountGroup",
      to_char(ticket_options.amount / 100, 'FM9999.00') AS amount,
      currency,
      agencies.name AS "agency",
      agencies.logo_data AS "logoData",
      ticket_translations.instructions
    FROM public.ticket_options
    JOIN public.ticket_translations ON ticket_options.id = ticket_option_id
    JOIN public.agencies ON ticket_options.agency_id = agencies.id
    WHERE ticket_options.id NOT IN (SELECT id FROM paramtable) AND language = 'en')
  SELECT * FROM entable
  UNION ALL
  SELECT * from paramtable;`

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
  SELECT
    ticket_options.id AS id,
    ticket_translations.description,
    ticket_translations.name AS "ticketName",
    ticket_translations.discount_group "discountGroup",
    to_char(ticket_options.amount / 100, 'FM9999.00') AS amount,
    currency,
    agencies.name AS "agency",
    agencies.logo_data AS "logoData",
    ticket_translations.instructions
  FROM public.ticket_options
  JOIN public.ticket_translations ON ticket_options.id = ticket_option_id
  JOIN public.agencies ON ticket_options.agency_id = agencies.id
  WHERE language = $1 AND ticket_options.id = $2;`
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
  SELECT
    uuid,
    valid_from AS "validFrom",
    valid_to AS "validTo",
    agencies.name AS "agency",
    public.ticket_translations.discount_group as "discountGroup",
    public.ticket_translations.name,
    public.ticket_translations.description
  FROM tickets
  JOIN ticket_options ON tickets.ticket_option_id = ticket_options.id
  JOIN ticket_translations ON ticket_translations.ticket_option_id = ticket_options.id
  JOIN public.agencies ON ticket_options.agency_id = agencies.id
  WHERE language = 'en';
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
    WITH validlanguages AS (
      SELECT language 
      FROM public.tickets
      JOIN public.ticket_options ON ticket_options.id = tickets.ticket_option_id
      JOIN public.ticket_translations ON ticket_translations.ticket_option_id = ticket_options.id
      WHERE uuid = $1
    )
    SELECT 
      uuid,
      tickets.ticket_option_id AS "ticketOptionId",
      to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "validFrom",
      to_char(valid_to at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "validTo",
      agencies.name AS "agency",
      agencies.logo_data AS "logoData",
      ticket_translations.discount_group AS "discountGroup",
      ticket_translations.description,
      to_char(ticket_options.amount / 100, 'FM9999.00') AS amount,
      ticket_translations.name AS "ticketName",
      ticket_options.currency,
      ticket_translations.instructions
    FROM public.tickets
    JOIN public.ticket_options ON ticket_options.id = tickets.ticket_option_id
    JOIN public.ticket_translations ON ticket_translations.ticket_option_id = ticket_options.id
    JOIN public.agencies ON ticket_options.agency_id = agencies.id
    WHERE uuid = $1 
      AND valid_to > now() 
      AND ticket_translations.language = (CASE WHEN ($2 IN (SELECT * FROM validlanguages)) THEN $2 ELSE 'en' END)
    ;`

  const queryResult = await pool.query(findTicketQuery, [uuid, language])
  if (queryResult.rows.length === 0) {
    throw new TicketNotFoundError()
  }

  const ticket = TicketType.decode(queryResult.rows[0])
  if (isRight(ticket)) return ticket.right
  throw new TypeError(PathReporter.report(ticket).toString())
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
  const ticketOptionsQuery = `
  INSERT INTO public.tickets (
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
