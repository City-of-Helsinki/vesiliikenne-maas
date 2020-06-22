import * as React from 'react'
import ApiKeyField from './ApiKeyField'

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
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handlePurchase(tokenValue)
      }}
    >
      <ApiKeyField
        token={tokenValue}
        handleChange={e => setTokenValue(e.target.value)}
      />
      <button type="submit" style={buttonStyle}>
        Buy the ticket
      </button>
    </form>
  )
}

export default TicketForm
