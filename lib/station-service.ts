import { pool } from './db'
import { StationType, Station } from './types'
import { validate } from './utils'
import * as t from 'io-ts'

export const getNearbyStations = async (
  agencyId: string,
  agencyName: string,
  longitude: string,
  latitude: string,
  distanceInMeters: string,
): Promise<Station[]> => {
  const stopsQuery = `
  SELECT distinct 
    stop_id AS id,
    concat(stop_lat, ',', stop_lon) AS location,
    $1::text AS "agencyId",
    stop_name AS name,
    jsonb_build_array('FERRY') AS services
  FROM gtfs.trips
    JOIN gtfs.routes USING (route_id)
    JOIN gtfs.agency USING (agency_id)
    JOIN gtfs.stop_times USING (trip_id)
    JOIN gtfs.stops USING (stop_id)
    JOIN gtfs.calendar USING (service_id)
      WHERE agency_name = $2
        AND now()::date BETWEEN start_date and end_date
        AND ST_Distance(
                the_geom::geography,
                ST_SetSRID(ST_Point($3, $4), 4326)::geography
            ) <= cast($5 as integer);`

  const queryResult = await pool.query(stopsQuery, [
    agencyId,
    agencyName,
    longitude,
    latitude,
    distanceInMeters,
  ])

  const stations = validate(t.array(StationType), queryResult.rows)

  return stations
}
