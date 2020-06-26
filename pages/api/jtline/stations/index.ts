import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../../lib/middleware'
import { isString} from '../../../../lib/utils'
import { pool } from '../../../../lib/db';

// language=PostgreSQL
const jtlineStopsQuery = `with jtline_stops as
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
        where agency_name = 'JT-Line Oy'
          and now()::date between start_date and end_date
          and ST_Distance(
                  the_geom::geography,
                  ST_SetSRID(ST_Point($1, $2), 4326)::geography
                ) <= cast($3 as integer))
select jsonb_agg(
           json_build_object(
               'id', stop_id,
               'location', concat(stop_lat, ',', stop_lon),
               'agencyId', 'jtline',
               'name', stop_name,
               'services', jsonb_build_array('FERRY')
             )
         ) as aggregated_out
from jtline_stops;
`

class TicketRequestValidationError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

const parseQuery = (query: { [key: string]: string | string[]; }) => {
  const parseLocation = (locationString: string|string[]) => {
    if (!isString(locationString)) {
      throw new TicketRequestValidationError("Required query parameter 'location' is missing.")
    }

    const [latitude, longitude] = locationString.split(",")
    return { latitude, longitude }
  }

  const parseRadius = (radius: string|string[]) => {
    if (!isString(radius)) {
      throw new TicketRequestValidationError("Required query parameter 'radius' is missing.")
    }
    return radius
  }

  const { location, radius } = query
  return {
    location: parseLocation(location),
    distanceInMeters: parseRadius(radius)
  }
}

/**
 * @swagger
 *
 * /api/jtline/stations:
 *   get:
 *     summary: JT-Line stations
 *     description: Lists JT-Line stations on the map
 *     parameters:
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
 *                     description: "Agency id: 'jtline'"
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
  try {
    const { location: {latitude, longitude}, distanceInMeters } = parseQuery(req.query)
    const queryResult = await pool.query(jtlineStopsQuery, [longitude, latitude, distanceInMeters])
    res.json(queryResult.rows[0]['aggregated_out'])
  } catch (e) {
    if (e instanceof TicketRequestValidationError) {
      res.status(400).send(e.message)
    } else {
      throw e;
    }
  }
}

export default withApiKeyAuthentication(handler)
