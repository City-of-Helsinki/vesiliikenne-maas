import { handler } from './index'
import { withErrorHandler } from '../../../lib/middleware'
import http from 'http'
import listen from 'test-listen'
import {
  createRequestHandler,
  performPost,
} from '../../../lib/http-test-helpers'
import { isUuid } from 'uuidv4'

const requestHandler = createRequestHandler(withErrorHandler(handler), {})
const server = http.createServer(requestHandler)

describe('POST /api/ticket', () => {
  afterEach(() => {
    server.close()
  })
  describe('ticketOptionId is invalid', () => {
    it('should fail with status code 400 without ticketOptionId', async () => {
      const url = await listen(server)
      const response = await performPost(url, {})
      expect(response.status).toBe(400)
      expect(response.data.message).toBe(
        'ticketOptionId is not a number: undefined',
      )
    })

    it('should return 404 if ticketOption is not found', async () => {
      const ticketOptionId = 9999
      const url = await listen(server)
      const response = await performPost(url, { ticketOptionId })
      expect(response.status).toBe(404)
      expect(response.data.message).toBe(
        `ticket option with given ID was not found. ID: ${ticketOptionId}`,
      )
    })
  })
  describe('ticketOptionId is valid', () => {
    it('should return valid UUID', async () => {
      const url = await listen(server)
      const response = await performPost(url, { ticketOptionId: 1 })
      expect(response.status).toBe(200)
      expect(isUuid(response.data.uuid)).toBe(true)
    })
  })
})
