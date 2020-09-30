import { handler as jtlineStations } from './index'
import { pool } from '../../../../lib/db'
import { performRequest } from '../../../../lib/http-test-helpers'
import { AxiosResponse } from 'axios'
import { withErrorHandler } from '../../../../lib/middleware'
import { Station } from '../../../../lib/types'

afterAll(async () => {
  return await pool.end()
})

describe('/api/jtline/stations', () => {
  describe('GET with empty parameters', () => {
    let response: AxiosResponse

    beforeAll(async () => {
      response = await performRequest(withErrorHandler(jtlineStations), {
        agencyId: 'jtline',
      })
    })

    it('should produce response', () => {
      expect(response).toBeTruthy()
    })

    it('responds with status code 400', () => {
      expect(response?.status).toBe(400)
    })

    it('should have error message as body', () => {
      expect(response?.data.message).toBe(
        "Required query parameter 'location' is missing.",
      )
    })
  })

  describe('GET with valid parameters', () => {
    let response: AxiosResponse

    beforeAll(async () => {
      response = await performRequest(jtlineStations, {
        agencyId: 'jtline',
        location: '60.1676,24.9552',
        radius: '10000',
      })
    })

    it('responds with status code 200', () => {
      expect(response?.status).toBe(200)
    })

    it('response body is a JSON array', async () => {
      expect.assertions(1)
      expect(Array.isArray(response.data)).toBe(true)
    })
  })
  // Commented out because after the ferry season JT-Line data is not available anymore
  // in the Lautta.net GTFS zip, breaking this test.
  // This is a temporary solution, this needs to be actually fixed, because it means that builds are
  // broken during the off-season.
  //
  //   it('response contains Kauppatori', () => {
  //     console.log(response)
  //     const kauppatori = response.data.find(
  //       (station: Station) => station.name === 'Kauppatori (Kolera-allas)',
  //     )
  //     expect(kauppatori).toEqual({
  //       id: '9571',
  //       name: 'Kauppatori (Kolera-allas)',
  //       agencyId: 'jtline',
  //       location: '60.167408,24.95325',
  //       services: ['FERRY'],
  //     })
  //   })
  // })
})
