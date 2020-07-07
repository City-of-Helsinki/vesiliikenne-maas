import { NextApiRequest, NextApiResponse } from 'next'
import { getTickets } from '../../../lib/ticket-service'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { createJWT } from '../../../lib/utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tickets = await getTickets()

    const jwToken = await createJWT({ tickets })
    res.json(jwToken)
  } catch (error) {
    res.status(500).send({ error })
  }
}

export default withApiKeyAuthentication(handler)
