import React, { useState } from 'react';
import { OCCASIONS, MOODS, Mood } from '../../types/outfit';
import Button from '../common/Button';
import WeatherWidget from '../common/WeatherWidget';
import { WeatherData } from '../../utils/weather';

interface OutfitGeneratorPanelProps {
  onGenerate: (params: {
    occasion: string;
    mood?: Mood;
    weather?: { temp: number; condition: string };
  }) => void;
  isGenerating: boolean;
}

export default function OutfitGeneratorPanel({ onGenerate, isGenerating }: OutfitGeneratorPanelProps) {
  const [selectedOccasion, setSelectedOccasion] = useState('casual');
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
  const [useWeather, setUseWeather] = useState(false);
  const [temperature, setTemperature] = useState(20);
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleWeatherUpdate = (weather: WeatherData) => {
    setWeatherData(weather);
    setTemperature(weather.temperature);
    setWeatherCondition(weather.condition);
    setUseWeather(true);
  };

  const handleGenerate = () => {
    onGenerate({
      occasion: selectedOccasion,
      mood: selectedMood,
      weather: useWeather ? { temp: temperature, condition: weatherCondition } : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Occasion Selector */}
      <div>
        <label className="block text-sm font-medium text-brand-800 mb-3">
          Select Occasion
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion.value}
              onClick={() => setSelectedOccasion(occasion.value)}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${
                  selectedOccasion === occasion.value
                    ? 'border-brand-900 bg-brand-900 text-white shadow-md scale-[1.02]'
                    : 'border-brand-200 hover:border-brand-400 bg-white'
                }
              `}
            >
              <div className="text-2xl mb-1">{occasion.icon}</div>
              <div className="text-sm font-medium">{occasion.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="block text-sm font-medium text-brand-800 mb-3">
          Choose Mood <span className="text-brand-400">(Optional)</span>
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(selectedMood === mood.value ? undefined : mood.value)}
              className={`
                p-3 rounded-xl border-2 transition-all
                ${
                  selectedMood === mood.value
                    ? 'border-brand-900 bg-brand-50 shadow-sm scale-[1.05]'
                    : 'border-brand-200 hover:border-brand-400 bg-white'
                }
              `}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium text-brand-900">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Weather Consideration */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-800 mb-3">
          <input
            type="checkbox"
            checked={useWeather}
            onChange={(e) => setUseWeather(e.target.checked)}
            className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-brand-500"
          />
          Consider Weather
        </label>

        {useWeather && (
          <div className="space-y-4">
            {/* Weather Widget */}
            <WeatherWidget onWeatherUpdate={handleWeatherUpdate} />

            {/* Manual Weather Input */}
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-200">
              <div className="text-sm font-medium text-brand-700 mb-3">
                Or enter manually:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-brand-200 rounded-lg focus:border-brand-500 focus:outline-none"
                    min="-20"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-brand-200 rounded-lg focus:border-brand-500 focus:outline-none bg-white"
                  >
                    <option value="clear">☀️ Clear</option>
                    <option value="cloudy">☁️ Cloudy</option>
                    <option value="rainy">🌧️ Rainy</option>
                    <option value="snowy">❄️ Snowy</option>
                    <option value="windy">💨 Windy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        variant="primary"
        className="w-full text-lg py-3"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
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
            Generating Outfits...
          </span>
        ) : (
          '✨ Generate Outfit Suggestions'
        )}
      </Button>
    </div>
  );
}
