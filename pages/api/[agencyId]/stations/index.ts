import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../../lib/middleware'
import { isString } from '../../../../lib/utils'
import { TicketRequestValidationError } from '../../../../lib/errors'
import { pool } from '../../../../lib/db'

// Mapping from supported agencyIds to their name in GTFS
const agencyIdToAgencyName: { [key: string]: string } = {
  jtline: 'JT-Line Oy',
}

// language=PostgreSQL
const stopsQuery = `with result_tops as
       (select distinct stop_id,
                        stop_lat,
                        stop_lon,
                        stop_name
        from gtfs.trips
               join gtfs.routes using (route_id)
               join gtfs.agency using (agency_id)
               join gtfs.stop_times using (trip_id)
               join gtfs.stops using (stop_id)
               join gtfs.calendar using (service_id)
        where agency_name = $2
          and now()::date between start_date and end_date
          and ST_Distance(
                  the_geom::geography,
                  ST_SetSRID(ST_Point($3, $4), 4326)::geography
                ) <= cast($5 as integer))
select jsonb_agg(
           json_build_object(
               'id', stop_id,
               'location', concat(stop_lat, ',', stop_lon),
               'agencyId', $1::text,
               'name', stop_name,
               'services', jsonb_build_array('FERRY')
             )
         ) as aggregated_out
from result_tops;
`

const parseQuery = (query: { [key: string]: string | string[] }) => {
  const parseLocation = (locationString: string | string[]) => {
    if (!isString(locationString)) {
      throw new TicketRequestValidationError(
        "Required query parameter 'location' is missing.",
      )
    }

    const [latitude, longitude] = locationString.split(',')
    return { latitude, longitude }
  }

  const parseRadius = (radius: string | string[]) => {
    if (!isString(radius)) {
      throw new TicketRequestValidationError(
        "Required query parameter 'radius' is missing.",
      )
    }
    return radius
  }

  const { location, radius } = query
  return {
    location: parseLocation(location),
    distanceInMeters: parseRadius(radius),
  }
}

/**
 * @swagger
 *
 * /api/{agencyId}/stations:
 *   get:
 *     summary: Agency stations
 *     description: Lists stations of the specified agency on the map
 *     parameters:
 *       - in: path
 *         name: agencyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The agency ID
 *       - name: location
 *         in: query
 *         required: true
 *         description: Location in format lat,long
 *         example: "60.167235,24.953353"
 *         schema:
 *           type: string
 *       - name: radius
 *         in: query
 *         required: true
 *         description: Radius for stations in meters
 *         example: "1500"
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: "Station id"
 *                   name:
 *                     type: string
 *                     description: "Station name"
 *                   agencyId:
 *                     type: string
 *                     description: "Agency id: the same as specified in the path"
 *                   location:
 *                     type: string
 *                     description: "Location in 'lat,lon' format"
 *                   services:
 *                     type: array
 *                     description: "Service types, currently only 'FERRY'"
 *                     items:
 *                       type: string
 *       '401':
 *         description: Invalid api key
 *       '500':
 *         description: Server error
 */
export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const agencyId = req.query['agencyId']
  if (!isString(agencyId)) {
    return res.status(400).json({ message: 'Invalid agencyId' })
  }
  const agencyName = agencyIdToAgencyName[agencyId]
  if (!agencyName) {
    return res.status(404).json({ message: 'Unknown agencyId: ${agencyId}' })
  }

  try {
    const {
      location: { latitude, longitude },
      distanceInMeters,
    } = parseQuery(req.query)
    const queryResult = await pool.query(stopsQuery, [
      agencyId,
      agencyName,
      longitude,
      latitude,
      distanceInMeters,
    ])
    res.json(queryResult.rows[0]['aggregated_out'])
  } catch (error) {
    console.error(error.message)
    if (error instanceof TicketRequestValidationError) {
      res.status(400).send(error.message)
    } else {
      res.status(500).send('Internal server error')
    }
  }
}

export default withApiKeyAuthentication(handler)
