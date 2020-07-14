import moment from 'moment-timezone'
import { pool } from '../lib/db'
import {
  calculateTicketValidTo,
  getTicketOptions,
  saveTicket,
  createTicket,
  findTicket,
} from './ticket-service'
import { isUuid } from 'uuidv4'

describe('ticket-service', () => {
  it('ticket purchased before midnight should expire the next day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-08 09:30:26.123')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS'),
    ).toEqual(expected)
  })

  it('ticket purchased at 03:00 should expire the next day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-09 02:30:26.123')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS'),
    ).toEqual(expected)
  })

  it('ticket purchased between 00:00 and 03:00 should expire at 03:00 the same day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-08 03:00:00.000')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS'),
    ).toEqual(expected)
  })
})

describe('Ticket purchase flow', () => {
  test('Ticket can be purchased with ticket option information', async () => {
    const ticketOptions = await getTicketOptions('fi')
    const ticketOptionId = ticketOptions[0].id
    expect(ticketOptionId).toEqual(1)

    const newTicket = await createTicket(ticketOptionId)
    expect(isUuid(newTicket.uuid)).toBe(true)

    const savedUuid = await saveTicket(newTicket)
    expect(savedUuid).toEqual(newTicket.uuid)

    const ticketInDb = await findTicket(savedUuid, 'fi')
    expect(ticketInDb.uuid).toEqual(newTicket.uuid)
  })
})

describe('Ticketoptions query', () => {
  beforeAll(async () => {
    await pool.query(`
    INSERT INTO agencies(
      name,
      logo_data
    ) VALUES (
      'Cool Agency',
      'Even cooler logo'
    );`)

    await pool.query(`
    INSERT INTO ticket_options(
      amount,
      currency,
      agency_id
    ) VALUES (
      1000,
      'DLR',
      (select id from agencies where agencies.name = 'Cool Agency')
    );`)

    await pool.query(`
    INSERT INTO ticket_translations(
      name,
      ticket_option_id,
      description,
      instructions,
      discount_group,
      language
    ) VALUES (
      'pihlaja island',
      (select ticket_options.id from ticket_options join agencies on ticket_options.agency_id = agencies.id where agencies.name = 'Cool Agency'),
      'test ticket description',
      'test instructions',
      'adult',
      'en'
    );`)
  })

  afterAll(async () => {
    await pool.query(`
    DELETE FROM agencies
    WHERE id = (select id from agencies where agencies.name = 'Cool Agency');
    `)
  })

  it('should not return duplicate ticketoptions in different language', async () => {
    const ticketOptions = await getTicketOptions()
    expect(ticketOptions.length).toBe(2)
  })

  it('should fallback to english if language is not found', async () => {
    const ticketOptions = await getTicketOptions('fi')
    expect(ticketOptions.length).toBe(2)
  })
})
