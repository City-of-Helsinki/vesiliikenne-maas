import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import * as React from 'react'
import { NextPage } from 'next'
import { Station } from '../lib/types'
import L from 'leaflet'
import hslFerryImage from '../lib/hsl-ferry-image'

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
        center={[60.154020, 24.978618]}
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
