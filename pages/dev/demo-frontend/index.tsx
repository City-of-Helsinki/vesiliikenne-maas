import { NextPage, GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import * as React from 'react'
import NextError from 'next/error'
import JTlineButton from '../../../components/JTlineButton'
import BottomNavbar from '../../../components/BottomNavbar'

const MapComponent = dynamic(() => import('../../../components/MapComponent'), {
  ssr: false,
})

interface props {
  DEV_API_KEY: string
  ALLOW_DEMO_FRONTEND: string
  MAPBOX_ACCESS_KEY: string
}

const DemoIndex: NextPage<props> = ({ ALLOW_DEMO_FRONTEND, MAPBOX_ACCESS_KEY }) => {
  if (ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }

  return (
    <div>
      <MapComponent
        accessToken={MAPBOX_ACCESS_KEY}
        height={'90vh'}
        zIndex={1}
        stations={false}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15vh',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
      >
        <JTlineButton />
      </div>
      <BottomNavbar />
    </div>
  )
}

export default DemoIndex

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      MAPBOX_ACCESS_KEY: process.env.MAPBOX_ACCESS_KEY,
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
    },
  }
}
