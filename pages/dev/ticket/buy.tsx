import { NextPage, GetServerSideProps } from 'next'
import Router from 'next/router'
import * as React from 'react'
import TicketForm from '../../../components/TicketForm'
import NextError from 'next/error'

interface props {
  NODE_ENV: string
}

const TicketPage: NextPage<props> = ({ NODE_ENV }) => {
  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }
  const handleClick = async (token: string) => {
    const response = await fetch('/api/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
      },
      body: JSON.stringify({
        agency: 'JT-Line',
        discountGroupId: 'Adult',
        ticketTypeId: 'Day',
      }),
    })

    const { uuid } = await response.json()
    void Router.push(`/dev/ticket/${uuid}`)
  }

  return <TicketForm handlePurchase={handleClick} />
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
