import http, { IncomingMessage, ServerResponse } from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { handler } from './tickets'

const dummyApiContext = {
  previewModeEncryptionKey: '',
  previewModeId: '',
  previewModeSigningKey: '',
}

const makeFetch = async (startTime: number | undefined) => {
  let requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    return apiResolver(req, res, { startTime }, handler, dummyApiContext)
  }
  const server = http.createServer(requestHandler)
  let url = await listen(server)
  const response = await fetch(url)
  return { server, response }
}

describe.only('/api/maas/tickets', () => {
  describe('GET with empty parameters', () => {
    it('responds with status code 400', async () => {
      const { server, response } = await makeFetch(undefined)
      expect(response.status).toBe(400)
      server.close()
    })
  })

  describe('GET with valid parameters', () => {
    it('responds with status code 200', async () => {
      expect.assertions(1)
      const { server, response } = await makeFetch(1592924400000)
      expect(response.status).toBe(200)
      server.close()
    })

    it('responds 9 hours when starttime is 18:00:00', async () => {
      expect.assertions(1)
      const { server, response } = await makeFetch(1592924400000)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(32400)
      server.close()
    })
    it('responds 2 hours when starttime is 01:00:00', async () => {
      expect.assertions(1)
      const { server, response } = await makeFetch(1592863200000)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(7200)
      server.close()
    })
    it('responds 3 hours when starttime is 00:00:00', async () => {
      expect.assertions(1)
      const { server, response } = await makeFetch(1592859600000)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(10800)
      server.close()
    })
    it('responds 24 hours when starttime is 03:00:00', async () => {
      expect.assertions(1)
      const { server, response } = await makeFetch(1592870400000)
      const tickets = await response.json()
      expect(tickets[0].validityseconds).toBe(86400)
      server.close()
    })
  })
})
