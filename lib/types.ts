import * as t from 'io-ts'

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

export const TicketType = t.strict({
  uuid: t.string,
  ticketOptionId: t.number,
  logoData: t.union([t.string, t.undefined, t.null]),
  description: t.string,
  ticketName: t.string,
  amount: t.string,
  currency: t.string,
  agency: t.string,
  discountGroup: t.string,
  validTo: t.string,
  validFrom: t.string,
  instructions: t.string,
})

export type Ticket = t.TypeOf<typeof TicketType>

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

export const TicketOptionType = t.strict({
  id: t.number,
  logoData: t.union([t.string, t.undefined, t.null]),
  description: t.string,
  ticketName: t.string,
  amount: t.string,
  agency: t.string,
  discountGroup: t.string,
  currency: t.string,
  validityseconds: t.union([t.number, t.undefined]),
  instructions: t.string,
})

export const TicketOptionsType = t.array(TicketOptionType)

export type TicketOption = t.TypeOf<typeof TicketOptionType>
export type TicketOptions = t.TypeOf<typeof TicketOptionsType>

export interface Station {
  id: string
  name: string
  agencyId: string
  location: string
  services: string[]
}
