import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'common/utils/ZodValidationPipe';
import {
  WeatherSchema,
  type Weather,
} from 'types/schemas/WeatherSchemas/weather.schema';

@Controller('weather')
export class WeatherController {
  private logs: Weather[] = [];

  @Post('logs')
  async receiveWeatherLogs(
    @Body(new ZodValidationPipe(WeatherSchema)) body: Weather,
  ) {
    this.logs.push(body);
    console.log('Payload recebido: ', body);
    return { ok: true };
  }

  @Get('logs')
  getLogs(): Weather[] {
    return this.logs;
  }
}
