import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import moment from 'moment'
import { renderToString } from 'react-dom/server'
import qrcode from 'qrcode'
import { findTicket } from '../../lib/ticket-service'
import TicketContainer from '../../components/TicketContainer'

interface TicketPageProperties {
  html: string
}

const TicketPage: NextPage<TicketPageProperties> = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
)

export default TicketPage

export const getServerSideProps: GetServerSideProps = async context => {
  const { uuid } = context.query
  if (typeof uuid !== 'string') throw new Error(`Uuid is not a string: ${uuid}`)
  const ticket = await findTicket(uuid)

  if (!ticket.uuid) {
    return { props: { html: '<p>Ticket not found</p>' } }
  }

  return {
    props: {
      html: renderToString(
        TicketContainer({
          ticketType: ticket.ticketTypeId,
          validUntil: moment(ticket.validTo),
          qrCodeContents: await qrcode.toDataURL(ticket.uuid)
        })
      )
    }
  }
}
