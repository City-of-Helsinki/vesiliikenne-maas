import { GetServerSideProps, NextPage } from 'next'
import * as React from 'react'
import NextError from 'next/error'
import axios from 'axios'
import moment from 'moment-timezone'

interface props {
  DEV_API_KEY: string
  NODE_ENV: string
}

interface TicketOption {
  amount: string
  logoId: string
  currency: string
  description: string
  id: string
  name: string
}

const hslFerryImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMy4xNzc1NzI0NTc0NzI4NSIgaGVpZ2h0PSIzMy4xNzc1NzI0NTc0NzI4NSIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cgk8cGF0aCBmaWxsPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIGNsYXNzPSJwYXRoMSBmaWxsLWNvbG9yMTQiIGQ9Ik04NzAuMzk2IDk5My4yODdoLTcxNi44MTRjLTY3Ljg2NCAwLTEyMi44ODMtNTUuMDE1LTEyMi44ODMtMTIyLjg4M3YtNzE2LjgxMWMwLTY3Ljg2NCA1NS4wMTUtMTIyLjg4MyAxMjIuODgzLTEyMi44ODNoNzE2LjgxNGM2Ny44NjQgMCAxMjIuODgzIDU1LjAxNSAxMjIuODgzIDEyMi44ODN2NzE2LjgxMWMtMC4wMDQgNjcuODY4LTU1LjAxOCAxMjIuODgzLTEyMi44ODMgMTIyLjg4M3oiLz4KCTxwYXRoIGZpbGw9InJnYigwLCAxODUsIDIyOCkiIGNsYXNzPSJwYXRoMiBmaWxsLWNvbG9yMTEiIGQ9Ik0wLjAzNiAxMjYuNzk5YzAtNjkuMTE0IDU3LjU5NC0xMjYuNzA5IDEyNi43MDktMTI2LjcwOWg3NjcuOTMxYzcxLjY3NiAwIDEyOS4yNjYgNTcuNTk0IDEyOS4yNjYgMTI2LjcwOXY3NjcuOTMxYzAgNzEuNjcyLTU3LjU5MSAxMjkuMjctMTI5LjI2NiAxMjkuMjdoLTc2Ny45MzFjLTY5LjExNCAwLTEyNi43MDktNTcuNTk0LTEyNi43MDktMTI5LjI3di03NjcuOTMxek0xNTQuOTAxIDg2NS4yOTJjLTEyLjc5OSAwLTI0LjMxNiAxMC4yMzgtMjQuMzE2IDI0LjMxOSAwIDE0LjA3OCAxMS41MTcgMjQuMzE2IDI0LjMxNiAyNC4zMTZoNzE0LjE3N2MxNC4wNzggMCAyNS41OTgtMTAuMjM4IDI1LjU5OC0yNC4zMTZzLTExLjUxNy0yNC4zMTktMjUuNTk4LTI0LjMxOWgtNzE0LjE3N3pNODIwLjQ0MyA1ODIuNDRjMCAwLTEwMi4zOTMtMjYuODc3LTE3MS41MDctNDIuMjM0LTYwLjE1NS0xMi43OTktMTM0LjM4OS0yMS43NTgtMTM5LjUwOC0yMS43NThzLTc4LjA3MyA4Ljk1OS0xMzkuNTA4IDIxLjc1OGMtNjkuMTE0IDE1LjM1Ny0xNzEuNTA3IDQyLjIzNC0xNzEuNTA3IDQyLjIzNGwyOC4xNTkgMjQzLjE3OWg1NjYuOTlsMjYuODgxLTI0My4xNzl6TTM2OS45MiA0OTEuNTY4YzYxLjQzNC0xMi43OTkgMTM1LjY3MS0yMS43NTggMTM5LjUwOC0yMy4wMzcgMy44MzYgMS4yNzkgNzguMDczIDEwLjIzOCAxMzkuNTA4IDIzLjAzNyA0Ny4zNTMgMTAuMjM4IDc0LjIzMyAxNi42MzkgMTA4Ljc5MSAyNS41OTh2LTE3Ny45MDVjMC0yMy4wMzcgNi4zOTgtNTMuNzU0LTUzLjc1OC01My43NTRoLTExMS4zNDh2LTE2Ny42NjdjMC04Ljk1OS03LjY4LTE2LjYzOS0xNi42MzYtMTcuOTE4aC0xMzMuMTFjLTguOTU5IDEuMjc5LTE1LjM2IDguOTU5LTE2LjYzOSAxNy45MTh2MTY3LjY2M2gtMTExLjM0OGMtNjAuMTUyIDAtNTMuNzU4IDMwLjcxNy01My43NTggNTMuNzU0djE3Ny45MDVsMTA4Ljc5MS0yNS41OTV6TTQzMC4wNzkgMzc4LjkzN2MwIDI2Ljg3Ny0yMC40NzkgNDcuMzU2LTQ3LjM1NiA0Ny4zNTZzLTQ3LjM1My0yMC40NzktNDcuMzUzLTQ3LjM1NmMwLTI2Ljg3NyAyMC40NzYtNDcuMzU2IDQ3LjM1My00Ny4zNTZzNDcuMzU2IDIwLjQ3OSA0Ny4zNTYgNDcuMzU2ek01NTYuNzg4IDM3OC45MzdjMCAyNi44NzctMjAuNDc5IDQ3LjM1Ni00Ny4zNTYgNDcuMzU2LTI1LjU5OCAwLTQ3LjM1My0yMC40NzktNDcuMzUzLTQ3LjM1NnMyMS43NTQtNDcuMzU2IDQ3LjM1My00Ny4zNTZjMjYuODc3IDAgNDcuMzU2IDIwLjQ3OSA0Ny4zNTYgNDcuMzU2ek02ODMuNDkzIDM3OC45MzdjMCAyNi44NzctMjAuNDc2IDQ3LjM1Ni00Ny4zNTMgNDcuMzU2LTI1LjU5OCAwLTQ3LjM1Ni0yMC40NzktNDcuMzU2LTQ3LjM1NnMyMS43NTgtNDcuMzU2IDQ3LjM1Ni00Ny4zNTZjMjYuODc3IDAgNDcuMzUzIDIwLjQ3OSA0Ny4zNTMgNDcuMzU2eiIvPgo8L3N2Zz4='

