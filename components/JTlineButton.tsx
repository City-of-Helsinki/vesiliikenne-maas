import * as React from 'react'
import Link from 'next/link'

const style = {
  border: 'solid 1px black',
  height: '75px',
  width: '75px',
  borderRadius: '50%',
  zIndex: 400,
  backgroundColor: 'rgba(255, 255, 255)',
}

const JTlineButton = () => {
  return (
    <Link href="/dev/demo-frontend/ferry-stations">
      <button style={style}>
        <img width={'100%'} src="/images/jt-logo.jpg" alt="JT-logo" />
      </button>
    </Link>
  )
}

export default JTlineButton
