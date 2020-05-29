import express from 'express'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'

import { getFilteredRoutes } from './create-routes-json'

dotenv.config()
const app = express()

app.get('/api/mapbox-token', (_, res) =>
  res.json(process.env.MAPBOX_ACCESS_KEY)
)

app.get('/api/routes', asyncHandler(async (_, res) => {
  res.json(await getFilteredRoutes())
}))

app.use(express.static('public'))

app.listen(process.env.APP_PORT, () =>
  console.log(`Listening at http://localhost:${process.env.APP_PORT}`)
)
