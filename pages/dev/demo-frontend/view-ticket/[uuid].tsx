import { GetServerSideProps, NextPage } from 'next'
import NextError from 'next/error'
import moment from 'moment-timezone'
import qrcode from 'qrcode'
import * as React from 'react'
import { parseString } from '../../../../lib/utils'
import { findTicket } from '../../../../lib/ticket-service'
import { Ticket } from '../../../../lib/types'
import Link from 'next/link'

interface TicketPageProperties {
  ticket: Ticket
  qrCodeContents: string
  NODE_ENV: string
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

const TicketPage: NextPage<TicketPageProperties> = ({
  ticket,
  qrCodeContents,
  NODE_ENV,
}) => {
  if (!ticket.uuid || NODE_ENV !== 'development') {
    return <NextError statusCode={404} />
  }
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
            <p>{ticket.ticketTypeInfo?.name}</p>
            <p>
              {ticket.agency}, {ticket.discountGroupId}
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
          <p>{ticket.ticketTypeInfo?.description}</p>
        </div>
      </div>
    </main>
  )
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const uuid = parseString(context.query.uuid, 'uuid')

  const ticket = await findTicket(uuid)

  return {
    props: {
      ticket: ticket,
      qrCodeContents: await qrcode.toDataURL(uuid),
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
