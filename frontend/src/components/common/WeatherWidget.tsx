import React, { useState } from 'react';
import { WeatherData, fetchWeatherByLocation, celsiusToFahrenheit } from '../../utils/weather';
import { useProfile } from '../../context/ProfileContext';
import Button from '../common/Button';

interface WeatherWidgetProps {
  onWeatherUpdate?: (weather: WeatherData) => void;
}

export default function WeatherWidget({ onWeatherUpdate }: WeatherWidgetProps) {
  const { preferences, profile } = useProfile();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState(profile?.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchWeather = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByLocation(location);
      if (data) {
        setWeather(data);
        onWeatherUpdate?.(data);
      } else {
        setError('Could not fetch weather data');
      }
    } catch (err) {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const temperature = weather
    ? preferences.measurementUnit === 'imperial'
      ? celsiusToFahrenheit(weather.temperature)
      : weather.temperature
    : null;

  const unit = preferences.measurementUnit === 'imperial' ? '°F' : '°C';

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      <h3 className="font-display text-xl font-semibold text-brand-900 mb-4">
        Weather Info
      </h3>

      {/* Location Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1 px-4 py-2 border-2 border-brand-200 rounded-lg focus:border-brand-500 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleFetchWeather()}
        />
        <Button onClick={handleFetchWeather} disabled={loading} variant="primary">
          {loading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            'Get Weather'
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Weather Display */}
      {weather && (
        <div className="bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-brand-700 mb-1">
                📍 {weather.location}
              </div>
              <div className="text-4xl font-bold text-brand-900">
                {temperature}{unit}
              </div>
            </div>
            <div className="text-5xl">{weather.icon}</div>
          </div>

          <div className="text-lg font-medium text-brand-900 mb-3">
            {weather.description}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-brand-700">
              <span>💧</span>
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-brand-700">
              <span>💨</span>
              <span>Wind: {weather.windSpeed} km/h</span>
            </div>
          </div>

          {/* Weather-based Tips */}
          <div className="mt-4 pt-4 border-t border-brand-300">
            <div className="text-xs font-medium text-brand-700 mb-2">
              Outfit Suggestions:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {weather.temperature < 15 && (
                <span className="px-2 py-1 bg-white/80 rounded-full text-brand-900">
                  🧥 Bring a jacket
                </span>
              )}
              {weather.temperature > 25 && (
                <span className="px-2 py-1 bg-white/80 rounded-full text-brand-900">
                  👕 Light clothes
                </span>
              )}
              {weather.condition === 'rainy' && (
                <span className="px-2 py-1 bg-white/80 rounded-full text-brand-900">
                  ☔ Rain gear
                </span>
              )}
              {weather.temperature >= 15 && weather.temperature <= 25 && (
                <span className="px-2 py-1 bg-white/80 rounded-full text-brand-900">
                  🎽 Layer your outfit
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
