import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import ApiKeyField from '../../../components/ApiKeyField'
import Link from 'next/link'
import FerryStations from './ferry-stations'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
}


const DemoIndex: NextPage<props> = ({ DEV_API_KEY, NODE_ENV }) => {
  const [tokenValue, setTokenValue] = React.useState('')

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }
  
  return (
    <div>
      <div>Here will be the initial map centered at users location</div>
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
      NODE_ENV: process.env.NODE_ENV
    },
  }
}
