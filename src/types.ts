export interface Route {
  shortname: string;
  stops: Stop[];
  agency: Agency;
}

interface Stop {
  name: string;
  lon: number;
  lat: number;
}

interface Agency {
  name: string;
}
