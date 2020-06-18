import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { parseString, readPublicKeyData } from '../lib/utils'

const fetchTicket = async (ticketUuid: string, apiKey: string) =>
  await axios.get(`http://localhost:3000/api/ticket/${ticketUuid}`, {
    headers: {
      'x-api-key': apiKey,
    },
  })

const requestTicketContents = async (ticketUuid: string, apiKey: string) => {
  const ticket = await fetchTicket(
    ticketUuid,
    apiKey)
  const jsonwebtokenofdata = ticket.data.ticketdata
  const decode: any = jsonwebtoken.verify(jsonwebtokenofdata, await readPublicKeyData())
  return parseString(decode.ticket, 'ticket')
}

const main = async () => {
  const [ticketUuid, apiKey] = process.argv.slice(2)
  console.log(await requestTicketContents(ticketUuid, apiKey))
}

if (require.main === module) {
  void main()
}
