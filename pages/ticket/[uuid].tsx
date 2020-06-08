import { GetServerSideProps, NextPage } from 'next'
import { qrCodeWithTicketDetails, Ticket } from '../../lib/ticket-renderer'
import * as React from 'react'
import TicketContainer from '../components/TicketContainer'

interface TicketPageProperties {
  qrCodeContents: string
  ticket: Ticket
}

const TicketPage: NextPage<TicketPageProperties> = ({
  qrCodeContents,
  ticket
}) =>
  <TicketContainer
    ticketType={ticket.ticketTypeId}
    validUntil={new Date(ticket.validTo)}
    qrCodeContents={qrCodeContents}
  />

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const { uuid } = context.query
  if (typeof uuid !== 'string')
    throw new Error(`Uuid is not a string: ${uuid}`)
  const [qrCodeContents, ticket] = await qrCodeWithTicketDetails(uuid)
  return { props: { qrCodeContents, ticket } }
}
