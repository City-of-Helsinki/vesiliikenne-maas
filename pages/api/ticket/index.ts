import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket } from '../../../lib/ticket-service'
import { toNewTicketEntry } from '../../../lib/utils'
import { NewTicketEntry } from '../../../lib/types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST')
    res.status(405).json({ Error: 'Cannot GET' })

  let newTicketEntry: NewTicketEntry
  try {
    newTicketEntry = toNewTicketEntry(req.body)
  } catch (error) {
    return res.status(400).send(error.message)
  }
  const uuid = await createTicket(newTicketEntry)
  res.json({ uuid })
}
