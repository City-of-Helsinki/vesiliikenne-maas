import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket } from '../../../lib/ticket-service'
import { toNewTicketEntry } from '../../../lib/utils'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    try {
      const newTicketEntry = toNewTicketEntry(req.body)

      const uuid = await createTicket(newTicketEntry)
      res.json({ uuid })
    } catch (error) {
      res.status(400).json(error)
    }

    res.status(400).json({ Error: 'invalid parameters' })
  } else {
    res.status(404).json({ Error: 'Cannot GET' })
  }
}
