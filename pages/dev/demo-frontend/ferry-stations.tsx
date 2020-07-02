import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import * as React from 'react'
import NextError from 'next/error'
import Router from 'next/router'
import axios from 'axios'
import moment from 'moment-timezone'
import { Station } from 'lib/types'
import BottomNavbar from '../../../components/BottomNavbar'
import hslFerryImage from '../../../lib/hsl-ferry-image'

const Map = dynamic(() => import('../../../components/MapComponent'), {
  ssr: false,
})

interface props {
  DEV_API_KEY: string
  ALLOW_DEMO_FRONTEND: string
  MAPBOX_ACCESS_KEY: string
}

interface TicketOption {
  amount: string
  logoId: string
  currency: string
  description: string
  id: string
  name: string
}

const FerryStations: NextPage<props> = ({
  DEV_API_KEY,
  ALLOW_DEMO_FRONTEND,
  MAPBOX_ACCESS_KEY,
}) => {
  const [maasTickets, setMaasTickets] = React.useState<TicketOption[]>([])
  const [stations, setStations] = React.useState<Station[]>([])

  if (ALLOW_DEMO_FRONTEND !== 'allow') {
    return <NextError statusCode={404} />
  }
  React.useEffect(() => {
    const getTickets = async () => {
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

    const getStations = async () => {
      const response = await axios.get(
        `/api/jtline/stations?location=60.17699706032358,24.948799833655357&radius=15000`,
        {
          headers: {
            'x-api-key': DEV_API_KEY,
          },
        },
      )
      setStations(response.data)
    }
    void getStations()
    void getTickets()
  }, [])
  const ticketOptions = maasTickets.map(ticket => (
    <li
      key={ticket.id}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
        paddingBottom: '12px',
        paddingLeft: '12px',
      }}
      onClickCapture={() => {
        void Router.push({
          pathname: '/dev/demo-frontend/ticket-purchase',
          query: { ...ticket },
        }).then()
      }}
    >
      <div style={{ paddingRight: '12px', height: '100%' }}>
        <div
          style={{
            background: `url(/images/${ticket.logoId})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '100%',
          }}
        />
      </div>
      <div>
        <h3>{ticket.name}</h3>
        <div>{ticket.description}</div>
      </div>
      <div style={{ margin: '12px', color: 'darkblue', fontWeight: 'bold' }}>
        {ticket.amount}
      </div>
    </li>
  ))

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <div className="topAndBot">
<<<<<<< HEAD
          <div className="top" style={{ background: 'purple', height:"50vh" }}>
=======
          <div className="top" style={{ background: 'purple', height: '58vh' }}>
>>>>>>> b34f9a8... Use Postgres currency for ticket option amount
            <Map
              accessToken={MAPBOX_ACCESS_KEY}
              height={'50vh'}
              zIndex={1}
              stations={stations}
            />
          </div>

<<<<<<< HEAD
          <div className="bottom" style={{ height: '40vh'}}>
=======
          <div className="bottom" style={{ height: '32vh' }}>
>>>>>>> b34f9a8... Use Postgres currency for ticket option amount
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                background: 'darkblue',
                color: 'white',
                paddingLeft: '12px',
              }}
            >
              <div style={{ paddingRight: '12px' }}>
                <div
                  style={{
                    height: '100%',
                    background: `url(${hslFerryImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: '2fr 1fr',
                }}
              >
                <h2>Ferry Tickets</h2>
                <div>Helsinki archipelago</div>
              </div>
            </div>

            <div style={{}}>
              <ul style={{ padding: '0', margin: '0' }}>{ticketOptions}</ul>
            </div>
          </div>
        </div>

        <BottomNavbar />
      </div>
    </div>
  )
}

export default FerryStations

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      DEV_API_KEY: process.env.DEV_API_KEY,
      ALLOW_DEMO_FRONTEND: process.env.ALLOW_DEMO_FRONTEND,
      MAPBOX_ACCESS_KEY: process.env.MAPBOX_ACCESS_KEY,
    },
  }
}
