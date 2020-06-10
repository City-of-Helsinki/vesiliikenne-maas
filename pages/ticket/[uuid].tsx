import { GetServerSideProps, NextPage } from 'next'
import { Ticket, findTicket } from '../../lib/ticket-service'
import moment from 'moment'
import qrcode from 'qrcode'
import NextError from 'next/error'
import * as React from 'react'
import TicketContainer from '../../components/TicketContainer'

interface TicketPageProperties {
  ticket: Ticket
}

const TicketPage: NextPage<TicketPageProperties> = ({ ticket }) => {
  const getQrCodeContents = async (uuid: string) => {
    const contents = await qrcode.toDataURL(uuid)
    return contents
  }
  if (!ticket.uuid) {
    return <NextError statusCode={404} />
  }

  return (
    <TicketContainer
      ticketType={ticket.discountGroupId}
      validTo={moment(ticket.validTo)}
      qrCodeContents={getQrCodeContents(uuid)}
    />
  )
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const { uuid } = context.query
  if (typeof uuid !== 'string') throw new Error(`Uuid is not a string: ${uuid}`)
  const ticket = await findTicket(uuid)

  return {
    props: {
      ticket: ticket
    }
  }
}
