import moment from 'moment-timezone'
import { calculateTicketValidTo } from './ticket-service'

describe('ticket-service', () => {
  it('ticket purchased before midnight should expire the next day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-08 09:30:26.123')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)
  })

  it('ticket purchased at 03:00 should expire the next day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-09 02:30:26.123')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)
  })

  it('ticket purchased between 00:00 and 03:00 should expire at 03:00 the same day', async () => {
    const expected = '2013-02-09 03:00:00.00'
    const now = moment('2013-02-08 03:00:00.000')

    expect(
      calculateTicketValidTo(now).format('YYYY-MM-DD HH:mm:ss.SS')
    ).toEqual(expected)
  })
})
