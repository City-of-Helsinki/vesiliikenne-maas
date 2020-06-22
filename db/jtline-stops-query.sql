SET search_path TO gtfs;
with jtline_stops as
		(select distinct
			stop_id,
			stop_lat,
			stop_lon,
			stop_name
		from trips
			join routes using (route_id)
			join agency using (agency_id)
			join stop_times using (trip_id)
			join stops using (stop_id)
			join calendar using (service_id)
		where agency_name = 'JT-Line Oy'
			and now() between start_date and end_date)
select
	jsonb_agg(
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