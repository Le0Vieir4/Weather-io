import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './weather.entity';

@Injectable()
export class WeatherService {
  private latestWeather: CreateWeatherDto | null = null;
  private lastAiInsight: string | null = null; // Store the last valid AI insight
  private readonly MAX_LOGS = 10; // Maximum log limit

  constructor(
    @InjectRepository(WeatherLog)
    private readonly weatherLogRepository: Repository<WeatherLog>,
  ) {}

  async receiveWeatherData(
    weatherData: CreateWeatherDto,
  ): Promise<CreateWeatherDto> {
    // If a new insight came, update the last valid insight
    if (weatherData.aiInsight) {
      this.lastAiInsight = weatherData.aiInsight;
    }

    // If no insight came but we have a stored one, use the last valid
    if (!weatherData.aiInsight && this.lastAiInsight) {
      weatherData.aiInsight = this.lastAiInsight;
    }

    // Save the new log (now with the preserved insight)
    const log = this.weatherLogRepository.create(weatherData);
    await this.weatherLogRepository.save(log);
    this.latestWeather = weatherData;

    await this.enforceLogLimit();

    return weatherData;
  }

  getLatestWeather(): CreateWeatherDto | null {
    return this.latestWeather;
  }

  async getAllLogs(limit: number = 100): Promise<WeatherLog[]> {
    return this.weatherLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getLogsByCity(city: string, limit: number = 50): Promise<WeatherLog[]> {
    const allLogs = await this.weatherLogRepository.find({
      order: { createdAt: 'DESC' },
    });

    const filtered = allLogs.filter((log: WeatherLog) =>
      log.city.toLowerCase().includes(city.toLowerCase()),
    );

    return filtered.slice(0, limit);
  }

  async deleteOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldLogs = await this.weatherLogRepository.find();
    const filtered = oldLogs.filter(
      (log: WeatherLog) => log.createdAt < cutoffDate,
    );

    if (filtered.length === 0) {
      return 0;
    }

    await this.weatherLogRepository.remove(filtered);
    return filtered.length;
  }

  async getLogCount(): Promise<number> {
    return this.weatherLogRepository.count();
  }

  async getOldestLog(): Promise<WeatherLog | null> {
    const logs = await this.weatherLogRepository.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    return logs.length > 0 ? logs[0] : null;
  }

  async getNewestLog(): Promise<WeatherLog | null> {
    const logs = await this.weatherLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return logs.length > 0 ? logs[0] : null;
  }

  private async enforceLogLimit(): Promise<void> {
    const totalLogs = await this.weatherLogRepository.count();

    if (totalLogs > this.MAX_LOGS) {
      const logsToDelete = totalLogs - this.MAX_LOGS;

      // Buscar os logs mais antigos
      const oldestLogs = await this.weatherLogRepository.find({
        order: { createdAt: 'ASC' },
        take: logsToDelete,
      });

      // Remove oldest logs
      if (oldestLogs.length > 0) {
        await this.weatherLogRepository.remove(oldestLogs);
        console.log(
          `Removed ${oldestLogs.length} old weather logs to maintain limit of ${this.MAX_LOGS}`,
        );
      }
    }
  }
}
