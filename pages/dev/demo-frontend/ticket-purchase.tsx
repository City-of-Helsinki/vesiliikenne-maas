import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import Router from 'next/router'
import { TSPTicket } from '../../../lib/types'
import { formatPrice } from '../../../lib/currency'
import { CSSProperties } from 'react'
import { ColorProperty } from 'csstype';
import { ParsedUrlQuery } from 'querystring'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string,
  ticket: TSPTicket | null,
}


const TicketPurchase: NextPage<props> = ( { DEV_API_KEY, NODE_ENV, ticket }) => {
  if (NODE_ENV !== 'development') {
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
        ticketTypeId: 'Day',
      }),
    })
    await response.json()
    await Router.push('/dev/demo-frontend/ticket-list')
  }

  const handleCancelClick =  async () => {
    await Router.push('/dev/demo-frontend/ferry-stations')
  }

  const o: CSSProperties = {
    fontFamily: "'Roboto', sans-serif",
  }

  const accentColor: ColorProperty = "#4c81af"

  const buttonItemStyle: CSSProperties = {
    display: "inline",
    //float: "left",
  }

  const baseButtonStyle: CSSProperties = {
    border: "none",
    color: "white",
    padding: "10px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "1em",
    margin: "4px 2px",
    borderRadius: "4px",
    fontWeight: 600,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: accentColor,
  }

  const secondaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    color: accentColor,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "2px",
  }

  const primaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: accentColor,
  }

  if (ticket == undefined) {
    return (<div>No ticket</div>)
  }

  return (
    <div style={o}>
      <h1 style={{fontSize: "1em"}}>Confirm ticket</h1>
      <table>
        <tbody>
        <tr>
          <td>{ticket.name}</td>
          <td align="right">{formatPrice(ticket.amount, ticket.currency)}</td>
        </tr>
        <tr>
          <td colSpan={2} align={"right"}>
            <span>To pay&nbsp;</span>
            <span style={{fontSize: "1.4em"}}>{formatPrice(ticket.amount, ticket.currency)}</span>
          </td>
        </tr>
        </tbody>
      </table>

      <form onSubmit={ (e) => { e.preventDefault(); handlePurchaseClick().then() }}>
        <ul style={{listStyleType: "none", paddingLeft: 0}}>
          <li style={buttonItemStyle}>
            <button style={secondaryButtonStyle} onClickCapture={ () => { handleCancelClick().then() }}>Cancel</button>
          </li>
          <li style={buttonItemStyle}>
            <button style={primaryButtonStyle}>Confirm purchase</button>
          </li>
        </ul>
      </form>
    </div>
  )
}

const parseTicket = (query: ParsedUrlQuery): TSPTicket | null => {
  const result = query as unknown as TSPTicket
  if (result.id === undefined) {
    return null
  }
  if (result.currency === undefined) {
    return null
  }
  if (result.amount === undefined) {
    return null
  }
  return result
}

export default TicketPurchase

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
      ticket: parseTicket(context.query),
    },
  }
}
