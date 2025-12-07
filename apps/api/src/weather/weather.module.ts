import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherLog } from './weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherLog])],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService, TypeOrmModule],
})
export class WeatherModule {}
