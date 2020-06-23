import { handler as jtlineStations } from './index'
import { pool } from '../../../../lib/db'
import { performRequest } from '../../../../lib/http-test-helpers'

afterAll(async () => {
  return await pool.end()
})

describe('/api/jtline/stations', () => {
  describe('GET with empty parameters', () => {
    let state = performRequest(jtlineStations, undefined)

    it('responds with status code 400', () => {
      expect(state.response?.status).toBe(400)
    })
  })

  describe('GET with valid parameters', () => {
    let state = performRequest(jtlineStations, { location: '60.1676,24.9552', radius: 10000 })

    it('responds with status code 200', () => {
      expect(state.response?.status).toBe(200)
    })
  })
})