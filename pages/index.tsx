import * as React from 'react'
import { NextPage } from 'next'

const Home: NextPage = ({}) => {
  return <div><h3>Index</h3>
    <ul>
      <li><a href="/hsl-routes.html">HSL route visualization</a></li>
      <li><a href="/redoc.html">API docs</a></li>
      <li><a href="/ticket/c9a5c85d-7d8a-4f8c-8424-ba7f6434d010">Sample ticket</a></li>
    </ul>
  </div>
}

export default Home
