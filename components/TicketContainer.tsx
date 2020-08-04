import * as React from 'react'
import moment from 'moment-timezone'
import { Ticket } from '../lib/types'

interface Props {
  ticket: Ticket
  qrCodeContents: string
  locale: string
}

const bodyStyle = {
  margin: '30px 0',
  textAlign: 'center' as const, // https://github.com/typestyle/typestyle/issues/281
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

const TicketContainer = ({ ticket, qrCodeContents, locale }: Props) => {
  return (
    <main style={bodyStyle}>
      <div style={ticketContainerStyle}>
        <img alt="the qr code" style={qrCodeStyle} src={qrCodeContents} />
        <div>
          <div style={ticketInfoStyle}>
            <p>{ticket.ticketName}</p>
            <p>
              {ticket.agency}, {ticket.discountGroup}
            </p>
            <time>
              {locale === 'fi' ? 'Voimassa ' : 'Valid until '}
              {moment(ticket.validTo)
                .locale(locale)
                .tz('Europe/Helsinki')
                .format('LLL')}
              {locale === 'fi' && ' asti'}
            </time>
          </div>
          <div>
            <img
              src={`data:image/svg+xml;base64,${ticket.logoData}`}
              alt="Ferry operator logo"
              width="200px"
            />
          </div>
          <p style={{ margin: '2em' }}>{ticket.instructions}</p>
        </div>
      </div>
    </main>
  )
}

export default TicketContainer
