import { NextPage, GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import * as React from 'react'
import NextError from 'next/error'
import JTlineButton from '../../../components/JTlineButton'

const MapComponent = dynamic(() => import('../../../components/MapComponent'), {
  ssr: false,
})

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
  MAPBOX_ACCESS_KEY: string
}

const DemoIndex: NextPage<props> = ({ NODE_ENV, MAPBOX_ACCESS_KEY }) => {
  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  return (
    <div>
      <MapComponent accessToken={MAPBOX_ACCESS_KEY} />
      <div
        style={{
          margin: '-100px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <JTlineButton />
      </div>
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
