import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import moment from 'moment-timezone'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
}

interface TicketOption {
  amount: string
  currency: string
  description: string
  id: string
  name: string
}


const FerryStations: NextPage<props> = ({ DEV_API_KEY, NODE_ENV }) => {
  const [maasTickets, setMaasTickets] = React.useState<TicketOption[]>([])

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  React.useEffect(() => {
    async function getTickets() {
      const currentTimeMS = moment().tz('Europe/Helsinki').valueOf()
      const response = await axios.get(
        `/api/maas/tickets?startTime=${currentTimeMS}`,
        {
          headers: {
            'x-api-key': DEV_API_KEY,
          },
        },
      )

      setMaasTickets(response.data)
    }

    getTickets()
  }, [])

  const ticketOptions = maasTickets.map(ticket => (
    <li>
      <div>
        <div>{ticket.name}</div>
        <div>{ticket.description}</div>
      </div>
      <div>
        {ticket.amount}{(ticket.currency === 'EUR') ? '€' : ticket.currency}
      </div>
    </li>
  ))

  return (
    <div>
    <div>JTLine stations on a map </div>
    <div>Ticket options
        <ul>
            {ticketOptions}
        </ul>
    </div>
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
