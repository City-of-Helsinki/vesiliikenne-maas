import { GetServerSideProps, NextPage } from 'next'
import NextError from 'next/error'
import qrcode from 'qrcode'
import * as React from 'react'
import { parseString } from '../../../../lib/utils'
import { findTicket } from '../../../../lib/ticket-service'
import { Ticket } from '../../../../lib/types'
import TicketContainer from '../../../../components/TicketContainer'

interface TicketPageProperties {
  ticket: Ticket
  qrCodeContents: string
  ALLOW_DEMO_FRONTEND: string
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
  ALLOW_DEMO_FRONTEND,
}) => {
  if (!ticket.uuid || ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }
  return <TicketContainer ticket={ticket} qrCodeContents={qrCodeContents} />
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const uuid = parseString(context.query.uuid, 'uuid')

  const ticket = await findTicket(uuid)

  return {
    props: {
      ticket,
      qrCodeContents: await qrcode.toDataURL(uuid),
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
    },
  }
}
