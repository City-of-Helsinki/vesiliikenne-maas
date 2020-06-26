import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import Link from 'next/link'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
}


const FerryStations: NextPage<props> = ({ DEV_API_KEY, NODE_ENV }) => {
  const [tokenValue, setTokenValue] = React.useState('')

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  return (
    <div>
      <div>Ticket information</div>
      <li><Link href="ticket-listing"><button>Confirm purchase</button></Link></li>
    </div>
  )
}

export default FerryStations

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV
    },
  }
}
