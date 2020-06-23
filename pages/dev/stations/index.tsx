import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import ApiKeyField from '../../../components/ApiKeyField'

interface props {
  NODE_ENV: string
}


const StationsPage: NextPage<props> = ({ NODE_ENV }) => {
  const [tokenValue, setTokenValue] = React.useState('')
  const [stations, setStations] = React.useState<any[]>([])

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  const handleClick = async (token: string) => {
    const response = await axios.get('/api/jtline/stations', {
      headers: {
        'x-api-key': token,
      },
    })

    setStations(await response.data)
  }

  const stationsList = stations.map(station => (
    <pre key={station.name}>{JSON.stringify(station, null, 2)}</pre>
  ))

  return (
    <form onSubmit={e => e.preventDefault()}>
      <ApiKeyField
        token={tokenValue}
        handleChange={e => setTokenValue(e.target.value)}
      />
      <button onClick={() => handleClick(tokenValue)}>List stations</button>
      {stationsList}
    </form>
  )
}

export default StationsPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
