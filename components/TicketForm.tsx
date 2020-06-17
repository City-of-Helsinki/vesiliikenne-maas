import * as React from 'react'

const buttonStyle = {
  background: '#FFF',
  border: '2px solid #00a6fb',
  borderRadius: '10px',
  padding: '20px',
  fontSize: '18px',
  color: '#00a6fb',
}

const tokenRowStyle = {
  margin: '12px 0',
}

const inputStyle = {
  margin: '0 12px',
  width: '32rem',
}

const labelStyle = {
  fontSize: '18px',
  fontFamily: 'sans-serif',
}

interface Props {
  handlePurchase: (token: string) => void
}

const TicketForm = ({ handlePurchase }: Props) => {
  const [tokenValue, setTokenValue] = React.useState('')
  return <form onSubmit={(e) => {
    e.preventDefault()
    handlePurchase(tokenValue)
  }}>
    <div style={tokenRowStyle}>
      <label style={labelStyle}>
        Authentication token:
        <input
          type="text" style={inputStyle} value={tokenValue} onChange={(e) => {
          setTokenValue(e.target.value)
        }}/>
      </label>
    </div>
    <button type="submit" style={buttonStyle}>
      Buy the ticket
    </button>
  </form>
}

export default TicketForm
