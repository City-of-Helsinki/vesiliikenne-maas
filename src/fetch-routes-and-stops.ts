import axios from 'axios';

axios({
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  method: 'post',
  data: {
    query: `
      query FerryRoutesAndStops {
        routes(transportModes: FERRY) {
          shortName
          stops {
            lon
            lat
          }
          agency {
            name
          }
        }
      }
    `
  }
}).then((result) => {
  console.log(result.data.data.routes.filter((route: any) => 
    route.agency.name === 'JT-Line Oy'
  ))
});