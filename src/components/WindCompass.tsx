'use client'

import { WeatherData } from '@/types/airport'

interface WindCompassProps {
  weatherData: WeatherData | null
  className?: string
}

const WindCompass: React.FC<WindCompassProps> = ({ weatherData, className = '' }) => {
  const windDirection = weatherData?.windDirection?.[0]
  const windSpeed = weatherData?.wind?.[0]

  const getDirectionText = (direction: number) => {
    const directions = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']
    return directions[Math.round(direction / 22.5) % 16]
  }

  const getArrowRotation = (direction: number) => {
    // Convert meteorological direction to compass direction
    return direction + 180
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">風向・風速</h3>
      
      <div className="flex flex-col items-center">
        {/* Wind compass */}
        <div className="relative w-48 h-48 border-2 border-gray-300 rounded-full mb-4">
          {/* Compass directions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full relative">
              {/* N */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 font-semibold text-gray-700">N</div>
              {/* E */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 font-semibold text-gray-700">E</div>
              {/* S */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-semibold text-gray-700">S</div>
              {/* W */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 font-semibold text-gray-700">W</div>
            </div>
          </div>
          
          {/* Wind arrow */}
          {windDirection !== undefined && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-1 h-16 bg-red-500 origin-bottom transform transition-transform duration-300"
                style={{
                  transform: `rotate(${getArrowRotation(windDirection)}deg)`,
                }}
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 transform rotate-45"></div>
              </div>
            </div>
          )}
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Wind data */}
        <div className="text-center space-y-2">
          {windDirection !== undefined && windSpeed !== undefined ? (
            <>
              <div className="text-xl font-bold text-gray-800">
                {getDirectionText(windDirection)} {windDirection}°
              </div>
              <div className="text-lg text-gray-600">
                風速: {windSpeed} m/s
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              風データがありません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WindCompass