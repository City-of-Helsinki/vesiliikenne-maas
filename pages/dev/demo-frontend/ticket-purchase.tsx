import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import Router from 'next/router'
import { TSPTicket } from '../../../lib/types'
import { formatPrice } from '../../../lib/currency'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string,
  ticket: TSPTicket,
}


const TicketPurchase: NextPage<props> = ( { DEV_API_KEY, NODE_ENV, ticket }) => {
  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  const handlePurchaseClick = async () => {
    const response = await fetch('/api/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': DEV_API_KEY,
      },
      body: JSON.stringify({
        agency: 'JT-Line',
        discountGroupId: 'Adult',
        ticketTypeId: 'Day',
      }),
    })
    await response.json()
    await Router.push('/dev/demo-frontend/ticket-list')
  }

  const handleCancelClick =  async () => {
    await Router.push('/dev/demo-frontend/ferry-stations')
  }

  return (
    <div>
      <h1>Confirm ticket</h1>
      <table>
        <tbody>
        <tr>
          <td>{ticket.name}</td>
          <td align="right">{formatPrice(ticket.amount, ticket.currency)}</td>
        </tr>
        <tr>
          <td colSpan={2} align={"right"}>
            <span>To pay&nbsp;</span>
            <span style={{fontSize: "1.4em"}}>{formatPrice(ticket.amount, ticket.currency)}</span>
          </td>
        </tr>
        </tbody>
      </table>

      <form onSubmitCapture={ () => {handlePurchaseClick().then() }
      }>
        <li>
          <button onClickCapture={ () => { handleCancelClick().then() }}>Cancel</button>
        </li>
        <li>
          <button>Confirm purchase</button>
        </li>
      </form>
    </div>
  )
}

export default TicketPurchase

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
      ticket: context.query as unknown as TSPTicket,
    },
  }
}
