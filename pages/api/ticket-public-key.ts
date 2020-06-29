import { NextApiRequest, NextApiResponse } from 'next'
import { readPublicKeyData } from '../../lib/utils'

/**
 * @swagger
 *
 * /api/ticket-public-key:
 *   get:
 *     summary: Public key for jwt verification
 *     description:  The public key part of the keypair used to sign the JWT encoded tickets
 *     responses:
 *       '200':
 *         description: OK
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.send(readPublicKeyData())
}
