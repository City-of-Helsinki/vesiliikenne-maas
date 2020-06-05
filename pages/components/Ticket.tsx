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

const Ticket = props => (
  <body style={bodyStyle}>
    <div className="ticket" style={ticketStyle}>
      <TicketHeader />
      <TicketBody />
    </div>
  </body>
)

export default Ticket
