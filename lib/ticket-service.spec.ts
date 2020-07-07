import moment from 'moment-timezone'
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
    const ticketOptions = await getTicketOptions()
    const ticketOptionId = ticketOptions[0].id
    expect(ticketOptionId).toEqual(1)

    const newTicket = await createTicket(ticketOptionId)
    expect(isUuid(newTicket.uuid)).toBe(true)

    const savedUuid = await saveTicket(newTicket)
    expect(savedUuid).toEqual(newTicket.uuid)

    const ticketInDb = await findTicket(savedUuid)
    expect(ticketInDb.uuid).toEqual(newTicket.uuid)
  })
})
