import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 *
 * /api/mapbox-token:
 *   get:
 *     summary: MapBox token
 *     description:  MapBox token for the HSL based ferry route display
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
export default (req: NextApiRequest, res: NextApiResponse) =>
  res.json(`"${process.env.MAPBOX_ACCESS_KEY}"`)
