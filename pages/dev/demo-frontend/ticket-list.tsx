import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import TicketList from '../../../components/ticket-list/TicketList'
import { Ticket } from '../../../lib/types'
import { readPublicKeyData } from '../../../lib/utils'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
  jwtPublicKey: string
}

const TicketListPage: NextPage<props> = ({
  DEV_API_KEY,
  NODE_ENV,
  jwtPublicKey,
}) => {
  const [tickets, setTickets] = React.useState<Ticket[]>([])

  React.useEffect(() => {
    async function getTickets() {
      const response = await axios.get(`/api/tickets`, {
        headers: {
          'x-api-key': DEV_API_KEY,
        },
      })
      const decodedTickets: any = jsonwebtoken.verify(
        await response.data,
        jwtPublicKey,
      )

      setTickets(decodedTickets.tickets)
    }

    getTickets()
  }, [])

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }
  return <TicketList tickets={tickets} />
}

export default TicketListPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
      jwtPublicKey: await readPublicKeyData(),
    },
  }
}
