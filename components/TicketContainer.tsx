import * as React from 'react'
import moment from 'moment-timezone'
import { Ticket } from '../lib/types'
import Link from 'next/link'

interface Props {
  ticket: Ticket
  qrCodeContents: string
}

const bodyStyle = {
  margin: 0,
  display: 'grid',
  gridTemplateRows: '8% 92%',
  height: '90vh',
  textAlign: 'center' as const, // https://github.com/typestyle/typestyle/issues/281
}

const navStyle = {
  background: '#2f296a',
  padding: '10px',
  display: 'grid',
  gridTemplateColumns: '50% 50%',
  alignContent: 'center',
  textAlign: 'left' as const,
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
}

const ticketContainerStyle = {
  margin: 'auto',
}

const qrCodeStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
}

const ticketInfoStyle = {
  fontWeight: 600,
}

const TicketContainer = ({ ticket, qrCodeContents }: Props) => {
  return (
    <main style={bodyStyle}>
      <nav style={navStyle}>
        <Link href="/dev/demo-frontend/ticket-list">
          <a style={linkStyle}>&lt; Back</a>
        </Link>
      </nav>
      <div style={ticketContainerStyle}>
        <img alt="the qr code" style={qrCodeStyle} src={qrCodeContents} />
        <div>
          <div style={ticketInfoStyle}>
            <p>{ticket.ticketName}</p>
            <p>
              {ticket.agency}, {ticket.discountGroup}
            </p>
            <time>
              {moment(ticket.validFrom)
                .tz('Europe/Helsinki')
                .format('Do MMMM HH:mm')}{' '}
              –{' '}
              {moment(ticket.validTo)
                .tz('Europe/Helsinki')
                .format('Do MMMM HH:mm')}
            </time>
          </div>
          <div>
            <img width={'30%'} src="/images/jt-logo.jpg" alt="JT-logo" />
          </div>
          <p>{ticket.description}</p>
        </div>
      </div>
    </main>
  )
}

export default TicketContainer
