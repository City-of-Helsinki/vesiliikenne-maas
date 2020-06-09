import moment from 'moment'
import { calculateTicketValidTo } from './create-ticket'

describe('create-ticket', () => {
  it('calculates validTo correctly', async () => {
    const expected = '2013-02-09 03:00:00.00'
    let now = moment('2013-02-08 09:30:26.123')

    // Ticket purchased before midnight should expire the next day
    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)

    now = moment('2013-02-09 02:30:26.123')

    // Ticket purchased between 00:00 and 03:00 should expire at 03:00 the same day
    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)

    // Ticket purchased at 03:00 should expire the next day
    now = moment('2013-02-08 03:00:00.000')

    // Ticket purchased between 00:00 and 03:00 should expire at 03:00 the same day
    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)
  })
})
