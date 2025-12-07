import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './weather.entity';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async receiveWeatherData(
    @Body() createWeatherDto: CreateWeatherDto,
  ): Promise<CreateWeatherDto> {
    return this.weatherService.receiveWeatherData(createWeatherDto);
  }

  @Get()
  getLatestWeather(): CreateWeatherDto | null {
    const data = this.weatherService.getLatestWeather();
    return data;
  }

  @Get('insight')
  getAIInsight(): { aiInsight: string | null } {
    try {
      const latestWeather = this.weatherService.getLatestWeather();

      if (!latestWeather) {
        throw new HttpException(
          'No weather data available',
          HttpStatus.NOT_FOUND,
        );
      }

      // Return the AI insight that was sent via RabbitMQ
      return {
        aiInsight: latestWeather.aiInsight || null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error getting AI insight: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('logs')
  async getLogs(
    @Query('city') city?: string,
    @Query('limit') limit?: string,
  ): Promise<WeatherLog[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;

    if (city) {
      return this.weatherService.getLogsByCity(city, limitNum);
    }

    return this.weatherService.getAllLogs(limitNum);
  }

  @Get('export/latest')
  getLatestExport() {
    try {
      const exportsDir = '/app/exports';

      if (!fs.existsSync(exportsDir)) {
        throw new HttpException(
          'Exports directory not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const files = fs
        .readdirSync(exportsDir)
        .filter((f) => f.startsWith('weather_export_') && f.endsWith('.csv'))
        .map((f) => ({
          name: f,
          path: path.join(exportsDir, f),
          created: fs.statSync(path.join(exportsDir, f)).birthtime,
        }))
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      if (files.length === 0) {
        throw new HttpException('No export files found', HttpStatus.NOT_FOUND);
      }

      const latestFile = files[0];

      return {
        filename: latestFile.name,
        created: latestFile.created,
        size: fs.statSync(latestFile.path).size,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Error getting latest export: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/download')
  downloadLatestCSV(@Res() res: Response) {
    try {
      const exportsDir = '/app/exports';

      if (!fs.existsSync(exportsDir)) {
        throw new HttpException(
          'Exports directory not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const files = fs
        .readdirSync(exportsDir)
        .filter((f) => f.startsWith('weather_export_') && f.endsWith('.csv'))
        .map((f) => ({
          name: f,
          path: path.join(exportsDir, f),
          created: fs.statSync(path.join(exportsDir, f)).birthtime,
        }))
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      if (files.length === 0) {
        throw new HttpException('No export files found', HttpStatus.NOT_FOUND);
      }

      const latestFile = files[0];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${latestFile.name}`,
      );

      const fileStream = fs.createReadStream(latestFile.path);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Error downloading file: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/csv')
  downloadCSV(@Res() res: Response) {
    try {
      const latestFile = this.getLatestFile('csv');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${latestFile.name}`,
      );

      const fileStream = fs.createReadStream(latestFile.path);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error downloading CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/excel')
  downloadExcel(@Res() res: Response) {
    try {
      const latestFile = this.getLatestFile('xlsx');

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${latestFile.name}`,
      );

      const fileStream = fs.createReadStream(latestFile.path);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error downloading Excel: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/info')
  getExportInfo() {
    try {
      const exportsDir = '/app/exports';
      const response: {
        csvFilename?: string;
        csvCreated?: Date;
        csvSize?: number;
        excelFilename?: string;
        excelCreated?: Date;
        excelSize?: number;
      } = {};

      if (fs.existsSync(exportsDir)) {
        // Get CSV info
        try {
          const csvFile = this.getLatestFile('csv');
          const csvStats = fs.statSync(csvFile.path);
          response.csvFilename = csvFile.name;
          response.csvCreated = csvStats.birthtime;
          response.csvSize = csvStats.size;
        } catch {
          // No CSV file found, continue
        }

        // Get Excel info
        try {
          const excelFile = this.getLatestFile('xlsx');
          const excelStats = fs.statSync(excelFile.path);
          response.excelFilename = excelFile.name;
          response.excelCreated = excelStats.birthtime;
          response.excelSize = excelStats.size;
        } catch {
          // No Excel file found, continue
        }
      }

      return response;
    } catch (error) {
      throw new HttpException(
        `Error getting export info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const exportsDir = '/app/exports';
      const filePath = path.join(exportsDir, filename);

      if (!filePath.startsWith(exportsDir)) {
        throw new HttpException('Invalid file path', HttpStatus.BAD_REQUEST);
      }

      if (!fs.existsSync(filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Error downloading file: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getLatestFile(extension: 'csv' | 'xlsx'): {
    name: string;
    path: string;
  } {
    const exportsDir = '/app/exports';

    if (!fs.existsSync(exportsDir)) {
      throw new HttpException(
        'Exports directory not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const files = fs
      .readdirSync(exportsDir)
      .filter(
        (f) => f.startsWith('weather_export_') && f.endsWith(`.${extension}`),
      )
      .map((f) => ({
        name: f,
        path: path.join(exportsDir, f),
        created: fs.statSync(path.join(exportsDir, f)).birthtime,
      }))
      .sort((a, b) => b.created.getTime() - a.created.getTime());

    if (files.length === 0) {
      throw new HttpException(
        `No ${extension.toUpperCase()} export files found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return files[0];
  }
}
