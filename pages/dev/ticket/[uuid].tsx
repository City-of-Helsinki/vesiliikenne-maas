import { GetServerSideProps, NextPage } from 'next'
import { findTicket } from '../../../lib/ticket-service'
import qrcode from 'qrcode'
import * as React from 'react'
import TicketContainer from '../../../components/TicketContainer'
import { parseString } from '../../../lib/utils'
import { Ticket } from '../../../lib/types'
import NextError from 'next/error'

interface TicketPageProperties {
  ticket: Ticket
  qrCodeContents: string
  NODE_ENV: string
}

const TicketPage: NextPage<TicketPageProperties> = ({
  ticket,
  qrCodeContents,
  NODE_ENV,
}) => {
  if (!ticket.uuid || NODE_ENV !== 'development') {
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
      ticket: ticket,
      qrCodeContents: await qrcode.toDataURL(uuid),
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
