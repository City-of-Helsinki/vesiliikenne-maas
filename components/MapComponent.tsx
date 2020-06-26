import { Map, TileLayer } from 'react-leaflet'
import * as React from 'react'
import { NextPage } from 'next'

const MapComponent: NextPage<{ accessToken: string }> = ({ accessToken }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Map center={[60.167121, 24.955411]} zoom={13} style={{ height: '97vh' }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    </div>
  )
}

export default MapComponent
