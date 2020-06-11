import * as React from 'react'

const ticketBodyStyle = {
  display: 'grid',
  padding: '1.25rem 1.25rem 1.75rem 1.25rem'
}

const qrCodeStyle = {
  margin: 'auto'
}

interface Props {
  qrCodeContents: string
}

const TicketBody = ({ qrCodeContents }: Props) => (
  <div className="ticket-body" style={ticketBodyStyle}>
    <img alt="the qr code" style={qrCodeStyle} src={qrCodeContents} />
  </div>
)

export default TicketBody
