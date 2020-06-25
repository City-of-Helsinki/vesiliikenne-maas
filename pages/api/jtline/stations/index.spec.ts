import { handler as jtlineStations } from './index'
import { pool } from '../../../../lib/db'
import { performRequest } from '../../../../lib/http-test-helpers'

afterAll(async () => {
  return await pool.end()
})

describe('/api/jtline/stations', () => {
  describe('GET with empty parameters', () => {
    const state = performRequest(jtlineStations, {})

    it('responds with status code 400', () => {
      expect(state.response?.status).toBe(400)
    })

    it('should have error message as body', () => {
      expect(state.response?.text()).resolves.toBe("Required query parameter 'location' is missing.")
    })
  })

  describe('GET with valid parameters', () => {
    const state = performRequest(jtlineStations, { location: "60.1676,24.9552", radius: "10000" })

    it('responds with status code 200', () => {
      expect(state.response?.status).toBe(200)
    })

    it('response body is a JSON array', async () => {
      expect.assertions(1)

      const response = state.response
      if (!response) {
        fail('No response')
        return
      }

      const responseBodyAsJson: any = await response.json()
      expect(Array.isArray(responseBodyAsJson)).toBe(true)
    })
  })
})
