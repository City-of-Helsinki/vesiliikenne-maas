import { NextPage } from 'next'
import Router from 'next/router'
import * as React from 'react'
import TicketForm from '../components/TicketForm'

const TicketPage: NextPage = () => {
  const handleClick = async () => {
    const response = await fetch('/api/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agency: 'JT-Line',
        discountGroupId: 'Adult',
        ticketTypeId: 'Day'
      })
    })
    const { uuid } = await response.json()

    void Router.push(`/ticket/${uuid}`)
  }
  return <TicketForm onClick={handleClick} />
}

export default TicketPage
