import axios from 'axios';
import fs from 'fs';
import { Route } from './types';

const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

const query = `{
  routes(transportModes: FERRY) {
    shortName
    stops {
      name
      lon
      lat
    }
    agency {
      name
    }
  }
}`;

const fetchRoutes = async (url: string, query: string): Promise<Route[]> => {
  const response = await axios({
    url,
    method: 'post',
    data: {
      query: query
    }
  });
  return response.data.data.routes;
};

const filterByAgencyName = (routes: Route[], name: string) => {
  return routes.filter((route) => route.agency.name === name);
};

const writeJSON = (routes: any) => {
  fs.writeFile('./routes.json', routes, (err: any) => {
    if (err) console.log(err);
    console.log('File saved');
  });
};

const main = async () => {
  const routes = await fetchRoutes(url, query);
  const filteredRoutes = filterByAgencyName(routes, 'JT-Line Oy');
  writeJSON(JSON.stringify(filteredRoutes, null, '  '));
};

main();
