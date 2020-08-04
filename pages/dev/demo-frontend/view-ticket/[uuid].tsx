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
  locale: string
}

const TicketPage: NextPage<TicketPageProperties> = ({
  ticket,
  qrCodeContents,
  ALLOW_DEMO_FRONTEND,
  locale,
}) => {
  if (!ticket.uuid || ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }
  return (
    <TicketContainer
      locale={locale}
      ticket={ticket}
      qrCodeContents={qrCodeContents}
    />
  )
}

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const uuid = parseString(context.query.uuid, 'uuid')
  const locale = 'fi'
  const ticket = await findTicket(uuid, locale)

  return {
    props: {
      locale,
      ticket,
      qrCodeContents: await qrcode.toDataURL(uuid),
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
    },
  }
}
