import http, { IncomingMessage, ServerResponse } from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { handler } from './tickets'
import moment from 'moment-timezone'
import { dummyApiContext } from '../../../lib/http-test-helpers'

const makeFetch = async (date: moment.Moment | undefined) => {
  const startTime = date ? date.utc().valueOf() : undefined
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    return apiResolver(req, res, { startTime }, handler, dummyApiContext)
  }
  const server = http.createServer(requestHandler)
  const url = await listen(server)
  const response = await fetch(url)
  server.close()
  return response
}

describe('/api/maas/tickets', () => {
  describe('GET with invalid parameters', () => {
    it('responds with status code 400', async () => {
      const response = await makeFetch(undefined)
      expect(response.status).toBe(400)
    })
  })

  describe('GET with valid parameters', () => {
    it('responds with status code 200', async () => {
      expect.assertions(1)
      const date = moment.tz('2020-06-01 01:00:00', 'Europe/Helsinki')
      const response = await makeFetch(date)
      expect(response.status).toBe(200)
    })
    it('responds 9 hours when starttime is 18:00:00', async () => {
      expect.assertions(1)
      const date = moment.tz('2020-06-01 18:00:00', 'Europe/Helsinki')
      const response = await makeFetch(date)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(32400)
    })
    it('responds 2 hours when starttime is 01:00:00', async () => {
      expect.assertions(1)
      const date = moment.tz('2020-06-01 01:00:00', 'Europe/Helsinki')
      const response = await makeFetch(date)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(7200)
    })
    it('responds 3 hours when starttime is 00:00:00', async () => {
      expect.assertions(1)
      const date = moment.tz('2020-06-01 00:00:00', 'Europe/Helsinki')
      const response = await makeFetch(date)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(10800)
    })
    it('responds 24 hours when starttime is 03:00:00', async () => {
      expect.assertions(1)
      const date = moment.tz('2020-06-01 03:00:00', 'Europe/Helsinki')
      const response = await makeFetch(date)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(86400)
    })
  })
})
