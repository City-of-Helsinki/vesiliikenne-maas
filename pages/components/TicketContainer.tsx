import TicketHeader from './TicketHeader'
import TicketBody from './TicketBody'

const bodyStyle = {
  minHeight: '100vh',
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

type Props = {
  ticketType: string
  validUntil: Date
  qrCodeContents: string
}

const TicketContainer = ({ ticketType, validUntil, qrCodeContents }: Props) => (
  <body style={bodyStyle}>
    <div className="ticket" style={ticketStyle}>
      <TicketHeader ticketType={ticketType} validUntil={validUntil} />
      <TicketBody qrCodeContents={qrCodeContents} />
    </div>
  </body>
)

export default TicketContainer
