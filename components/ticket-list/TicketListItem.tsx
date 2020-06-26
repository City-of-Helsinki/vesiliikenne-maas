import * as React from 'react'

const ticketStyle = {
  background: '#2f296a',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '15px',
  fontSize: '16px',
  color: '#fff',
  textAlign: 'left' as const, // https://github.com/typestyle/typestyle/issues/281
}

const h1Style = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 400,
}

const h2Style = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 400,
}

interface Props {
  agencyName: string
  discountGroupId: string
  ticketName: string
}

const TicketListItem = ({ agencyName, discountGroupId, ticketName }: Props) => {
  return (
    <div style={ticketStyle}>
      <h1 style={h1Style}>{agencyName}, {discountGroupId}</h1>
      <h2 style={h2Style}>{ticketName}, date</h2>
      <p>Location marker, stops?</p>
    </div>
  )
}

export default TicketListItem
