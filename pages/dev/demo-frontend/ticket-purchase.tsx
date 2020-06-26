import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import Router from 'next/router'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
}


const TicketPurchase: NextPage<props> = ({ DEV_API_KEY, NODE_ENV }) => {
  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }

  const handleClick = async () => {
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

  return (
    <div>
      <div>Ticket information</div>
      <form onSubmit={ e => {
        e.preventDefault()
        handleClick()
      }
      }>
        <li><button>Confirm purchase</button></li>
      </form>
    </div>
  )
}

export default TicketPurchase

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV
    },
  }
}
