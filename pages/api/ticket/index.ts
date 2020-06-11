import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket, saveTicket } from '../../../lib/ticket-service'
import { toNewTicketEntry } from '../../../lib/utils'
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

  const crdResponse = await postTicketToCRD(
    process.env.CRD_URL,
    process.env.CRD_TOKEN,
    ticket,
  )

  if (crdResponse.failed) {
    return res.send(502)
  }

  console.log(crdResponse)
  const uuid = await saveTicket(ticket)
  res.json({ uuid })
}
