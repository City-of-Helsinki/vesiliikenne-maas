import { GetServerSideProps, NextPage } from 'next'
import { Ticket, findTicket } from '../../lib/ticket-service'
import moment from 'moment'
import qrcode from 'qrcode'
import NextError from 'next/error'
import * as React from 'react'
import TicketContainer from '../../components/TicketContainer'
import { parseString } from '../../lib/utils'

interface TicketPageProperties {
  ticket: Ticket
  qrCodeContents: string
}

const TicketPage: NextPage<TicketPageProperties> = ({
  ticket,
  qrCodeContents
}) => {
  if (!ticket.uuid) {
    return <NextError statusCode={404} />
  }

  return (
    <TicketContainer
      ticketType={ticket.discountGroupId}
      validTo={moment(ticket.validTo)}
      qrCodeContents={qrCodeContents}
    />
  )
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const uuid = parseString(context.query.uuid, 'uuid')

  const ticket = await findTicket(uuid)

  return {
    props: {
      ticket: ticket,
      qrCodeContents: await qrcode.toDataURL(uuid)
    }
  }
}
