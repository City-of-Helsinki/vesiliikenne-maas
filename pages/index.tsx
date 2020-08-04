import * as React from 'react'
import Link from 'next/link'

import { NextPage } from 'next'

const Home: NextPage = () => {
  const routes = [
    {
      name: 'Demo frontend',
      route: 'dev/demo-frontend',
    },
    {
      name: 'API docs',
      route: 'specs/redoc.html',
    },
    {
      name: 'Readiness check',
      route: 'readiness',
    },
    {
      name: 'Liveness check',
      route: 'healthz',
    },
    {
      name: 'HSL route visualization',
      route: 'hsl-routes.html',
    },
  ]
  return (
    <div>
      <h3>Index</h3>
      <ul>
        {routes.map(route => (
          <li key={route.name}>
            <Link href={route.route}>
              <a>{route.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
