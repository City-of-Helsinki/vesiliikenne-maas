import * as React from 'react'
import { Ticket } from '../../lib/types'
import TicketListItem from './TicketListItem'

const ticketListStyle = {
  background: '#FFF',
  padding: '20px',
  fontSize: '18px',
  color: '#2f296a',
  textAlign: 'center' as const, // https://github.com/typestyle/typestyle/issues/281
  fontFamily: "'Roboto', sans-serif",
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
  const ticketsLi = tickets.map(ticket => (
    <TicketListItem
      agencyName={ticket.agency}
      discountGroupId={ticket.discountGroupId}
      ticketName={ticket.ticketTypeInfo?.name}
    />
  ))

  return (
    <div style={ticketListStyle}>
      <h1 style={h1Style}>Tickets</h1>
      {ticketsLi}
    </div>
  )
}

export default TicketList
