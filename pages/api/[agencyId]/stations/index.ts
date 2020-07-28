import { NextApiRequest, NextApiResponse } from 'next'
import {
  withApiKeyAuthentication,
  withErrorHandler,
} from '../../../../lib/middleware'
import { isString } from '../../../../lib/utils'
import { TicketRequestValidationError } from '../../../../lib/errors'
import { getNearbyStations } from '../../../../lib/station-service'

// Mapping from supported agencyIds to their name in GTFS
const agencyIdToAgencyName: { [key: string]: string } = {
  jtline: 'JT-Line Oy',
}

const parseQuery = (query: { [key: string]: string | string[] }) => {
  const { location, radius, agencyId } = query
  return {
    agencyId: parseAgencyId(agencyId),
    location: parseLocation(location),
    distanceInMeters: parseRadius(radius),
  }
}

const parseAgencyId = (agencyId: string | string[]) => {
  if (!isString(agencyId)) {
    throw new TypeError('AgencyId is not string')
  }
  return agencyId
}

const parseLocation = (locationString: string | string[]) => {
  if (!isString(locationString)) {
    throw new TicketRequestValidationError(
      "Required query parameter 'location' is missing.",
    )
  }

  const [latitude, longitude] = locationString.split(',')
  return { latitude, longitude }
}

const parseRadius = (radius: string | string[]) => {
  if (!isString(radius)) {
    throw new TicketRequestValidationError(
      "Required query parameter 'radius' is missing.",
    )
  }
  return radius
}
/**
 * @swagger
 *
 * /api/{agencyId}/stations:
 *   get:
 *     summary: Agency stations
 *     description: Lists stations of the specified agency on the map
 *     parameters:
 *       - in: path
 *         name: agencyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The agency ID
 *       - name: location
 *         in: query
 *         required: true
 *         description: Location in format lat,long
 *         example: "60.167235,24.953353"
 *         schema:
 *           type: string
 *       - name: radius
 *         in: query
 *         required: true
 *         description: Radius for stations in meters
 *         example: "1500"
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "152"
 *                     description: "Station id"
 *                   name:
 *                     type: string
 *                     example: Long pier
 *                     description: "Station name"
 *                   agencyId:
 *                     type: string
 *                     example: waterbusoy
 *                     description: "Agency id: the same as specified in the path"
 *                   location:
 *                     type: string
 *                     example: 60.17,24.94
 *                     description: "Location in 'lat,lon' format"
 *                   services:
 *                     type: array
 *                     description: "Service types, currently only 'FERRY'"
 *                     items:
 *                       example: FERRY
 *                       type: string
 *       '400':
 *         description: Invalid query parameter
 *       '401':
 *         description: Invalid api key
 *       '404':
 *         description: Unknown agencyId
 *       '500':
 *         description: Server error
 */
export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {
    location: { latitude, longitude },
    distanceInMeters,
    agencyId,
  } = parseQuery(req.query)

  const agencyName = agencyIdToAgencyName[agencyId]
  if (!agencyName) {
    return res.status(404).json({ message: `Unknown agencyId: ${agencyId}` })
  }

  const stations = await getNearbyStations(
    agencyId,
    agencyName,
    longitude,
    latitude,
    distanceInMeters,
  )
  res.json(stations)
}

export default withApiKeyAuthentication(withErrorHandler(handler))
