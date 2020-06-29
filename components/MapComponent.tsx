import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import * as React from 'react'
import { NextPage } from 'next'
import { Station } from '../lib/types'
import L from 'leaflet'

const hslFerryImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMy4xNzc1NzI0NTc0NzI4NSIgaGVpZ2h0PSIzMy4xNzc1NzI0NTc0NzI4NSIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cgk8cGF0aCBmaWxsPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIGNsYXNzPSJwYXRoMSBmaWxsLWNvbG9yMTQiIGQ9Ik04NzAuMzk2IDk5My4yODdoLTcxNi44MTRjLTY3Ljg2NCAwLTEyMi44ODMtNTUuMDE1LTEyMi44ODMtMTIyLjg4M3YtNzE2LjgxMWMwLTY3Ljg2NCA1NS4wMTUtMTIyLjg4MyAxMjIuODgzLTEyMi44ODNoNzE2LjgxNGM2Ny44NjQgMCAxMjIuODgzIDU1LjAxNSAxMjIuODgzIDEyMi44ODN2NzE2LjgxMWMtMC4wMDQgNjcuODY4LTU1LjAxOCAxMjIuODgzLTEyMi44ODMgMTIyLjg4M3oiLz4KCTxwYXRoIGZpbGw9InJnYigwLCAxODUsIDIyOCkiIGNsYXNzPSJwYXRoMiBmaWxsLWNvbG9yMTEiIGQ9Ik0wLjAzNiAxMjYuNzk5YzAtNjkuMTE0IDU3LjU5NC0xMjYuNzA5IDEyNi43MDktMTI2LjcwOWg3NjcuOTMxYzcxLjY3NiAwIDEyOS4yNjYgNTcuNTk0IDEyOS4yNjYgMTI2LjcwOXY3NjcuOTMxYzAgNzEuNjcyLTU3LjU5MSAxMjkuMjctMTI5LjI2NiAxMjkuMjdoLTc2Ny45MzFjLTY5LjExNCAwLTEyNi43MDktNTcuNTk0LTEyNi43MDktMTI5LjI3di03NjcuOTMxek0xNTQuOTAxIDg2NS4yOTJjLTEyLjc5OSAwLTI0LjMxNiAxMC4yMzgtMjQuMzE2IDI0LjMxOSAwIDE0LjA3OCAxMS41MTcgMjQuMzE2IDI0LjMxNiAyNC4zMTZoNzE0LjE3N2MxNC4wNzggMCAyNS41OTgtMTAuMjM4IDI1LjU5OC0yNC4zMTZzLTExLjUxNy0yNC4zMTktMjUuNTk4LTI0LjMxOWgtNzE0LjE3N3pNODIwLjQ0MyA1ODIuNDRjMCAwLTEwMi4zOTMtMjYuODc3LTE3MS41MDctNDIuMjM0LTYwLjE1NS0xMi43OTktMTM0LjM4OS0yMS43NTgtMTM5LjUwOC0yMS43NThzLTc4LjA3MyA4Ljk1OS0xMzkuNTA4IDIxLjc1OGMtNjkuMTE0IDE1LjM1Ny0xNzEuNTA3IDQyLjIzNC0xNzEuNTA3IDQyLjIzNGwyOC4xNTkgMjQzLjE3OWg1NjYuOTlsMjYuODgxLTI0My4xNzl6TTM2OS45MiA0OTEuNTY4YzYxLjQzNC0xMi43OTkgMTM1LjY3MS0yMS43NTggMTM5LjUwOC0yMy4wMzcgMy44MzYgMS4yNzkgNzguMDczIDEwLjIzOCAxMzkuNTA4IDIzLjAzNyA0Ny4zNTMgMTAuMjM4IDc0LjIzMyAxNi42MzkgMTA4Ljc5MSAyNS41OTh2LTE3Ny45MDVjMC0yMy4wMzcgNi4zOTgtNTMuNzU0LTUzLjc1OC01My43NTRoLTExMS4zNDh2LTE2Ny42NjdjMC04Ljk1OS03LjY4LTE2LjYzOS0xNi42MzYtMTcuOTE4aC0xMzMuMTFjLTguOTU5IDEuMjc5LTE1LjM2IDguOTU5LTE2LjYzOSAxNy45MTh2MTY3LjY2M2gtMTExLjM0OGMtNjAuMTUyIDAtNTMuNzU4IDMwLjcxNy01My43NTggNTMuNzU0djE3Ny45MDVsMTA4Ljc5MS0yNS41OTV6TTQzMC4wNzkgMzc4LjkzN2MwIDI2Ljg3Ny0yMC40NzkgNDcuMzU2LTQ3LjM1NiA0Ny4zNTZzLTQ3LjM1My0yMC40NzktNDcuMzUzLTQ3LjM1NmMwLTI2Ljg3NyAyMC40NzYtNDcuMzU2IDQ3LjM1My00Ny4zNTZzNDcuMzU2IDIwLjQ3OSA0Ny4zNTYgNDcuMzU2ek01NTYuNzg4IDM3OC45MzdjMCAyNi44NzctMjAuNDc5IDQ3LjM1Ni00Ny4zNTYgNDcuMzU2LTI1LjU5OCAwLTQ3LjM1My0yMC40NzktNDcuMzUzLTQ3LjM1NnMyMS43NTQtNDcuMzU2IDQ3LjM1My00Ny4zNTZjMjYuODc3IDAgNDcuMzU2IDIwLjQ3OSA0Ny4zNTYgNDcuMzU2ek02ODMuNDkzIDM3OC45MzdjMCAyNi44NzctMjAuNDc2IDQ3LjM1Ni00Ny4zNTMgNDcuMzU2LTI1LjU5OCAwLTQ3LjM1Ni0yMC40NzktNDcuMzU2LTQ3LjM1NnMyMS43NTgtNDcuMzU2IDQ3LjM1Ni00Ny4zNTZjMjYuODc3IDAgNDcuMzUzIDIwLjQ3OSA0Ny4zNTMgNDcuMzU2eiIvPgo8L3N2Zz4='

interface props {
  accessToken: string
  height: string
  zIndex: number
  stations: Station[] | false
}

const ferryIcon = L.icon({
  iconUrl: hslFerryImage,
  iconRetinaUrl: hslFerryImage,
  iconSize: new L.Point(20, 20),
  className: 'leaflet-div-icon-borderless',
  popupAnchor: [0, -10],
})

const MapComponent: NextPage<props> = ({
  accessToken,
  height,
  zIndex,
  stations,
}) => {
  return (
    <div>
      <Map
        center={[60.167121, 24.955411]}
        zoom={13}
        style={{ height, position: 'relative', zIndex }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {stations &&
          stations.map(station => {
            const [lat, lon] = station.location.split(',')
            return (
              <Marker
                key={station.id}
                position={[Number(lat), Number(lon)]}
                icon={ferryIcon}
              >
                <Popup>
                  {station.name}
                  <br />
                  <img src="/images/jt-logo.jpg" alt="jt-logo" width={'50px'} />
                </Popup>
              </Marker>
            )
          })}
      </Map>
    </div>
  )
}

export default MapComponent
