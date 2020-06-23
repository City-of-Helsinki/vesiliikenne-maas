import * as React from 'react'
import { NextPage } from 'next'

const Home: NextPage = () => {
  const routes = [
    {
      name: 'HSL route visualization',
      route: 'hsl-routes.html',
    },
    {
      name: 'API docs',
      route: 'specs/redoc.html',
    },
    {
      name: 'Dev - Sample ticket',
      route: 'dev/ticket/c9a5c85d-7d8a-4f8c-8424-ba7f6434d010',
    },
    {
      name: 'Dev - Buy ticket',
      route: 'dev/ticket/buy',
    },
    {
      name: 'Dev - List available ticket options',
      route: 'dev/tickets',
    },
    {
      name: 'Dev - List available stations',
      route: 'dev/stations',
    },
  ]
  return (
    <div>
      <h3>Index</h3>
      <ul>
        {routes.map(route => (
          <li key={route.name}>
            <a href={route.route}>{route.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
