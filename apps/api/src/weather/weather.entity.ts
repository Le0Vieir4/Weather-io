import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
} from 'typeorm';

export class CurrentWeather {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  isDay: boolean;
  uv: number;
}

export class DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  uvIndexMax: number;
  rainProbability: number;
}

@Entity('weather_logs')
export class WeatherLog {
  @ObjectIdColumn()
  _id: ObjectId;

  get id(): string {
    return this._id ? this._id.toHexString() : '';
  }

  @Column()
  time: string;

  @Column()
  city: string;

  @Column()
  current: CurrentWeather[];

  @Column()
  daily: DailyWeather[];

  @Column({ nullable: true })
  aiInsight?: string;

  @CreateDateColumn()
  createdAt: Date;
}
