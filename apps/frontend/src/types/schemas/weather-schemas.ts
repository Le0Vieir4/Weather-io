export interface CurrentWeather {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  isDay: boolean;
  uv: number;
  weatherCode?: string;
}

export interface DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  uvIndexMax: number;
  precipitationProbability: number;
  weatherCode?: string;
}

export interface WeatherData {
  time: string;
  city: string;
  current: CurrentWeather[];
  daily: DailyWeather[];
  aiInsight: string;
}

export interface WeatherLog extends WeatherData {
  _id: string;
  createdAt: string;
}