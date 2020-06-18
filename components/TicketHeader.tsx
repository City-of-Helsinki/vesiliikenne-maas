import * as React from 'react'
import moment from 'moment-timezone'

const discountGroupStyle = {
  padding: '0.75rem',
  borderBottom: '2px dashed hsl(200, 10%, 92%)',
}

const h1Style = {
  fontSize: '1.2rem',
  margin: 0,
}

const ticketInfoStyle = {
  padding: '1.25rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  borderBottom: '2px dashed hsl(200, 10%, 92%)',
}

const ticketvalidToStyle = {
  display: 'grid',
  gridTemplateRows: 'repeat(2, 1fr)',
}

const ticketDiscountGroupStyle = {
  display: 'grid',
  gridTemplateRows: 'repeat(2, 1fr)',
  justifyItems: 'end',
}

const labelStyle = {
  fontSize: '0.8rem',
  color: 'hsl(200, 10%, 85%)',
  paddingBottom: '0.5rem',
}

interface Props {
  discountGroup: string
  validTo: moment.Moment
}

const TicketHeader = ({ discountGroup, validTo }: Props) => (
  <div className="ticket-header">
    <div className="ticket-type" style={discountGroupStyle}>
      <h1 style={h1Style}>Day Ticket</h1>
    </div>
    <div className="ticket-info" style={ticketInfoStyle}>
      <div className="ticket-valid-until" style={ticketvalidToStyle}>
        <span className="label" style={labelStyle}>
          Valid Until
        </span>
        <span>{validTo.tz('Europe/Helsinki').format('HH:mm')}</span>
      </div>
      <div className="ticket-discount-group" style={ticketDiscountGroupStyle}>
        <span className="label" style={labelStyle}>
          Discount Group
        </span>
        <span>{discountGroup}</span>
      </div>
    </div>
  </div>
)

export default TicketHeader
