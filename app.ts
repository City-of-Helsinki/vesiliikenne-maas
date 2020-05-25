const request = require("graphql-request");
const fs = require("fs");

const url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";

const query = `{
    routes(transportModes: FERRY) {
        shortName
      stops {
        name
        lon
        lat
      }
      agency{
        name
      }
    }
  }`;

const fetchRoutes = async (url, query) => {
  const data = await request.request(url, query);
  return data.routes;
};

const filterByAgencyName = (routes, name) => {
  return routes.filter((route) => route.agency.name === name);
};

const writeJSON = (routes) => {
  fs.writeFile("./routes.json", routes, (err) => {
    if (err) console.log(err);
    console.log("File saved");
  });
};

const main = async () => {
  const routes = await fetchRoutes(url, query);
  const filteredRoutes = filterByAgencyName(routes, "JT-Line Oy");
  writeJSON(JSON.stringify(filteredRoutes, null, " "));
  console.log(filteredRoutes);
};

main();
