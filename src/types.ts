export interface Route {
  shortName: string;
  stops: Stop[];
  agency: Agency;
  id: string;
  longName: string
}

interface Stop {
  name: string;
  lon: number;
  lat: number;
}

interface Agency {
  name: string;
}
