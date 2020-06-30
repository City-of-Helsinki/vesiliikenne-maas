import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import Router from 'next/router'
import { TSPTicket } from '../../../lib/types'
import { CSSProperties } from 'react'
import { ColorProperty } from 'csstype'
import { ParsedUrlQuery } from 'querystring'
import BottomNavbar from '../../../components/BottomNavbar'
import hslFerryImage from '../../../lib/hsl-ferry-image'

interface props {
  DEV_API_KEY: string
  ALLOW_DEMO_FRONTEND: string
  ticket: TSPTicket | null
}

const TicketPurchase: NextPage<props> = ({
  DEV_API_KEY,
  ALLOW_DEMO_FRONTEND,
  ticket,
}) => {
  if (ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }

  const handlePurchaseClick = async () => {
    const response = await fetch('/api/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': DEV_API_KEY,
      },
      body: JSON.stringify({
        agency: 'JT-Line',
        discountGroupId: 'Adult',
        ticketTypeId: '1',
      }),
    })
    await response.json()
    await Router.push('/dev/demo-frontend/ticket-list')
  }

  const handleCancelClick = async () => {
    await Router.push('/dev/demo-frontend/ferry-stations')
  }

  const accentColor: ColorProperty = '#4c81af'

  const baseButtonStyle: CSSProperties = {
    border: 'none',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '1em',
    margin: '4px 2px',
    borderRadius: '4px',
    fontWeight: 600,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: accentColor,
    width: '100%',
  }

  const secondaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    color: accentColor,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '2px',
  }

  const primaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: accentColor,
  }

  if (ticket == undefined) {
    return <div>No ticket</div>
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1em', margin: '12px', textAlign: 'center' }}>
          Confirm ticket
        </h1>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ paddingLeft: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: `url(${hslFerryImage})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}/>
              </td>
              <td style={{ width: '100%', paddingLeft: '12px' }}>{ticket.name}</td>
              <td style={{ padding: '12px' }} align="right">
                {ticket.amount}
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                align={'right'}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #ddd',
                  borderTop: '1px solid #ddd',
                }}
              >
                <span>To pay&nbsp;</span>
                <span style={{ fontSize: '1.4em' }}>{ticket.amount}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ margin: '12px', color: '#999' }}>
          {ticket.description}
        </div>

        <hr style={{ borderTop: '1px solid #ddd', borderBottom: 'none' }} />

        <form
          onSubmit={e => {
            e.preventDefault()
            handlePurchaseClick().then()
          }}
        >
          <table
            style={{
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
            }}
          >
            <tbody>
              <tr>
                <td style={{ paddingLeft: '12px', paddingRight: '6px' }}>
                  <button
                    style={secondaryButtonStyle}
                    onClick={(e) => {
                      e.preventDefault()
                      handleCancelClick().then()
                    }}
                  >
                    Cancel
                  </button>
                </td>
                <td style={{ paddingLeft: '6px', paddingRight: '12px' }}>
                  <button style={primaryButtonStyle}>Pay</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
      <BottomNavbar />
    </div>
  )
}

const parseTicket = (query: ParsedUrlQuery): TSPTicket | null => {
  const result = (query as unknown) as TSPTicket
  if (result.id === undefined) {
    return null
  }

  if (result.amount === undefined) {
    return null
  }
  return result
}

export default TicketPurchase

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
      ticket: parseTicket(context.query),
    },
  }
}
