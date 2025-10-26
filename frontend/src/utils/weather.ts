export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
  timestamp: number;
}

// Mock weather data for demo (in production, this would call a real API like OpenWeatherMap)
export async function fetchWeatherByLocation(location: string): Promise<WeatherData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock weather data based on location
  const mockWeather: Record<string, WeatherData> = {
    'new york': {
      temperature: 18,
      condition: 'cloudy',
      description: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      location: 'New York',
      icon: '☁️',
      timestamp: Date.now(),
    },
    'london': {
      temperature: 12,
      condition: 'rainy',
      description: 'Light Rain',
      humidity: 80,
      windSpeed: 15,
      location: 'London',
      icon: '🌧️',
      timestamp: Date.now(),
    },
    'paris': {
      temperature: 16,
      condition: 'clear',
      description: 'Clear Sky',
      humidity: 55,
      windSpeed: 8,
      location: 'Paris',
      icon: '☀️',
      timestamp: Date.now(),
    },
    'tokyo': {
      temperature: 22,
      condition: 'clear',
      description: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      location: 'Tokyo',
      icon: '☀️',
      timestamp: Date.now(),
    },
    'mumbai': {
      temperature: 28,
      condition: 'clear',
      description: 'Hot and Sunny',
      humidity: 70,
      windSpeed: 5,
      location: 'Mumbai',
      icon: '☀️',
      timestamp: Date.now(),
    },
  };

  const key = location.toLowerCase();
  if (mockWeather[key]) {
    return mockWeather[key];
  }

  // Default weather for unknown locations
  return {
    temperature: 20,
    condition: 'clear',
    description: 'Pleasant Weather',
    humidity: 60,
    windSpeed: 10,
    location: location,
    icon: '🌤️',
    timestamp: Date.now(),
  };
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock response based on coordinates
  return {
    temperature: 20,
    condition: 'clear',
    description: 'Pleasant Weather',
    humidity: 60,
    windSpeed: 10,
    location: 'Your Location',
    icon: '🌤️',
    timestamp: Date.now(),
  };
}

export function getWeatherRecommendation(weather: WeatherData): {
  outerwear: boolean;
  lightClothes: boolean;
  rainGear: boolean;
  layers: boolean;
} {
  return {
    outerwear: weather.temperature < 15,
    lightClothes: weather.temperature > 25,
    rainGear: weather.condition === 'rainy',
    layers: weather.temperature >= 15 && weather.temperature <= 25,
  };
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32);
}
