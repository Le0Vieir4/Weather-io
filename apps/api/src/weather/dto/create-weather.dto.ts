import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CurrentWeatherDto {
  @IsString()
  time: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  relativeHumidity: number;

  @IsNumber()
  apparentTemperature: number;

  @IsBoolean()
  isDay: boolean;

  @IsNumber()
  uv: number;
}

export class DailyWeatherDto {
  @IsString()
  date: string;

  @IsNumber()
  temperatureMax: number;

  @IsNumber()
  temperatureMin: number;

  @IsNumber()
  apparentTemperatureMax: number;

  @IsNumber()
  apparentTemperatureMin: number;

  @IsNumber()
  uvIndexMax: number;

  @IsNumber()
  rainProbability: number;
}

export class CreateWeatherDto {
  @IsString()
  time: string;

  @IsString()
  city: string;

  @IsArray()
  current: CurrentWeatherDto[];

  @IsArray()
  daily: DailyWeatherDto[];

  @IsOptional()
  @IsString()
  aiInsight?: string;
}
