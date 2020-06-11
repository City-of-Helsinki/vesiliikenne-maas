import TicketHeader from './TicketHeader'
import TicketBody from './TicketBody'
import * as React from 'react'

const bodyStyle = {
  minHeight: '100vh',
  margin: 0,
  color: 'hsl(200, 10%, 30%)',
  backgroundColor: 'hsl(200, 10%, 96%)',
  display: 'grid',
  fontFamily: "'Roboto', sans-serif"
}

const ticketStyle = {
  width: '80vw',
  backgroundColor: 'white',
  margin: 'auto',
  boxShadow: '0 2px 4px hsla(200, 20%, 20%, 0.25)',
  borderRadius: '0.375em 0.375em 0.375em 0.375em'
}

interface Props {
  ticketType: string
  validTo: moment.Moment
  qrCodeContents: string
}

const TicketContainer = ({ ticketType, validTo, qrCodeContents }: Props) => (
  <div style={bodyStyle}>
    <div className="ticket" style={ticketStyle}>
      <TicketHeader ticketType={ticketType} validTo={validTo} />
      <TicketBody qrCodeContents={qrCodeContents} />
    </div>
  </div>
)

export default TicketContainer
