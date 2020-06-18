import * as React from 'react'

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
  token: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ApiKeyField = ({ token, handleChange }: Props) => (
  <div style={tokenRowStyle}>
    <label style={labelStyle}>
      Authentication token:
      <input
        type="text"
        style={inputStyle}
        value={token}
        onChange={handleChange}
      />
    </label>
  </div>
)

export default ApiKeyField
