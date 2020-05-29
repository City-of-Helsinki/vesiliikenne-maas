import axios, { AxiosResponse } from 'axios'
import { promises as fs } from 'fs'
import { QueryResponse, Route } from './types'

const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

const query = `{
  routes(transportModes: FERRY) {
    id
    shortName
    longName
    patterns {
      directionId
      name
      id
      headsign
      stops {
        id
        name
        lat
        lon
      }
    }
    agency {
      name
    }
  }
}
`;

const fetchRoutes = async (url: string, query: string) => {
  const response: AxiosResponse<QueryResponse> = await axios.post(url, {
    query
  })
  return response.data.data.routes
};

const filterByAgencyName = (routes: Route[], name: string) =>
  routes.filter(route => route.agency.name === name);

const writeJSON = async (routes: string) => {
  await fs.writeFile('./routes.json', routes);
  console.log('File saved');
};

const main = async () => {
  const routes = await fetchRoutes(url, query);
  const filteredRoutes = filterByAgencyName(routes, 'JT-Line Oy');
  await writeJSON(JSON.stringify(filteredRoutes, null, '  '));
};

main();
