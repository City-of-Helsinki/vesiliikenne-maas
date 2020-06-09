import { NextPage } from 'next'
import Router from 'next/router'
import * as React from 'react'
import TicketForm from '../components/TicketForm'

const TicketPage: NextPage = () => (
  <TicketForm
    onClick={async () => {
      const ticket = await (
        await fetch('/api/ticket', {
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
      ).json()
      console.log(ticket)
      Router.push(`/ticket/${ticket.uuid}`)
    }}
  />
)

export default TicketPage
