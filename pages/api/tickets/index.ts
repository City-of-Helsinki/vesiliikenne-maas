import { NextApiRequest, NextApiResponse } from 'next'
import { getTickets } from '../../../lib/ticket-service'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { createJWT, readPrivateKeyData } from '../../../lib/utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (process.env.ALLOW_DEMO_FRONTEND !== 'allow')
      return res.status(404).end()

    const tickets = await getTickets()

    const jwToken = createJWT({ tickets }, readPrivateKeyData())
    res.json(jwToken)
  } catch (error) {
    res.status(500).send({ error })
  }
}

export default withApiKeyAuthentication(handler)
