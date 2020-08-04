import axios from 'axios'
import moment from 'moment-timezone'
import { CrdResponse, Ticket } from './types'

const generateObject = (token: string, unixTime: number, uuid: string) => ({
  token,
  sales: [
    {
      saleId: uuid,
      timestamp: unixTime,
      barcode: uuid,
      products: [
        {
          name: 'Island Hopping - MaaS',
          productId: '101',
          type: 'ticket',
          typeDetails: { type: 'adult' },
          amount: 1,
          price: 12,
          vat: 10,
        },
      ],
      payments: [
        {
          payment: 'Checkout',
          sum: 12,
        },
      ],
      routeInfo: {
        route: 'ISLAND HOPPING MAAS',
      },
    },
  ],
})

export const postTicketToCRD = async (
  crdUrl: string,
  apiToken: string,
  ticket: Ticket,
): Promise<CrdResponse> => {
  const ticketToPost = generateObject(
    apiToken,
    moment(ticket.validFrom).unix(),
    ticket.uuid,
  )
  const res = await axios.post(crdUrl, ticketToPost)
  return (await res.data) as CrdResponse
}
