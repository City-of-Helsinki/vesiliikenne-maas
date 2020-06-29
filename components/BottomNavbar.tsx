import * as React from 'react'
import { CSSProperties } from 'react'
import Link from 'next/link'

const flexStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
}

const buttonStyle: CSSProperties = {
  width: '50%',
  height: '10vh',
  fontSize: '2em',
  minHeight: '50px',
  borderRadius: '10px',
  backgroundColor: '#4c81af',
  color: 'white',
}

const BottomNavbar = () => {
  return (
    <div style={flexStyle}>
      <Link href={'/dev/demo-frontend/ticket-list'}>
        <button style={buttonStyle}>Tickets</button>
      </Link>
      <Link href={'/dev/demo-frontend'}>
        <button style={buttonStyle}>Buy Tickets</button>
      </Link>
    </div>
  )
}

export default BottomNavbar
