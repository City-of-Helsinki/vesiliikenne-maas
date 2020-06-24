import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../../lib/middleware'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

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
          and now() between start_date and end_date
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
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {location, radius} = req.query
  if (typeof location !== 'string') {
    return res.status(400).send("Invalid location")
  }
  const [latitude, longitude] = location.split(",")
  const distanceInMeters = radius
  if (distanceInMeters == null) {
    return res.status(400).send("Required parameter 'radius' is missing.")
  }
  const queryResult = await pool.query(jtlineStopsQuery, [longitude, latitude, distanceInMeters])
  res.json(queryResult.rows[0]['aggregated_out'])
}

export default withApiKeyAuthentication(handler)
