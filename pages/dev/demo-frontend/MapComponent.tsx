import { Map, TileLayer } from 'react-leaflet'
import * as React from 'react'
import { NextPage } from 'next'

const MapComponent: NextPage<{ accessToken: string }> = ({ accessToken }) => {
  const position = [60.167121, 24.955411]
  return (
    <div>
      <Map center={position} zoom={13} style={{ height: '80vh' }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    </div>
  )
}

export default MapComponent
