import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import TicketList from '../../../components/ticket-list/TicketList'
import { Ticket } from '../../../lib/types'
import { readPublicKeyData } from '../../../lib/utils'
import BottomNavbar from '../../../components/BottomNavbar'

interface props {
  DEV_API_KEY: string
  ALLOW_DEMO_FRONTEND: string
  jwtPublicKey: string
}

const TicketListPage: NextPage<props> = ({
  DEV_API_KEY,
  ALLOW_DEMO_FRONTEND,
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

  if (ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ overflowY: 'scroll' }}>
        <TicketList tickets={tickets} />
      </div>

      <BottomNavbar />
    </div>
  )
}

export default TicketListPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
      jwtPublicKey: await readPublicKeyData(),
    },
  }
}
