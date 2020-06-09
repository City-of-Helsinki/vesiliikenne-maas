import { NextApiRequest, NextApiResponse } from 'next'
import { createTicket } from '../../../lib/create-ticket'
import { isString } from 'util'

interface Body {
  agency: string
  discountGroupId: string
  ticketTypeId: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { agency, discountGroupId, ticketTypeId } = req.body as Body

    const allString = Object.values({
      agency,
      discountGroupId,
      ticketTypeId
    }).every(isString)

    if (allString) {
      await createTicket(agency, discountGroupId, ticketTypeId)
      res.json({ agency, discountGroupId, ticketTypeId })
    } else {
      res.status(400).json({ Error: 'invalid parameters' })
    }
  } else {
    res.status(404).json({ Error: 'Cannot GET' })
  }
}
