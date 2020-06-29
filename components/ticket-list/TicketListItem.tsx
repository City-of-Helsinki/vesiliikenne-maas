import * as React from 'react'
import moment from 'moment-timezone'

const ticketStyle = {
  background: '#2f296a',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '15px',
  fontSize: '14px',
  color: '#fff',
  textAlign: 'left' as const, // https://github.com/typestyle/typestyle/issues/281
}

const h1Style = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 400,
}

const pStyle = {
  marginBottom: 0,
}

interface Props {
  agencyName: string
  discountGroupId: string
  ticketName: string
  description: string
  validFrom: string
  validTo: string
}

const TicketListItem = ({
  agencyName,
  discountGroupId,
  ticketName,
  description,
  validFrom,
  validTo,
}: Props) => {
  return (
    <div style={ticketStyle}>
      <h1 style={h1Style}>
        {agencyName}, {discountGroupId}
      </h1>
      <span>{ticketName} </span>
      <span>
        {moment(validFrom).tz('Europe/Helsinki').format('HH:mm')} –{' '}
        {moment(validTo).tz('Europe/Helsinki').format('HH:mm')}
      </span>
      <p style={pStyle}>{description}</p>
    </div>
  )
}

export default TicketListItem