const FerryStations: NextPage<props> = ({ DEV_API_KEY, NODE_ENV }) => {
  const [maasTickets, setMaasTickets] = React.useState<TicketOption[]>([])

  if (NODE_ENV !== 'development') {
    return <NextError statusCode={404}/>
  }

  React.useEffect(() => {
    async function getTickets() {
      const currentTimeMS = moment().tz('Europe/Helsinki').valueOf()
      const response = await axios.get(
        `/api/maas/tickets?startTime=${currentTimeMS}`,
        {
          headers: {
            'x-api-key': DEV_API_KEY,
          },
        },
      )

      setMaasTickets(response.data)
    }

    getTickets()
  }, [])

  const ticketOptions = maasTickets.map(ticket => (
    <li style={{
      boxSizing: 'border-box',

      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      alignItems: 'center',
      border: '1px solid darkgrey',
    }}>
      <div style={{ padding: '12px', height: '100%' }}>
        <div style={{
          background: `url(/images/${ticket.logoId})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100%',
        }}/>
      </div>
      <div>
        <h3>{ticket.name}</h3>
        <div>{ticket.description}</div>
      </div>
      <div style={{ margin: '12px', color: 'darkblue', fontWeight: 'bold' }}>
        {ticket.amount}{(ticket.currency === 'EUR') ? '€' : ticket.currency}
      </div>
    </li>
  ))

  return (
    <div style={{
      height: '95vh',
      display: 'grid',
      gridTemplateRows: '3fr 2fr',
    }}>
      <div className="top"
           style={{ background: 'purple' }}>Map here
      </div>
      <div className="bottom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          background: 'darkblue',
          color: 'white',
        }}>
          <div style={{ padding: '12px' }}>
            <div style={{
              height: '100%',
              background: `url(${hslFerryImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}/>
          </div>
          <div style={{

            display: 'grid',
            gridTemplateRows: '2fr 1fr',
          }}>
            <h2>Ferry Tickets</h2>
            <div>Helsinki archipelago</div>
          </div>
        </div>

        <div style={{}}>
          <ul style={{ padding: '0', margin: '0' }}>
            {ticketOptions}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FerryStations

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    },
  }
}
