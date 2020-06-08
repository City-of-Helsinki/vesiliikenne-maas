import express from 'express'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'

import { getFilteredRoutes } from './create-routes-json'
import { renderTicket } from './ticket-renderer'

dotenv.config()
const app = express()

app.get(
  '/api/routes',
  asyncHandler(async (_, res) => {
    res.json(await getFilteredRoutes())
  })
)

app.get('/api/ticket/:uuid', asyncHandler(renderTicket))

app.use(express.static('public'))

const port = process.env.PORT
if (port) {
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
} else {
  console.error('PORT is undefined')
  process.exit(1)
}
