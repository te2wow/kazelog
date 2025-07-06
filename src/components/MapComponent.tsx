'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Airport } from '@/types/airport'
import airportsData from '@/data/airports.json'
import L from 'leaflet'

// Fix for default markers not showing in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  selectedAirport: Airport | null
  onAirportSelect: (airport: Airport) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedAirport, onAirportSelect }) => {
  const [isMounted, setIsMounted] = useState(false)
  const airports = airportsData as Airport[]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
  }

  return (
    <MapContainer
      center={[36.2048, 138.2529]} // Japan center
      zoom={5}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {airports.map((airport) => (
        <Marker
          key={airport.id}
          position={[airport.latitude, airport.longitude]}
          eventHandlers={{
            click: () => onAirportSelect(airport),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{airport.name}</h3>
              <p className="text-sm text-gray-600">{airport.nameEn}</p>
              <p className="text-sm">
                <span className="font-semibold">IATA:</span> {airport.iataCode} | 
                <span className="font-semibold"> ICAO:</span> {airport.icaoCode}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent