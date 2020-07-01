import { handler as jtlineStations } from './index'
import { pool } from '../../../../lib/db'
import { performRequest } from '../../../../lib/http-test-helpers'
import { AxiosResponse } from 'axios'

afterAll(async () => {
  return await pool.end()
})

describe('/api/jtline/stations', () => {
  describe('GET with empty parameters', () => {
    let response: AxiosResponse

    beforeAll(async () => {
      response = await performRequest(jtlineStations, {})
    })

    it('should produce response', () => {
      expect(response).toBeTruthy()
    })

    it('responds with status code 400', () => {
      expect(response?.status).toBe(400)
    })

    it('should have error message as body', () => {
      expect(response?.data).toBe("Required query parameter 'location' is missing.")
    })
  })

  describe('GET with valid parameters', () => {
    let response: AxiosResponse

    beforeAll(async () => {
      response = await performRequest(jtlineStations, { location: "60.1676,24.9552", radius: "10000" })
    })

    it('responds with status code 200', () => {
      expect(response?.status).toBe(200)
    })

    it('response body is a JSON array', async () => {
      expect.assertions(1)
      expect(Array.isArray(response.data)).toBe(true)
    })
  })
})
