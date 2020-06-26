import { NextPage, GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import ApiKeyField from '../../../components/ApiKeyField'
import Link from 'next/link'
import FerryStations from './ferry-stations'

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false })

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
  MAPBOX_ACCESS_KEY: string
}

const DemoIndex: NextPage<props> = ({
  DEV_API_KEY,
  NODE_ENV,
  MAPBOX_ACCESS_KEY,
}) => {
  const [tokenValue, setTokenValue] = React.useState('')

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  return (
    <div>
      <MapComponent accessToken={MAPBOX_ACCESS_KEY} />
      <Link href="/dev/demo-frontend/ferry-stations">
        <button>Open the ferry stations</button>
      </Link>
    </div>
  )
}

export default DemoIndex

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      MAPBOX_ACCESS_KEY: process.env.MAPBOX_ACCESS_KEY,
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
