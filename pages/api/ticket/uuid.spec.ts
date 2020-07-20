import { handler } from './[uuid]'
import { withErrorHandler } from '../../../lib/middleware'
import http from 'http'
import listen from 'test-listen'
import {
  createRequestHandler,
  performGet,
} from '../../../lib/http-test-helpers'
import { pool } from '../../../lib/db'

const requestHandler = createRequestHandler(withErrorHandler(handler), {})
const server = http.createServer(requestHandler)

describe('GET /api/ticket/[uuid]', () => {
  beforeAll(async () => {
    await pool.query(`
    INSERT INTO tickets (
      uuid,
      ticket_option_id,
      valid_from,
      valid_to
    ) VALUES (
      'abcd1234',
      1,
      now(),
      current_date + interval'1 day'
    );`)
    await pool.query(`
    INSERT INTO tickets (
      uuid,
      ticket_option_id,
      valid_from,
      valid_to
    ) VALUES (
      'oldticket',
      1,
      current_date - interval'2 day',
      current_date - interval'1 day'
    );`)
  })
  afterAll(async () => {
    await pool.query(`
    DELETE FROM tickets
    WHERE uuid = 'abcd1234';
    `)
    await pool.query(`
    DELETE FROM tickets
    WHERE uuid = 'oldticket';
    `)
  })
  afterEach(() => {
    server.close()
  })
  describe('uuid is invalid', () => {
    it('should fail with status code 404 ', async () => {
      const url = await listen(server)
      const response = await performGet(`${url}?uuid=abc123`)
      expect(response.status).toBe(404)
      expect(response.data.message).toBe(
        'Invalid ticket UUID or ticket is expired',
      )
    })
  })
  describe('UUID is valid but ticket is expired', () => {
    it('should fail with status code 404', async () => {
      const url = await listen(server)
      const response = await performGet(`${url}?uuid=oldticket`)
      expect(response.status).toBe(404)
      expect(response.data.message).toBe(
        'Invalid ticket UUID or ticket is expired',
      )
    })
  })
  describe('UUID is valid and ticket is not expired', () => {
    it('should return the ticket', async () => {
      const url = await listen(server)
      const response = await performGet(`${url}?uuid=abcd1234`)
      expect(response.status).toBe(200)
      expect(response.data.ticketdata.uuid).toBe('abcd1234')
    })
  })
})
