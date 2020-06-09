import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import TicketForm from '../components/TicketForm'
import { createTicket } from '../../lib/create-ticket'

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
    }}
  />
)

export default TicketPage
