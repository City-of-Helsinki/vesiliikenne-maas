import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../../lib/middleware'
import { parseString } from '../../../../lib/utils'
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
  const { location, radius } = req.query
  let locationString
  try {
    locationString = parseString(location, "location")
  } catch (error) {
    return res.status(400).send(error.message)
  }
  const [latitude, longitude] = locationString.split(",")
  const distanceInMeters = radius
  if (distanceInMeters == null) {
    return res.status(400).send("Required parameter 'radius' is missing.")
  }
  const queryResult = await pool.query(jtlineStopsQuery, [longitude, latitude, distanceInMeters])
  res.json(queryResult.rows[0]['aggregated_out'])
}

export default withApiKeyAuthentication(handler)
