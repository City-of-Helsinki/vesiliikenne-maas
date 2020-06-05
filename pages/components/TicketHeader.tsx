const ticketTypeStyle = {
  padding: '0.75rem',
  borderBottom: '2px dashed hsl(200, 10%, 92%)'
}

const h1Style = {
  fontSize: '1.2rem',
  margin: 0
}

const ticketInfoStyle = {
  padding: '1.25rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  borderBottom: '2px dashed hsl(200, 10%, 92%)'
}

const ticketValidUntilStyle = {
  display: 'grid',
  gridTemplateRows: 'repeat(2, 1fr)'
}

const ticketDiscountGroupStyle = {
  display: 'grid',
  gridTemplateRows: 'repeat(2, 1fr)',
  justifyItems: 'end'
}

const labelStyle = {
  fontSize: '0.8rem',
  color: 'hsl(200, 10%, 85%)',
  paddingBottom: '0.5rem'
}

const TicketHeader = props => (
  <div className="ticket-header">
    <div className="ticket-type" style={ticketTypeStyle}>
      <h1 style={h1Style}>Päivälippu</h1>
    </div>
    <div className="ticket-info" style={ticketInfoStyle}>
      <div className="ticket-valid-until" style={ticketValidUntilStyle}>
        <span className="label" style={labelStyle}>
          Voimassa
        </span>
        <span>10.24 asti</span>
      </div>
      <div className="ticket-discount-group" style={ticketDiscountGroupStyle}>
        <span className="label" style={labelStyle}>
          Asiakasryhmä
        </span>
        <span>Opiskelija</span>
      </div>
    </div>
  </div>
)

export default TicketHeader
