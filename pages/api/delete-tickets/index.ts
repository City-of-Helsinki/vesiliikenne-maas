import { NextApiRequest, NextApiResponse } from 'next'
import { withApiKeyAuthentication } from '../../../lib/middleware'
import { unlink } from 'fs/promises'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.ALLOW_DEMO_FRONTEND !== 'allow') return res.status(401).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ Error: 'Cannot GET' })
  }
  try {
    await unlink('./tickets.csv')
    res.status(200).send('Tickets deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed deleting tickets')
  }
}

export default withApiKeyAuthentication(handler)
