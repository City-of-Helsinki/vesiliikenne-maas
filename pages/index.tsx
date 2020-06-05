import { GetServerSideProps, NextPage } from 'next'
import { qrCodeWithTicketDetails, Ticket } from '../src/ticket-renderer'
import * as React from 'react'
import TicketContainer from './components/TicketContainer'

interface IndexPageProperties {
  qrCodeContents: string
  ticket: Ticket
}

const IndexPage: NextPage<IndexPageProperties> = ({
  qrCodeContents,
  ticket
}) =>
  <TicketContainer
    ticketType={ticket.ticketTypeId}
    validUntil={new Date(ticket.validTo)}
    qrCodeContents={qrCodeContents}
  />

export default IndexPage

export const getServerSideProps: GetServerSideProps = async context => {
  const [qrCodeContents, ticket] = await qrCodeWithTicketDetails('foo bar')
  return { props: { qrCodeContents, ticket } }
}
