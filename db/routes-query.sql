SET search_path TO gtfs;
with route_and_stops as
         (select route_id,
                 route_short_name,
                 route_long_name,
                 agency_name,
                 trip_headsign,
                 trip_id,
                 start_date,
                 end_date,
                 jsonb_build_object(
                         'departure_time', departure_time,
                         'name', stop_name,
                         'lat', stop_lat,
                         'lon', stop_lon) as stop_info,
                 departure_time
          from agency
                   join routes using (agency_id)
                   join trips using (route_id)
                   join stop_times using (trip_id)
                   join stops using (stop_id)
                   join calendar using (service_id)
          where agency_name = 'JT-Line Oy'),
     routes_by_first_departure as
         (select route_id,
                 agency_name,
                 route_short_name,
                 min(departure_time)::text as                 min_departure_time,
                 route_long_name,
                 trip_headsign,
                 trip_id,
                 jsonb_agg(stop_info order by departure_time) stop_infos
          from route_and_stops

          where now() between start_date and end_date
          group by 1, 2, 3, 5, 6, 7
          order by min(departure_time), 3),
     route_objects_by_departure_time as
         (select route_id,
                 agency_name,
                 route_short_name,
                 route_long_name,
                 jsonb_build_object(
                         'tripId', trip_id,
                         'headsign', trip_headsign,
                         'earliestDeparture', min_departure_time,
                         'stops', stop_infos) as json_trip
          from routes_by_first_departure),
     routes_grouped as
         (select route_id             as "id",
                 route_short_name     as "shortName",
                 route_long_name      as "longName",
                 agency_name          as "agency",
                 jsonb_agg(json_trip order by json_trip ->> 'earliestDeparture') as "patterns"
          from route_objects_by_departure_time
          group by 1, 2, 3, 4)
select jsonb_agg(jsonb_build_object(
        'id', id,
        'shortName', "shortName",
        'longName', "longName",
        'agency', agency,
        'patterns', patterns
    ))
from routes_grouped;
