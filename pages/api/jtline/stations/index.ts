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
                  ST_SetSRID(ST_Point(24.9533522, 60.1672325), 4326)::geography
                ) < 10000)
select jsonb_agg(
           json_build_object(
               'id', stop_id,
               'location', concat(stop_lat, ',', stop_lon),
               'agencyId', 'jtline',
               'name', stop_name,
               'services',
               jsonb_build_array('FERRY')
             )
         )
from jtline_stops;
`


const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const stuff = await pool.query(jtlineStopsQuery)
    //.then((a) => { console.log(a)})
  //console.log(result);
  res.json({moi: "ehllo", stuff})
}

export default withApiKeyAuthentication(handler)
