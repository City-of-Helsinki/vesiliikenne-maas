import * as React from 'react'

const buttonStyle = {
  background: '#FFF',
  border: '2px solid #00a6fb',
  borderRadius: '10px',
  padding: '20px',
  fontSize: '18px',
  color: '#00a6fb'
}

interface Props {
  onClick: (ev: React.MouseEvent<HTMLButtonElement>) => void
}

const TicketForm = ({ onClick }: Props) => (
  <button style={buttonStyle} onClick={onClick}>
    Osta Lippu
  </button>
)

export default TicketForm
