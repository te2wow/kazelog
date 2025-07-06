'use client'

import { useEffect, useState } from 'react'
import { Airport } from '@/types/airport'
import airportsData from '@/data/airports.json'

interface MapComponentProps {
  selectedAirport: Airport | null
  onAirportSelect: (airport: Airport) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedAirport, onAirportSelect }) => {
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const airports = airportsData as Airport[]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default
        
        // Fix for default markers not showing in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // Create map container
        const mapContainer = document.getElementById('map-container')
        if (!mapContainer) return

        // Remove any existing map
        mapContainer.innerHTML = ''

        // Create new map
        const map = L.map(mapContainer).setView([36.2048, 138.2529], 5)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Add airport markers
        airports.forEach((airport) => {
          const marker = L.marker([airport.latitude, airport.longitude])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${airport.name}</h3>
                <p class="text-sm text-gray-600">${airport.nameEn}</p>
                <p class="text-sm">
                  <span class="font-semibold">IATA:</span> ${airport.iataCode} | 
                  <span class="font-semibold">ICAO:</span> ${airport.icaoCode}
                </p>
              </div>
            `)
            .on('click', () => {
              onAirportSelect(airport)
            })
        })

        setMapInstance(map)

      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [isClient, onAirportSelect])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">地図を読み込み中...</span>
      </div>
    )
  }

  return (
    <div 
      id="map-container"
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  )
}

export default MapComponent