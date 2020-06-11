import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { isString, toNewTicketEntry } from '../../../lib/utils'
import { NewTicketEntry } from '../../../lib/types'
import { postTicketToCRD } from '../../../lib/crd'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ Error: 'Cannot GET' })
  }

  let newTicketEntry: NewTicketEntry

  try {
    newTicketEntry = toNewTicketEntry(req.body)
  } catch (error) {
    return res.status(400).send(error.message)
  }

  const ticket = createTicket(newTicketEntry)

  const crdUrl = process.env.CRD_URL
  const apiToken = process.env.CRD_TOKEN
  if (!isString(crdUrl) || !isString(apiToken)) {
    return res.status(500).send('Server configuration error')
  }
  const crdResponse = await postTicketToCRD(
    crdUrl,
    apiToken,
    ticket,
  )

  if (crdResponse.failed) {
    return res.send(502)
  }

  console.log(crdResponse)
  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}
