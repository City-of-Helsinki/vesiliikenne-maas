import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import ApiKeyField from '../../../components/ApiKeyField'

interface props {
  NODE_ENV: string
}

interface TicketOption {
  amount: number
  currency: string
  description: string
  id: number
  name: string
}

const TicketsPage: NextPage<props> = ({ NODE_ENV }) => {
  const [tokenValue, setTokenValue] = React.useState('')
  const [tickets, setTickets] = React.useState<TicketOption[]>([])

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  const handleClick = async (token: string) => {
    const response = await axios.get('/api/maasglobal/tickets', {
      headers: {
        'x-api-key': token,
      },
    })

    setTickets(await response.data)
  }

  const ticketList = tickets.map(ticket => (
    <pre key={ticket.name}>{JSON.stringify(ticket, null, 2)}</pre>
  ))

  return (
    <form onSubmit={e => e.preventDefault()}>
      <ApiKeyField
        token={tokenValue}
        handleChange={e => setTokenValue(e.target.value)}
      />
      <button onClick={() => handleClick(tokenValue)}>List tickets</button>
      {ticketList}
    </form>
  )
}

export default TicketsPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
