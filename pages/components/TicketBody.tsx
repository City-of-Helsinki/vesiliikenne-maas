const ticketBodyStyle = {
  display: 'grid',
  padding: '1.25rem 1.25rem 1.75rem 1.25rem'
}

const qrCodeStyle = {
  margin: 'auto',
  width: '250px',
  height: '250px',
  backgroundColor: 'black'
}

const TicketBody = props => (
  <div className="ticket-body" style={ticketBodyStyle}>
    <div className="qr-code" style={qrCodeStyle}></div>
  </div>
)

export default TicketBody
