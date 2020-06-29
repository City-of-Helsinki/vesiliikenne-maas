export interface QueryResponse {
  data: QueryResponseData
}

export interface QueryResponseData {
  routes: Route[]
}

export interface Route {
  shortName: string
  stops: Stop[]
  agency: Agency
  id: string
  longName: string
}

interface Stop {
  name: string
  lon: number
  lat: number
}

interface Agency {
  name: string
}

export interface Ticket {
  uuid: string
  agency: string
  ticketTypeId: string
  ticketTypeInfo: TSPTicket
  discountGroupId: string
  validFrom: string
  validTo: string
}

export interface NewTicketEntry {
  agency: string
  discountGroupId: string
  ticketTypeId: string
}

interface crdResponses {
  saleId: string
  status: number
}

export interface CrdResponse {
  responses: crdResponses[]
  success: number
  skipped: number
  failed: number
  status: number
}

export interface TSPTicket {
  id: string
  logoId: string
  description: string
  name: string
  amount: string
  currency: string
  validityseconds?: number
}

export interface station {
  id: string
  name: string
  agencyId: string
  location: string
  services: string[]
}
