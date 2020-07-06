import * as React from 'react'
import Link from 'next/link'
import { Ticket } from '../../lib/types'
import TicketListItem from './TicketListItem'

const ticketListStyle = {
  background: '#FFF',
  padding: '20px',
  fontSize: '18px',
  color: '#2f296a',
  textAlign: 'center' as const, // https://github.com/typestyle/typestyle/issues/281
}

const aStyle = {
  textDecoration: 'none',
}

const h1Style = {
  margin: 0,
  fontSize: '18px',
  marginBottom: '20px',
}

interface Props {
  tickets: Ticket[]
}

const TicketList = ({ tickets }: Props) => {
  const ticketsList = tickets.map(ticket => (
    <Link
      key={ticket.uuid}
      href={`/dev/demo-frontend/view-ticket/${ticket.uuid}`}
    >
      <a style={aStyle}>
        <TicketListItem
          agencyName={ticket.agency}
          discountGroupId={ticket.discountGroup}
          ticketName={ticket.ticketName}
          description={ticket.description}
          validFrom={ticket.validFrom}
          validTo={ticket.validTo}
        />
      </a>
    </Link>
  ))

  return (
    <div style={ticketListStyle}>
      <h1 style={h1Style}>Tickets</h1>
      {ticketsList}
    </div>
  )
}

export default TicketList
